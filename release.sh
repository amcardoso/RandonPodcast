#!/bin/bash

echo "Limpando o diretorio de build"
rm platforms/android/build/outputs/apk/*.apk

echo "Gerando a build para o ambiente $1"
ionic cordova build android --release --keystore="keystore.jks" --storePassword=approva --alias=approva

echo "Assinando a build"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks -storepass approva platforms/android/build/outputs/apk/android-release-unsigned.apk approva

echo "Rodando o zipalign no build"
zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk platforms/android/build/outputs/apk/approva-app.apk
