// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {child, get, getDatabase, ref} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase


async function getData() {
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
        let data = await (await fetch(process.env.NEXT_PUBLIC_SERVER_URL)).json()
        console.log("Received data from local db")
        return Array.from(new Map(Object.entries(data["pokemons"])).values())
    }

    const app = initializeApp(firebaseConfig);
    const dbRef = ref(getDatabase(app),"data")
    const data = await get(child(dbRef,"pokemons"))
    return Array.from(new Map(Object.entries(data.val())).values())
}

export default getData;

