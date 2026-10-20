# Momentum — Personal To-Do Task Manager

Momentum is a private, offline-first task manager designed for smartphones. It is built with React, Vite, Tailwind CSS, Lucide React, IndexedDB, a generated PWA service worker, and Capacitor for Android.

No backend, account, API key, or internet connection is required after installation.

## Included features

- Create, edit, complete, reopen, and delete tasks
- Optional notes, dates, times, priorities, and categories
- Home dashboard with today's work, upcoming/completed/overdue totals, and daily progress
- Monthly calendar with task markers and date-specific task lists
- Name search; status, priority, and category filters; deadline/priority/created sorting
- Light and dark themes with five local accent choices
- IndexedDB persistence across browser/app restarts
- JSON backup export and validated backup restore
- Installable PWA with offline precaching
- Native Android project configured through Capacitor
- Phone safe-area support, touch-friendly controls, and responsive mobile layout

## Run locally

Requirements: Node.js 20 or newer and npm.

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. The app is mobile-first, but works in a desktop browser too.

Create a production build with:

```powershell
npm run build
npm run preview
```

The deployable PWA files are written to `dist/`.

## Install as a PWA

1. Serve the production build over HTTPS (or use the local Vite server during development).
2. Open it in Chrome on Android.
3. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
4. Launch Momentum from the new home-screen icon. Previously cached app screens and all task management continue to work offline.

The service worker updates automatically when a new production version is available.

## Build the Android APK with Android Studio

### Prerequisites

- Android Studio with Android SDK Platform 34 installed
- JDK 17 (Android Studio's bundled JDK is recommended)
- A USB cable if you want to install directly on a phone

The generated native project is already present in `android/` and uses application ID `com.momentum.tasks`.

### Sync web changes into Android

After changing the React application, always rebuild and sync:

```powershell
npm run cap:sync
```

Then open the native project:

```powershell
npm run cap:open
```

Alternatively, open the `android` folder directly from Android Studio. Let Gradle finish syncing and accept any request to install SDK Platform 34.

### Generate a debug APK

In Android Studio:

1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. Wait for the build notification.
3. Click **Locate**. The file is normally at `android/app/build/outputs/apk/debug/app-debug.apk`.

You can also build from a terminal configured with JDK 17:

```powershell
cd android
.\gradlew.bat assembleDebug
```

### Generate a signed release APK

1. Select **Build > Generate Signed Bundle / APK**.
2. Choose **APK**, then **Next**.
3. Create or select a private keystore. Keep the keystore and passwords backed up; Android updates must use the same signing key.
4. Select the `release` build variant and finish the wizard.
5. Find the output under `android/app/build/outputs/apk/release/`.

## Install the APK on a physical Android phone

### Copy and tap

1. Copy `app-debug.apk` or your signed release APK to the phone.
2. Open the file on the phone.
3. If prompted, allow **Install unknown apps** for the file manager or browser you used.
4. Tap **Install**, then open Momentum.

### ADB over USB

Enable Developer options and USB debugging on the phone, connect it, then run:

```powershell
adb devices
adb install -r .\android\app\build\outputs\apk\debug\app-debug.apk
```

The `-r` option preserves the app's local data when updating an existing debug installation signed with the same key.

## Data and backups

Tasks are stored in the browser/WebView's IndexedDB database named `momentum-tasks`. Appearance settings are stored in local storage. Clearing the browser's site data, uninstalling the Android app, or using **Delete all tasks** removes local data, so export a JSON backup first when needed.

Import intentionally replaces the current task list after confirmation. Imported fields are validated and normalized before being written to IndexedDB.

## Project structure

```text
src/
  components/       Reusable navigation, cards, dialogs, and forms
  services/         IndexedDB data access
  utils/            Dates, task rules, and import normalization
  views/            Home, task list, calendar, and settings screens
android/             Generated Capacitor Android Studio project
public/              App icons and static assets
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production PWA |
| `npm run preview` | Preview the production build |
| `npm run cap:sync` | Build the web app and copy it into Android |
| `npm run cap:open` | Open the Android project in Android Studio |
| `npm run android` | Build, sync, and open Android Studio |
