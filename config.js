import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyD2_Udams-PzixZN4Rt64VRs2wVtbeqCyY",
  authDomain: "barter-4ef3d.firebaseapp.com",
  databaseURL: "https://barter-4ef3d.firebaseio.com",
  projectId: "barter-4ef3d",
  storageBucket: "barter-4ef3d.appspot.com",
  messagingSenderId: "133116351876",
  appId: "1:133116351876:web:992b8e296342021b6379d1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();