import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CameraPreview } from "@ionic-native/camera-preview";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AlertServiceProvider } from '../providers/alert-service/alert-service'
import { CameraServiceProvider } from '../providers/camera-service/camera-service'
import { ReadingServiceProvider } from '../providers/reading-service/reading-service'
import { SpeechServiceProvider } from '../providers/speech-service/speech-service'
import { GoogleCloudVisionServiceProvider } from '../providers/google-cloud-vision-service/google-cloud-vision-service';
import { WatsonAssistantProvider } from '../providers/watson-assistant-service/watson-assistant-service';
import { OxfordDictionaryServiceProvider } from '../providers/oxford-dictionary-service/oxford-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StatusBar,
    SplashScreen,
    AlertServiceProvider,
    CameraPreview,
    AndroidPermissions,
    HttpClient,
    CameraServiceProvider,
    ReadingServiceProvider,
    SpeechServiceProvider,
    GoogleCloudVisionServiceProvider,
    WatsonAssistantProvider,
    OxfordDictionaryServiceProvider,
    TextToSpeech,
    SpeechRecognition
  ]
})

export class AppModule {}
