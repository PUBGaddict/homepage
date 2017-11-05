const functions = require('firebase-functions');
const gcs = require("@google-cloud/storage")();
const admin = require('firebase-admin');
const fs = require('fs');
const cors = require('cors')({ origin: true });
const statistics = {};

admin.initializeApp(functions.config().firebase);

exports.migrate = functions.https.onRequest((req, res) => {
	if (req.method === 'PUT') {
		res.status(403).send('Forbidden!');
	}

	cors(req, res, () => {				
		const spotRef = admin.database().ref("/fspots")
		spotRef.once('value').then(snap => {
			let spotMap = snap.val();
			
			for (let spot in spotMap) {
				admin.firestore().doc(`fspots/${spot}`).set(spotMap[spot]).then(result => {
					res.status(200).send("migrated dat shit");				
				})
			}
		});
	});		
});	

exports.migrateMenu = functions.https.onRequest((req, res) => {
	if (req.method === 'PUT') {
		res.status(403).send('Forbidden!');
	}

	cors(req, res, () => {				
		const menuRef = admin.database().ref("/menu")
		menuRef.once('value').then(snap => {
			let menuMap = snap.val();
			let aPromises = []
			
			for (let menu in menuMap) {
				aPromises.push(admin.firestore().doc(`menu/${menu}`).set({amount : menuMap[menu].amount}))
				for (let spot in menuMap[menu]['spots']) {
					aPromises.push(admin.firestore().doc(`menu/${menu}/spots/${spot}`).set(menuMap[menu]['spots'][spot]));
				}
			}
			Promise.all(aPromises).then(x => {
				res.status(200).send("migrated all menus");
			})
		});
	});		
});	

exports.homoTags = functions.https.onRequest((req, res) => {
	
		if (req.method === 'PUT') {
			res.status(403).send('Forbidden!');
		}

		var debug_msgs = [];
			
		cors(req, res, () => {				
			var menuRef = admin.database().ref("/menu");
			
			menuRef.once('value').then(snap => {
				// homo menu
				let menuMap = snap.val();
				for (let tagName in menuMap) {
					if (tagName.charAt(0) === tagName.charAt(0).toUpperCase()
						&& tagName.substring(1) === tagName.substring(1).toLowerCase()) {
							console.log("homologizing tag: " + tagName);
							debug_msgs.push(tagName);
							var tempObject = menuMap[tagName];
							delete menuMap[tagName];
							if (tagName.toLowerCase() in menuMap) {
								console.log("tagName " + tagName + " already exists in lowerCase");
								menuMap[tagName.toLowerCase()].spots = 
									Object.assign(menuMap[tagName.toLowerCase()].spots, tempObject.spots);
								menuMap[tagName.toLowerCase()].amount = Object.keys(menuMap[tagName.toLowerCase()].spots).length;
							} else {
								console.log("tagName " + tagName + " does not exist in lowerCase");
								menuMap[tagName.toLowerCase()] = tempObject;
							}

							// homo spots
							for (let spotId in tempObject.spots) {
								let spotRef = admin.database().ref("/fspots/" + spotId);
								spotRef.once('value').then(snap => {
									let spot = snap.val();
									spot.path = spot.path.replace(tagName, tagName.toLowerCase());
									delete spot.tags[tagName];
									spot.tags[tagName.toLowerCase()] = true;
									spotRef.set(spot);
								});
							}
						}
				}
				console.log("menuMap: " + JSON.stringify(menuMap));
				menuRef.set(menuMap);
				res.status(200).send("homologized menu and spot tags successfully for following tags: " + debug_msgs.join(","));
			})	
		});
	})

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
		let spotBody = JSON.parse(req.body);

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
			spot.title = spotBody.title;

			let tags = {};
			for (var i = 0; i < 3; i++) {
				if ( !!spotBody.tags[i] ) {
					tags[spotBody.tags[i]] = true;
				}
			}

			spot.tags = tags;
			spot.path = concatTagsToPath(spot.tags);
			spot.published = true;
			var promises = [];

			promises.push(spotRef.update(spot));

			for (let tag in spot.tags) {
				let menuRef = admin.database().ref("/menu/" + tag);
				menuRef.once('value').then(snap => {
					let bExists = !!snap.val(),
						val = bExists ? snap.val() : { amount : 0 },
						spots = bExists ? snap.val().spots : {},
						node = {};
					
					val.amount++;

					// spots
					spots[spot.id] = {
						date: spot.date,
						rating : 0
					}
					val.spots = spots;

					node[tag] = val;
					promises.push(admin.database().ref("/menu/").update(node).then(() => {
						debug_msgs.push("updated menu");
					}));
				});
			}

			Promise.all(promises).then(() => {	
				res.status(200).send("Publish done with messages: "+ debug_msgs.join(","));
			});		
		});		
	});
})


exports.reject = functions.https.onRequest((req, res) => {
	
	// TODO: Authentication check.

	if (req.method === 'PUT') {
		res.status(403).send('Forbidden!');
	}

	cors(req, res, () => {
		let spotId = req.query["id"];
		let spotRef = admin.database().ref("/fspots/" + spotId);
		spotRef.remove();
		res.status(200).send("Rejected the spot");
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
				if (post.strategy === "gfycat" || post.strategy === "twitch" || post.strategy === 'streamable' || post.strategy === 'vimeo' || post.strategy === 'reddit') {
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
				console.log("no video id provided for gfycat or twitch or streamable or vimeo or reddit")
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
