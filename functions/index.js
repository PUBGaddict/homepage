const functions = require('firebase-functions');
const gcs = require("@google-cloud/storage")();
const admin = require('firebase-admin');
const fs = require('fs');
const cors = require('cors')({ origin: true });
const statistics = {};

admin.initializeApp(functions.config().firebase);

exports.news = functions.https.onRequest((req, res) => {
	if (req.method === 'PUT') {
		res.status(403).send('Forbidden!');
	}

	cors(req, res, () => {
		admin.firestore().collection("/news").add({
			"title": "Early Access Week 27 Update",
			"timestamp": 1506384000000,
			"date": "26.09.2017",
			"articles": [{
				"heading": "UI/UX",
				"paragraphs": [{
					"text": "Enhanced breathing animation in the Spectator mode"
				}, {
					"text": "Added a new feature in the Settings to adjust the zoom-in and zoom-out speed of the World Map"
				}]
			}, {
				"heading": "Bug Fixes",
				"paragraphs": [{
					"text": "Fixed a bug that made the shadows disappear mid-game"
				}, {
					"text": "Fixed a graphic bug related to players who left the game inside of the starting airplane"
				}, {
					"text": "Fixed a bug that prevented users from seeing the full alias of their teammates"
				}, {
					"text": "Improved the synchronization between player aim and spectator aim"
				}, {
					"text": "Fixed a bug to accurately display teammates' marker direction in Free Look mode "
				}]
			}]
		})

		admin.firestore().collection("/news").add({
			"title": "We are officially in BETA now :)",
			"timestamp": 1499644800000,
			"date": "07.10.2017",
			"articles": [{
				"heading": "Please feel free to add your own cool PUBG related videos!"
			}]
		})
	})
});


exports.migrateSpots = functions.https.onRequest((req, res) => {
	if (req.method === 'PUT') {
		res.status(403).send('Forbidden!');
	}

	cors(req, res, () => {
		const spotRef = admin.database().ref("/fspots")
		spotRef.once('value').then(snap => {
			let spotMap = snap.val();

			for (let spot in spotMap) {
				admin.firestore().doc(`spots/${spot}`).set(spotMap[spot]).then(result => {
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
				aPromises.push(admin.firestore().doc(`/menu/${menu}`).set({ amount: menuMap[menu]['spots'].length }))
				for (let spot in menuMap[menu]['spots']) {
					aPromises.push(admin.firestore().doc(`/menu/${menu}/spots/${spot}`).set(menuMap[menu]['spots'][spot]));
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

		let collection = admin.firestore().collection("/spots");
		collection.where('published', '==', true).get().then(snap => {
			let candidates = {}, i_word = 0;
			snap.forEach(doc => {
				candidates[doc.id] = doc.data();
			});
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

		let docRef = admin.firestore().doc("/spots/" + spotId);
		docRef.get().then(doc => {
			if (!doc.exists) {
				res.status(200).send("No spot found");
			}

			let spot = doc.data();
			spot.title = spotBody.title;

			let tags = {};
			for (var i = 0; i < 3; i++) {
				if (!!spotBody.tags[i]) {
					tags[spotBody.tags[i]] = true;
				}
			}

			spot.tags = tags;
			spot.path = concatTagsToPath(spot.tags);
			spot.published = true;
			var promises = [];

			promises.push(docRef.update(spot));

			for (let tag in spot.tags) {
				let menuRef = admin.firestore().doc("/menu/" + tag);
				menuRef.get().then(snap => {
					let bExists = snap.exists,
						val = bExists ? snap.data() : { amount: 0 };

					val.amount++;

					promises.push(menuRef.set(val, { merge: true }).then(() => {
						promises.push(admin.firestore().doc(`/menu/${tag}/spots/${spotId}`).set({
							date: spot.date,
							rating: 0
						}));
						debug_msgs.push("updated menu");
					}));
				});
			}

			Promise.all(promises).then(() => {
				res.status(200).send("Publish done with messages: " + debug_msgs.join(","));
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
		let spotRef = admin.firestore().doc("/spots/" + spotId).delete()
			.then(x => {
				res.status(200).send("Rejected the spot");
			})
			.catch(x => {
				res.status(501).send("Something went wrong");
			});
	});
})

exports.processUser = functions.firestore.document('/tempuser/{pushId}')
	.onCreate(event => {
		console.log('received new user request');
		const user = event.data.data();
		const key = event.params.pushId;
		const promises = [];

		promises.push(createUid());

		Promise.all(promises).then((a) => {
			admin.firestore().doc(`/tempuser/${key}`).delete();
		});

		function createUid() {
			return admin.firestore().doc(`uids/${user.uid}`).set({
				email: user.email,
				displayName: user.displayName
			});
		}

	})

exports.processSpot = functions.firestore.document('/temp/{pushId}')
	.onCreate(event => {
		const post = event.data.data();
		const key = event.params.pushId;
		var sKey = makeid();
		return readKey();
		console.log("starting processing new spot in temp: " + post.toString());

		function readKey() {
			console.log("checking if there is already a key named " + sKey);
			return admin.firestore().doc(`spots/${sKey}`).get().then(doc => {
				if (!doc.exists) {
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
					return processYoutubeVideo();
				}
				if (post.strategy === "gfycat"  || post.strategy === "twitch" ||  post.strategy === 'streamable' || post.strategy === 'vimeo' || post.strategy === 'reddit') {
					return processSlugVideo();
				}
			}
		}

		// persist to spot data
		function createSpot() {
			let tags = {};
			for (var i = 0; i < 3; i++) {
				if (!!post.tags[i]) {
					tags[post.tags[i]] = true;
				}
			}

			let spot = {
				id: sKey,
				date: admin.firestore.FieldValue.serverTimestamp(),
				title: post.title,
				strategy: post.strategy,
				videoId: post.videoId,
				startSeconds: post.startSeconds || null,
				endSeconds: post.endSeconds || null,
				displayName: post.displayName || null,
				tags: tags,
				path: "unpublished",
				published: false,
				rating: 0
			}

			return admin.firestore().doc('/spots/' + sKey)
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
				admin.firestore().doc(`temp/${key}`).delete();
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
				return admin.firestore().doc(`temp/${key}`).delete();
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
