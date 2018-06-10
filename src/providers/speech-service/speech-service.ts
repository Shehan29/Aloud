import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AlertServiceProvider } from '../alert-service/alert-service';
import { CameraServiceProvider } from '../camera-service/camera-service';
import { ReadingServiceProvider } from '../reading-service/reading-service';
import { WatsonAssistantProvider } from '../watson-assistant-service/watson-assistant-service';
import { OxfordDictionaryServiceProvider } from '../oxford-dictionary-service/oxford-dictionary-service';
import { Injectable } from '@angular/core';

@Injectable()
export class SpeechServiceProvider {

  constructor(private speechRecognition: SpeechRecognition, private camera: CameraServiceProvider, private assistant: WatsonAssistantProvider, private dictionary: OxfordDictionaryServiceProvider, private reader: ReadingServiceProvider, private alertController: AlertServiceProvider) {
    console.log('Hello OxfordDictionaryServiceProvider Provider');
    this.speechRecognition.requestPermission().then(() => console.log('Granted'), () => console.log('Denied'));
  }

  speechOptions = {
    language: 'en-US',
    showPopup: false,
    matches: 1
  };

  defineWord = false;
  readPage = false;

  // listen to user
  listen() {
    this.speechRecognition.startListening(this.speechOptions).subscribe((matches: Array<string>) => {
        try {
          const phrase = matches[0];
          if (this.defineWord) {
            this.defineWord = false;
            const lastWord = phrase.split(" ").splice(-1)[0];
            this.dictionary.define(lastWord).then((definition) => this.reader.read(`${lastWord} is ${definition}`));
          } else {
            this.conversate(phrase).then(response => {
              if (this.readPage) {
                this.camera.takePicture();
              } else {
                this.reader.read(response);
              }
            });
          }
        } catch (e) {
          this.reader.read(e.toString())
        }
      },
      (error) => this.alertController.presentAlert("SpeechRecognition Failed", error)
    );
  }

  // conversate
  conversate(message) {
    return new Promise((resolve, reject) => {
      this.assistant.conversate(message).then(response => {
          this.alertController.presentAlert("Conversation", response);
          this.defineWord = (response === 'What word would you like me to define?');
          this.readPage = (response === 'Reading');
          resolve(response);
        },
        error => {
          this.alertController.presentAlert("Watson API Error", error);
          reject(error);
        });
    });
  }
}
