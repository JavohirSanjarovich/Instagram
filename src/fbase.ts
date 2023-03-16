import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/database";
import { getAuth, signInWithPopup, FacebookAuthProvider  } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDlsdYTE8tdeE1lt45MxXyLllvfq1YxNZ4",
  authDomain: "instagram-c9426.firebaseapp.com",
  projectId: "instagram-c9426",
  storageBucket: "instagram-c9426.appspot.com",
  messagingSenderId: "229389814602",
  appId: "1:229389814602:web:f26c91afb5c6f4b5340fb3"
};



firebase.initializeApp(firebaseConfig);
export const authService = firebase.auth();
export const faceBookLogin = async () => {
  const provider = new FacebookAuthProvider();
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
  } catch (error) {
    console.log(error);
  }
}
export const storageService = firebase.storage();
export const databaseService = firebase.database();
export const firestoreService = firebase.firestore();
export default firebase



