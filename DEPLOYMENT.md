# Deployment & Maintenance Guide: Digital Nutrition Auditor

This guide covers how to launch your app to the world and how to keep it updated.

## 1. Choosing a Hosting Provider
Since this is a modern React (Vite) app, the two best options are **Netlify** or **Vercel**. Both are free, extremely fast, and offer automatic updates.

### Recommended: Netlify (Easiest for Vite)
1.  **Create a GitHub Repository:**
    *   Go to GitHub and create a new repository (e.g., `digital-nutrition-auditor`).
    *   Upload your code:
        ```bash
        git init
        git add .
        git commit -m "Initial launch"
        git branch -M main
        git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
        git push -u origin main
        ```
2.  **Connect to Netlify:**
    *   Go to [Netlify](https://app.netlify.com/) and sign in.
    *   Click **"Add new site"** > **"Import an existing project"**.
    *   Connect to GitHub and select your repository.
3.  **Configure Build Settings:**
    *   **Build Command:** `npm run build`
    *   **Publish directory:** `dist`
4.  **Crucial: Add Environment Variables:**
    *   Go to **Site Settings > Environment variables**.
    *   Add every key from your `.env` file (e.g., `VITE_FIREBASE_API_KEY`, etc.). **Without this, your app will crash in production.**
5.  **Deploy!** Netlify will build and give you a public URL.

---

## 2. Handling Future Updates
One of the best things about Netlify/Vercel is **Continuous Deployment (CI/CD)**.

### How to update your app:
Whenever you want to add a new feature or fix a bug:
1.  Make your changes in the code.
2.  Push them to GitHub:
    ```bash
    git add .
    git commit -m "Update: Added new badge type"
    git push origin main
    ```
3.  **That's it!** Netlify will automatically detect the new code, rebuild your app, and update your website in about 1 minute.

---

## 3. Important: Firebase Security Rules
Currently, your database is in **"Test Mode"** (anyone can read/write). Before you share this app with many people, you should secure it.

1.  Go to **Firebase Console > Firestore > Rules**.
2.  Change them to only allow users to edit their **own** data:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    ```

## 4. Production Checklist
- [ ] Check if the **Avatar** works on the live site (Ensure `referrerPolicy="no-referrer"` is there).
- [ ] Ensure **Environment Variables** are set in your hosting provider's dashboard.
- [ ] Run `npm run build` locally once more to ensure there are no errors before pushing to GitHub.

## 5. High-Level Security Features Implemented
The app includes several built-in security features:
1.  **Content Security Policy (CSP):** Implemented in `index.html` to prevent XSS (Cross-Site Scripting) and unauthorized data connections.
2.  **Environment Isolation:** No Firebase keys are committed to GitHub (via updated `.gitignore`).
3.  **Secure Referrer Policy:** Prevents leaking user navigation data to 3rd party sites.
4.  **Firestore User Isolation:** (Requires manual step 3) Ensures only you can access your private digital diet data.
5.  **Strict Referrer Policy on Images:** Specifically protects the privacy of Google Profile images.

**Your app is now ready for the world with enterprise-grade security basics!**
