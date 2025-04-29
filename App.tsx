/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef} from 'react';
import {SafeAreaView, StatusBar, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import WebView from 'react-native-webview';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const webViewRef1 = useRef<WebView>(null); // 기본 웹뷰
  const webViewRef2 = useRef<WebView>(null);  // 팝업 웹뷰
  const [popupUrl, setPopupUrl] = React.useState<string | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    borderWidth: 1,
    borderColor: '#000000',
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{flex: 1}}>
        <WebView
          ref={webViewRef1}
          source={{uri: 'https://app.kfri.day/'}}
          style={{flex: 1}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          javaScriptCanOpenWindowsAutomatically={true}
          setSupportMultipleWindows={true}
          injectedJavaScript={`(function() {
            // window.open 객체 재정의
            window.open = function(data, target) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'windowOpen',
                data: data,
              }));
              return {
                close: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'windowClose',
                    data: data,
                  }));
                }
              };
            };
          })();`}
          onMessage={event => {
            try {
              const message = JSON.parse(event.nativeEvent.data);
              // 메시지 유형에 따른 처리
              if (message.type === 'windowOpen') {
                // 팝업 웹뷰에 URL 전달
                setPopupUrl(message.data);
              } else if (message.type === 'windowClose') {
                // 팝업 웹뷰 닫기
                setPopupUrl(null);
              }
            } catch (e) {
              console.error('메시지 파싱 오류:', e);
            }
          }}
        />
        {popupUrl && (
          <WebView
            ref={webViewRef2}
            source={{uri: popupUrl}}
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
              // backgroundColor: 'white',
            }}
            containerStyle={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            setSupportMultipleWindows={true}
            injectedJavaScript={`(function() {
              // window.opener 객체 재정의
              window.opener = {
                postMessage: function(data) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'openerParentMessage',
                    data: data,
                  }));
                }
              };
            })();`}
            onMessage={event => {
              try {
                const message = JSON.parse(event.nativeEvent.data);
                if (message.type === 'openerParentMessage') {
                  // 메시지를 부모 웹뷰로 전달
                  webViewRef1.current?.injectJavaScript(`(function() {
                    window.dispatchEvent(new MessageEvent('message', {
                      data: ${JSON.stringify(message.data)},
                      origin: window.location.origin
                    }));
                    true;
                  })();`);
                }
              } catch (e) {
                console.error('메시지 파싱 오류:', e);
              }
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default App;
