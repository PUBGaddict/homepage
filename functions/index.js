const functions = require('firebase-functions');
const gcs = require("@google-cloud/storage")();
const admin = require('firebase-admin');
const fs = require('fs');
const cors = require('cors')({ origin: true });
const statistics = {};

admin.initializeApp(functions.config().firebase);

exports.search = functions.https.onRequest((req, res) => {

	if (req.method === 'PUT') {
		res.status(403).send('Forbidden!');
	}

	let relevantAttributes = [
		"title",
		"strategy",
		"displayName",
		"tags"
	];

	cors(req, res, () => {
		var words = req.query["s"].split(" ");

		var ref = admin.database().ref("/fspots");
		ref.orderByChild("published").equalTo(true).once('value').then(snap => {
			if (!snap.exists()) {
				res.status(200).send("No data");
			}

			let candidates = snap.val(), i_word = 0;
			while (Object.keys(candidates).length >= 0 && i_word < words.length) {
				for (var i in candidates) {
					let hit = false;
					for (var r in relevantAttributes) {
						let attributeName = relevantAttributes[r];
						if (attributeName === "tags") {
							Object.keys(candidates[i][attributeName]).forEach(t => { hit = hit || t.indexOf(words[i_word]) >= 0; });
						} else {
							hit = hit || candidates[i][attributeName].indexOf(words[i_word]) >= 0;
						}
						if (hit) break;
					}
					if (!hit) {
						delete candidates[i];
					}
				}
				i_word++;
			}

			// maybe consider ratings when valuating results
			res.status(200).send(JSON.stringify(candidates));
		});
	});
})

exports.publish = functions.https.onRequest((req, res) => {

	// TODO: Authentication check.

	if (req.method === 'PUT') {
		res.status(403).send('Forbidden!');
	}

	let debug_msgs = [];

	cors(req, res, () => {
		let spotId = req.query["id"];


		function createTag (spot, tag) {
			console.log("spotid: " + spot.id);
			let tagRef = admin.database().ref("/tags/" + tag),
				m = {};
				m[spot.id] = true;
			return tagRef.update(m);
		}

		function concatTagsToPath(tags) {
			let tagNames = Object.keys(tags);
			tagNames.sort();			
			return tagNames.join("/");
		}

		let spotRef = admin.database().ref("/fspots/" + spotId);
		spotRef.once('value').then(snap => {
			if (!snap.exists()) {
				res.status(200).send("No spot found");
			}

			let spot = snap.val();
			spot.path = concatTagsToPath(spot.tags);
			spot.published = true;
			var promises = [];

			promises.push(spotRef.update(spot));

			for (let tag in spot.tags) {
				let menuRef = admin.database().ref("/menu/" + tag);
				menuRef.once('value').then(snap => {
					let bExists = !!snap.val(),
						val = bExists ? snap.val() : { amount : 0 },
						node = {};
					
					val.amount++;

					let amountLength = val.amount.toString().length,
						restLength = 6 - amountLength,
						leadingZeroString = "" + val.amount;
					for ( let i = 0; i < restLength; i++) {
						leadingZeroString = "0" + leadingZeroString;
					}
					val.key = leadingZeroString + "/" + admin.database().ref().push().key;

					console.log("key: " + val.key);

					node[tag] = val;
					promises.push(admin.database().ref("/menu/").update(node).then(() => {
						debug_msgs.push("updated menu");
					}));
				});
			}

			for (let id in spot.tags) {
				if ( spot.tags.hasOwnProperty(id)) {
					promises.push(createTag(spot, id));					
				}
			}

			Promise.all(promises).then(() => {	
				res.status(200).send("Publish done with messages: "+ debug_msgs.join(","));
			});		
		});		
	});
})

exports.processNewUser = functions.database.ref('/tempuser/{pushId}')
	.onCreate(event => {
		console.log('received new user request');
		const user = event.data.val();
		const key = event.data.key;
		const promises = [];

		promises.push(createUid());

		Promise.all(promises).then((a) => {
			admin.database().ref(`/tempuser/${key}`).remove();
		});		

		function createUid() {
			let o = {};
			o[user.uid] = {
				email: user.email,
				displayName: user.displayName
			};
			return admin.database().ref('uids/').update(o);
		}

})

exports.processNewSpot = functions.database.ref('/temp/{pushId}')
	.onCreate(event => {
		const post = event.data.val();
		const key = event.data.key;
		var sKey = makeid();

		readKey();

		function readKey() {
			console.log("checking if there is already a key named " + sKey);
			return admin.database().ref(`fspots/${sKey}`).once('value').then(snap => {
				if (snap.val() === null) {
					console.log("found an unused key, it is: " + sKey)
					processSpot();
					return sKey;
				} else {
					console.log("key " + sKey + " already in use, getting a new one.")
					sKey = makeid();
					console.log("new key is: " + sKey);
					readKey();
				}
			})
		}

		function processSpot() {
			// validation
			if (!post.strategy || !post.title || !post.videoId) {
				console.log("no strategy/title/videoId provided");
				return;
			} else {
				if (post.strategy === "youtube") {
					processYoutubeVideo();
				}
				if (post.strategy === "gfycat" || post.strategy === "twitch" || post.strategy === 'streamable' || post.strategy === 'vimeo') {
					processSlugVideo();
				}
			}
		}

		// persist to spot data
		function createSpot() {
			let tags = {};
			for (var i = 0; i < 3; i++) {
				if ( !!post.tags[i] ) {
					tags[post.tags[i]] = true;
				}
			}

			let spot = {
				id: sKey,
				date: admin.database.ServerValue.TIMESTAMP,
				title: post.title,
				strategy: post.strategy,
				videoId: post.videoId,
				startSeconds: post.startSeconds || null,
				endSeconds: post.endSeconds || null,
				displayName: post.displayName || null,
				tags : tags,
				path: "unpublished",
				published: false,
				rating : 0
			}			

			return admin.database().ref('/fspots/' + sKey)
				.set(spot);
		}		

		function processYoutubeVideo() {
			if (!post.videoId || !post.endSeconds) {
				console.log("no videoId or valid endtime provided for youtube")
				return;
			}
			console.log("data seems fine, going in!");

			let aPromises = [];
			aPromises.push(createSpot());

			// cleanup tmp folder
			Promise.all(aPromises).then((a) => {
				console.log(" pushed successfully");
				admin.database().ref(`temp/${key}`).remove();
			})
		}

		function processSlugVideo() {
			if (!post.videoId) {
				console.log("no video id provided for gfycat or twitch or streamable")
				return;
			}
			console.log("data seems fine, going in!");

			let aPromises = [];
			aPromises.push(createSpot());

			// cleanup tmp folder
			Promise.all(aPromises).then((a) => {
				console.log("pushed successfully");
				admin.database().ref(`temp/${key}`).remove();
			})
		}

		function makeid() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 5; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}
	})
