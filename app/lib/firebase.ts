import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCeE6k6bGX6VkLUZSu2m49JFhJc24xbLGg",
    authDomain: "nice-story-2f183.firebaseapp.com",
    projectId: "nice-story-2f183",
    storageBucket: "nice-story-2f183.firebasestorage.app",
    messagingSenderId: "1022624277216",
    appId: "1:1022624277216:web:5f8ec54ba5c68d981f2685",
    measurementId: "G-E1082LMHM9"
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

export const db = getFirestore();

export default { db };
