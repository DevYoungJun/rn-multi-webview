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
  const webViewRef1 = useRef<WebView>(null);
  const webViewRef2 = useRef<WebView>(null);
  const [popupUrl, setPopupUrl] = React.useState<string | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    borderWidth: 1,
    borderColor: '#000000',

  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <View style={{flex: 1, borderWidth: 1, borderColor: '#0000FF'}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <WebView
        ref={webViewRef1}
        source={{uri: 'https://kfriday-uploads-dev.s3.ap-northeast-2.amazonaws.com/temp/webview-test/index.html?timestamp=' + new Date().getTime()}}
        // source={{uri: 'https://app.kfri.day/'}}
        style={{flex: 1, borderWidth: 1, borderColor: '#FF0000'}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        javaScriptCanOpenWindowsAutomatically={true}
        setSupportMultipleWindows={true}
        injectedJavaScript={`(function() {
          window.open = function(data, target) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'windowOpen',
              data: data,
            }));
            return {
              close: function() {
                alert('new close function');
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'windowClose',
                  data: data,
                }));
              }
            };
          };
        })();`}
        onMessage={event => {
          console.log('## webview1 event = ', event);
          try {
            const message = JSON.parse(event.nativeEvent.data);
            console.log('## webview1 message = ', message);
            if (message.type === 'windowOpen') {
              const originalUrl = message.data;
              const url = originalUrl.startsWith('https')
                ? originalUrl
                : new URL(
                    originalUrl,
                    'https://kfriday-uploads-dev.s3.ap-northeast-2.amazonaws.com/temp/webview-test/',
                  ).href;

              // 팝업 웹뷰에 URL 전달
              setPopupUrl(url);
            } else if (message.type === 'windowClose') {
              // 팝업 웹뷰 닫기
              console.log('## popup window close');
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
          style={{flex: 3, borderWidth: 1, borderColor: '#00FF00'}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          setSupportMultipleWindows={true}
          injectedJavaScript={`(function() {
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
                // 메시지를 첫 번째 웹뷰로 전달
                webViewRef1.current?.postMessage(JSON.stringify(message.data));
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
