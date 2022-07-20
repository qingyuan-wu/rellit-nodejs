//This file is being hosted by another domain but is projected to the website thanks to Iframes.


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4xcLDmwv9ftepdQ9y6zzg1LL5McKo9Dg",
  authDomain: "chat-app-24cd8.firebaseapp.com",
  projectId: "chat-app-24cd8",
  storageBucket: "chat-app-24cd8.appspot.com",
  messagingSenderId: "225382720718",
  appId: "1:225382720718:web:8e7b5b867216c199115c9f",
  measurementId: "G-DCTYQHZL1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Get the name for the user
if (!localStorage.getItem('name')) {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
} else {
	name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name

// Change name
document.querySelector('#change-name').addEventListener('click', () => {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
	document.querySelector('#name').innerText = name
})

// Send a new chat message
document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault();
	firebase.firestore().collection('messages')
	.add({
		name: name,
		message: document.querySelector('#message-input').value,
		date: firebase.firestore.Timestamp.fromMillis(Date.now())
	})
	.then(function (docRef) {
		console.log('Document written with ID: ', docRef.id);
		document.querySelector('#message-form').reset()
	})
	.catch(function (error) {
		console.error('Error adding document: ', error);
	});
})

// Display chat stream
firebase.firestore().collection("messages")
.orderBy('date', 'asc')
.onSnapshot(function(snapshot) {
	document.querySelector('#messages').innerHTML = ""
	snapshot.forEach(function(doc) {
		var message = document.createElement('div')
		message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`
		document.querySelector('#messages').prepend(message)
	});
});

  // Remove all chat messages
  document.querySelector('#clear').addEventListener('click', () => {
  	firebase.firestore().collection('messages')
    .get()
    .then(function(snapshot) {
        snapshot.forEach(function(doc) {
			firebase.firestore().collection('messages').doc(doc.id).delete().then(function() {
				console.log('Document successfully deleted!');
			}).catch(function(error) {
				console.error('Error removing document: ', error);
			});
        });
    })
    .catch(function(error) {
        console.log('Error getting documents: ', error);
    });
})