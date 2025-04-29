# React Native Webview 를 이용한 결제 창 처리 예제

웹뷰에서 새 창에 대한 처리를 하는 예제입니다. 예제에서는 결제창을 처리하도록 합니다.
- window.open 함수 오버라이드. window.open 함수 호출시 ReactNativeWebView 의 postMessage를 호출합니다. 함수 응답으로 Custom Close 함수가 담긴 객체를 전달합니다.
- window.opener 객체 오버라이드. postMessage 함수가 ReactNativeWebView 의 postMessage 함수를 호출하도록 변경.
- Webview onMessage 핸들러 구현. ReactNativeWebView 의 postMessage 로 전달된 데이터를 Message Type 에 따라 처리합니다.
- 예제에서는 역할을 명확히 하기 위에 각 웹뷰에서 필요한 부분을 나눠서 적용했습니다. 범용성을 위해서는 각 웹뷰에 적용된 내용들을 공통으로 정의해서 모두 적용하는것이 좋을것 같습니다.

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.
