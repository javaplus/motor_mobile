# motor_mobile

How to package to mobile:
ionic cordova build android --prod --release


jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore c:\devl\androidSDK\keys\my-release-key.jks app-release-unsigned.apk my-alias
