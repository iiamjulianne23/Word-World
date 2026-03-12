// firebase-config.js
// WordWorld — Firebase + Cloudflare Integration
// Place this in your project root and include BEFORE index.html closes

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ============================================================
// 🔧 REPLACE THESE WITH YOUR FIREBASE PROJECT VALUES
//    from: console.firebase.google.com → Project Settings
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyDWCnXCpahtQOSh-nuhU4JyCi7xP_PIGlk",
  authDomain: "word-world-1c7bc.firebaseapp.com",
  projectId: "word-world-1c7bc",
  storageBucket: "word-world-1c7bc.firebasestorage.app",
  messagingSenderId: "583044057719",
  appId: "1:583044057719:web:7cb67b0c7e623ecb98d472"
};

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);

// ============================================================
// AUTO SIGN-IN (anonymous — no login needed for young learners)
// ============================================================
let currentUID = null;

onAuthStateChanged(auth, user => {
  if (user) {
    currentUID = user.uid;
    loadCloudProgress(user.uid);
  } else {
    signInAnonymously(auth).catch(console.error);
  }
});

// ============================================================
// SAVE PROGRESS TO FIRESTORE
// ============================================================
export async function saveProgress(state) {
  if (!currentUID) return;
  try {
    await setDoc(doc(db, "players", currentUID), {
      stars:       state.stars,
      avatar:      state.avatar,
      levelStars:  state.levelStars,
      name:        localStorage.getItem('ww_name') || 'Explorer',
      updatedAt:   serverTimestamp()
    }, { merge: true });
    console.log("✅ Progress saved to Firebase");
  } catch (e) {
    console.warn("Firebase save failed, using localStorage:", e);
  }
}

// ============================================================
// LOAD PROGRESS FROM FIRESTORE
// ============================================================
export async function loadCloudProgress(uid) {
  try {
    const snap = await getDoc(doc(db, "players", uid));
    if (snap.exists()) {
      const data = snap.data();
      // Merge with local state (cloud wins for stars)
      window.gameState = {
        ...window.gameState,
        stars:      Math.max(window.gameState.stars, data.stars || 0),
        avatar:     data.avatar || window.gameState.avatar,
        levelStars: { ...window.gameState.levelStars, ...(data.levelStars || {}) }
      };
      if (data.name) {
        localStorage.setItem('ww_name', data.name);
        const ni = document.getElementById('nameInput');
        const pn = document.getElementById('playerName');
        if (ni) ni.value = data.name;
        if (pn) pn.textContent = data.name;
      }
      window.updateStarsDisplay?.();
      console.log("✅ Progress loaded from Firebase");
    }
  } catch (e) {
    console.warn("Firebase load failed, using localStorage:", e);
  }
}

// ============================================================
// LOG LEARNING EVENT (analytics / teacher dashboard)
// ============================================================
export async function logEvent(eventType, data) {
  if (!currentUID) return;
  try {
    await addDoc(collection(db, "events"), {
      uid:       currentUID,
      type:      eventType,   // e.g. 'level_complete', 'mood_check', 'kindness_act'
      ...data,
      timestamp: serverTimestamp()
    });
  } catch (e) {
    console.warn("Event log failed:", e);
  }
}

// ============================================================
// EXPORT so index.html can call these
// ============================================================
export { currentUID };
