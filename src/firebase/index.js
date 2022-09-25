import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyAMUOKOE4Epn7VZ_CV2NjJLBjUwsQuE4tE",
    authDomain: "order-94f58.firebaseapp.com",
    projectId: "order-94f58",
    storageBucket: "order-94f58.appspot.com",
    messagingSenderId: "511337164176",
    appId: "1:511337164176:web:cbe3d9fc7abfacef405715",
    measurementId: "G-8N69440K8C"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)