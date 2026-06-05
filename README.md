# 🌿 Digital Nutrition Auditor

A mindful digital wellbeing application that reframes your screen time as "nutrition." Track your cognitive intake, find balance, and grow your mental garden.

![Version](https://img.shields.io/badge/version-1.0.0-sage)
![License](https://img.shields.io/badge/license-MIT-slate)
![Build](https://img.shields.io/badge/build-passing-green)

---

## ✨ Why Digital Nutrition?
Most screen-time trackers just tell you *how long* you used your phone. The Digital Nutrition Auditor tells you **what** you consumed and **how it made you feel**.

We categorize digital content into four "Macros":
*   🌿 **Educational:** Deep learning, documentation, skill-building.
*   🎭 **Entertainment:** Movies, gaming, leisure.
*   ⚠️ **High-Stress:** News, work emails, intense debates.
*   🧪 **Brain-Rot:** Infinite scrolling, clickbait, passive consumption.

## 🚀 Key Features
*   **The Plate (Radar Chart):** Visualize your daily macro balance in real-time.
*   **Cognitive Garden (Heatmap):** A 28-day contribution grid for your mental health.
*   **Zen Milestones:** Unlock unique badges like *The Monk* or *Pattern Breaker* based on your habits.
*   **FDA-Style Nutrition Label:** Generate a shareable "Digital Nutrition Facts" label for your day.
*   **Smart Life Coach:** Personalized advice based on your current limits and goals.
*   **Secure Sync:** Real-time Google Cloud sync with session-only security.

## 🛠️ Tech Stack
*   **Frontend:** React (Vite) + TypeScript
*   **Styling:** Tailwind CSS 4.x (Zen Theme)
*   **State:** Zustand (Local-First + Persistent)
*   **Backend:** Firebase (Auth, Firestore, Analytics)
*   **Charts:** Recharts
*   **Export:** html-to-image

## 🛡️ Security & Privacy
This app was built with a "Privacy-First" mindset:
1.  **Local-First:** Data stays on your device until you choose to sign in.
2.  **Session-Only Auth:** Automatically logged out when you close the tab.
3.  **Inactivity Guard:** Auto-logout after 60 minutes of zero interaction.
4.  **Content Security Policy (CSP):** Strict digital perimeter to prevent XSS.
5.  **User Isolation:** Airtight Firestore rules ensuring your data is your own.

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js 18+
*   A Firebase Project

### Quick Start
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/Digital-Nutrition-Auditor.git
    cd Digital-Nutrition-Auditor
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root and add your Firebase keys:
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    VITE_FIREBASE_MEASUREMENT_ID=...
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with mindfulness for a better digital world.*
