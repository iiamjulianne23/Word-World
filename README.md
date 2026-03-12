# WordWorld — Setup & Deployment Guide

## 🏗️ Project Structure

```
literacy-adventure/
├── index.html          ← Main game (all-in-one)
├── firebase-config.js  ← Firebase SDK + data sync
├── sw.js               ← Service worker (offline/PWA)
├── manifest.json       ← PWA manifest (iPhone home screen icon)
├── _worker.js          ← Cloudflare Pages edge worker
├── icons/              ← App icons (create 192px & 512px PNGs)
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-maskable.png
└── README.md
```

---

## 🔥 Firebase Setup (5 minutes)

1. Go to **https://console.firebase.google.com** → Create a project
2. Add a **Web App** → copy the config object
3. Paste your config into `firebase-config.js` (replace `YOUR_*` values)
4. Enable **Firestore Database** → Start in test mode
5. Enable **Anonymous Authentication** (Authentication → Sign-in methods)

### Firestore Security Rules (paste in Firebase Console)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /events/{eventId} {
      allow create: if request.auth != null;
      allow read: if false; // Teacher dashboard only — secure separately
    }
  }
}
```

---

## ☁️ Cloudflare Pages Deployment (3 minutes)

1. Push this folder to a **GitHub repo**
2. Go to **https://dash.cloudflare.com** → Pages → Create a project
3. Connect your GitHub repo
4. Build settings:
   - **Framework preset**: None
   - **Build command**: *(leave blank)*
   - **Build output directory**: `/` (or the folder name)
5. Click **Save and Deploy** ✅

The `_worker.js` file is automatically detected by Cloudflare Pages Functions.

---

## 📱 iPhone Home Screen (PWA)

1. Open the deployed URL in **Safari on iPhone**
2. Tap the **Share button** (box with arrow)
3. Tap **"Add to Home Screen"**
4. The app opens fullscreen like a native app!

For custom icons, create PNG files at 192×192 and 512×512 pixels  
and place them in the `icons/` folder.

---

## 🎮 Game Modules Overview

| Module | Skills Taught | SEL Focus |
|--------|--------------|-----------|
| 🔤 Letter Land | Alphabet, letter-sound correspondence | Curiosity, persistence |
| 🎵 Sound Safari | Phonics, CVC spelling | Self-regulation (patience) |
| 📖 Word World | Sight words, word recognition | Attention, focus |
| 📚 Story Time | Reading comprehension | Empathy (character feelings) |
| ✏️ Write Away | Creative writing, self-expression | Social awareness, identity |
| ✨ Story Builder | Narrative structure, vocabulary | Creativity, confidence |
| 🧘 Calm Corner | N/A (SEL dedicated) | Self-regulation, mindfulness |
| 🤝 Feelings Lab | N/A (SEL dedicated) | Emotional literacy, kindness |

---

## 🧑‍🏫 Educator Notes

### Mood Check-In
The app opens with a mood check-in asking "How are you feeling?" —  
this mirrors trauma-informed and SEL best practices (Zones of Regulation).

### Breathing Exercise
The animated breathing circle teaches box breathing (4-4-4) adapted  
for young children — proven to activate the parasympathetic nervous system.

### Kindness Tracker
The Kindness Challenge is a gamified prosocial behaviour reinforcement  
tool. Children self-report acts of kindness, building metacognition.

### Stories & Empathy
The Feelings Lab "Story" tab and social scenes teach perspective-taking  
and Theory of Mind — core competencies in social awareness.

### Reward Language
Reward messages focus on **effort and growth** ("You showed persistence!")  
not just performance — aligned with Carol Dweck's growth mindset research.

---

## 🔊 Sound Design

All sounds are generated programmatically using the **Web Audio API**  
(no audio files needed). The **Web Speech API** reads instructions  
and words aloud for non-readers.

- Letter clicks → musical note for that letter
- Correct answers → ascending melody
- Wrong answers → low buzzer (gentle, not scary)
- Level complete → fanfare
- Breathing exercise → sustained sine tones

---

## 🌐 Browser Support

| Platform | Support |
|----------|---------|
| iPhone Safari (iOS 14+) | ✅ Full |
| Chrome Desktop | ✅ Full |
| Firefox Desktop | ✅ Full |
| Edge Desktop | ✅ Full |
| Android Chrome | ✅ Full |
| Safari Desktop | ✅ Full |

---

## ✏️ Customisation

To add more words/letters, edit the arrays in `index.html`:
- `letterData` — letters A–Z with emojis
- `phonicsWords` — CVC words for spelling
- `sightWords` — sight word cards
- `readingPassages` — mini stories with comprehension questions
- `writingPrompts` — creative writing starters

Happy teaching! 🌟
