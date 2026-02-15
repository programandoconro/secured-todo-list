# Secured Todo List

A simple todo list react-native app secured by device authentication methods. Tested on Android only.

## Installation

```
    npm install
```

## Run

Connect your device in debug mode (or emulator)

```
    npx react-native start
    # On another terminal
    npx react-native run-android --verbose
```

## Test

```
    npm run test
```

## Steps I did for this project

Install Java 17

```
    wget https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_linux-x64_bin.tar.gz\n
    tar xvf openjdk-17.0.2_linux-x64_bin.tar.gz\n
    sudo mv jdk-17.0.2 /opt/\n
    sudo tee /etc/profile.d/jdk17.sh <<EOF\nexport JAVA_HOME=/opt/jdk-17.0.2\nexport PATH=\$PATH:\$JAVA_HOME/bin\nEOF
    source /etc/profile.d/jdk17.sh\n
```

Install Android Studio on Linux: https://developer.android.com/studio/install#linux

Install Bare React Native with compatible version for expo local authentication module:

```
    npx @react-native-community/cli@latest init SecuredTodoList --version 0.81.6
```

Install `expo-local-authentication`: https://www.npmjs.com/package/expo-local-authentication?activeTab=readme

```
    npx install-expo-modules@latest
    npm install expo-local-authentication
```

## Production Build for Android

```
    cd android
    ./gradlew assembleRelease -x lintVitalRelease
    cd ..
    adb install -r android/app/build/outputs/apk/release/app-release.apk
```
