# Ionic Application in Capacitor
## Android deploy
  1. Για την αυθεντικοποιήση θα πρέπει να ορίσουμε ένα Intent-filter για να μπορεί να επιστρέψει στην εφαρμογή μετά το
  login.
    Πηγαίνουμε στο android\app\srv\main\AndroidManifest.xml και προσθέτουμε το παρακάτω

```
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT"/>
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="gr.oss.open.fitness" />
</intent-filter>
```

  2. Προσθέτουμε στο tag <application> το property android:usesCleartextTraffic="true"

  ## IOS Deploy
1. Για την αυθεντικοποιήση θα πρέπει να προσθέσουμε στο Info.plist μέσα στο dict το παρκάτω

```
<key>CFBundleURLTypes</key>
<array>
<dict>
  <key>CFBundleURLName</key>
  <string>gr.oss.open.fitness</string>
  <key>CFBundleURLSchemes</key>
  <array>
  <string>gr.oss.open.fitness</string>
  </array>
</dict>
</array>
```

2. Για τα Notifications έπρεπε να κάνω 

```
npm install @capacitor/push-notification
npm install @capacitor-community/fcm
```
Επιπλέον διαμόρφωσα αντίστοιχα και το PushNotificationService.

Ακόμα έπρεπε να μπώ στο Apple Developer και να δημιουργήσω ένα κλειδί 
- Μπαίνουμε στο https://developer.apple.com/account
- Cetificates, IDs, Profiles > Keys
- Πατάμε το + για δημιουργία νέου Συμπληρώνουμε τα πεδία Key Name, Key Usage Description και κάνουμε και check το Apple PushNotifications Service
- Πατάμε continue  και κατεβάζουμε και το αρχείο με το κλειδί γιατί θα το χρειαστούμε για το Firebase Console.
- Μετά μπαίνουμε  στο Firebase Console Φτιαάχνουμε ένα IOS Application και ακολουθούμε τις οδηγείες που μας λεεί συμπληρονώντας το κλειδί που εκδόσαμε από το λογαριαμό της Apple.
- Αφού ολοκληρώσουμε στο Firebase τότε πρέπει να κατεβάσουμε GoogleService-Info.plist και το αντιγράφουμε στην εφαρμογή μας στο φάκελο του ios/App/App
- Επιπλέον τροποποιούμε το αρχείο ios/App/Podfile
          
Από έτσι 
```          
target 'App' do
    capacitor_pods
    # Add your Pods here
end
```
          
Σε έτσι 
          
```
target 'App' do
    capacitor_pods
    # Add your Pods here
    pod 'FirebaseMessaging'
end
```
- Κάναμε και την παρακάτω αλλαγή στο αρχείο ios/App/App/AppDelegate.swift

Πάνω πάνω κάναμε τα παρκάτω import
```
import FirebaseCore
import FirebaseMessaging
```

Και μετά εκτελόυμε την παρακάτω εντολή `FirebaseApp.configure()`
```
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        FirebaseApp.configure()
        return true
    }
```

Και στο ίδιο αρχείο κάτω κάτω προσθέσαμε αυτέ τις δύο μεθόδους
```
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
        Messaging.messaging().token(completion: { (token, error) in
            if let error = error {
                NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
            } else if let token = token {
                NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: token)
            }
        })
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }
```