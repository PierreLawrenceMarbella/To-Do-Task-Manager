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
- Native Android reminders with offset and custom times
- Resizable Jetpack Glance home-screen widget for today’s tasks
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

The generated native project is already present in `android/` and uses application ID `com.momentum.tasks`. It intentionally stays on Gradle/AGP 8.2.1, Kotlin 1.9.22, SDK 34, and JDK 17. If Android Studio asks which Gradle JVM to use, select JDK 17; do not select JVM 25 for this project.

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

If PowerShell is using another Java version, set JDK 17 for that terminal first:

```powershell
$env:JAVA_HOME='C:\Users\pierr\.jdks\jbr-17.0.14'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
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

## Android reminders

Reminder choices appear only in the native Android app. Add both a deadline date and time, then choose 5, 15, 30, or 60 minutes before the deadline, or enter a custom date and time. Momentum asks for notification permission only when the first reminder is enabled.

On Android 12 and newer, open **Settings > Task reminders** and enable **Precise alarms** for exact delivery. Without this permission, Momentum still schedules an approximate alarm and labels the status **May be delayed**. Android may suppress alarms after the app is force-stopped.

For a Xiaomi 12T/MIUI or HyperOS, open Momentum’s Android App info and:

1. Allow notifications.
2. Enable Autostart.
3. Set Battery saver to **No restrictions**.
4. Avoid force-stopping the app.

## Android home-screen widget

1. Install and open Momentum at least once so it can copy the current tasks to native storage.
2. Long-press an empty part of the Xiaomi home screen and choose **Widgets**.
3. Find **Momentum**, drag it onto the home screen, and resize it to the preferred small or medium size.

The widget is a native Jetpack Glance widget. It works offline, shows today’s pending tasks and completion progress, and opens the selected task in Momentum. Widget rows are read-only; task edits remain in the app so IndexedDB stays the single source of truth.

The widget refreshes immediately after task or accent-color changes, on relevant date/time and reboot events, and periodically at Android’s discretion.

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
| `npm test` | Run reminder, import, and widget-summary tests |
| `npm run cap:sync` | Build the web app and copy it into Android |
| `npm run cap:open` | Open the Android project in Android Studio |
| `npm run android` | Build, sync, and open Android Studio |
