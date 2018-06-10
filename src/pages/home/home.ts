import { Component } from "@angular/core";
import { AlertController } from 'ionic-angular';
import { CameraServiceProvider } from '../../providers/camera-service/camera-service'
import { GoogleCloudVisionServiceProvider } from '../../providers/google-cloud-vision-service/google-cloud-vision-service';
import { WatsonAssistantProvider } from '../../providers/watson-assistant-service/watson-assistant-service';
import { OxfordDictionaryServiceProvider } from '../../providers/oxford-dictionary-service/oxford-dictionary-service'
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(private camera: CameraServiceProvider, private vision: GoogleCloudVisionServiceProvider, private assistant: WatsonAssistantProvider, private dictionary: OxfordDictionaryServiceProvider, private tts: TextToSpeech, private speechRecognition: SpeechRecognition, private alertCtrl: AlertController) {
    this.speechRecognition.requestPermission().then(() => console.log('Granted'), () => console.log('Denied'));
  }

  // take a picture
  takePicture() {
    this.camera.takePicture().then((imageData) => {
      return this.vision.getResponse(imageData).subscribe((result) => {
        const text = this.vision.getText(result);
        this.presentAlert('Vision API Response', text);
        this.read(text);
      }, err => {
        this.read("I am unable to read this at the moment.");
        this.presentAlert("API CALL FAILED", err.message.toString());
      });
    }, (err) => {
      this.read("I am unable to take a picture of this at the moment.");
      this.presentAlert("IMAGE CAPTURE FAILED", err.message.toString());
    });
  }

  // read text
  read(text) {
    this.tts.speak(text.replace(/(\r\n|\n|\r)/gm,"").toLowerCase()).then(() => console.log('Success')).catch((error: any) => this.presentAlert("Speaking Failed", error));
  }

  defineWord = false;
  readPage = false;
  speechOptions = {
      language: 'en-US',
      showPopup: false,
      matches: 1
  };

  // listen to user
  listen() {
    this.speechRecognition.startListening(this.speechOptions).subscribe((matches: Array<string>) => {
      try {
        const phrase = matches[0];
        if (this.defineWord) {
          this.defineWord = false;
          const lastWord = phrase.split(" ").splice(-1)[0];
          this.dictionary.define(lastWord).then((definition) => this.read(`${lastWord} is ${definition}`));
        } else {
          this.conversate(phrase).then(response => {
            if (this.readPage) {
              this.takePicture();
            } else {
              this.read(response);
            }
          });
        }
      } catch (e) {
        this.read(e.toString())
      }
    },
      (error) => this.presentAlert("SpeechRecognition Failed", error)
    );
  }

  // conversate
  conversate(message) {
    return new Promise((resolve, reject) => {
      this.assistant.conversate(message).then(response => {
          this.presentAlert("Conversation", response);
          this.defineWord = (response === 'What word would you like me to define?');
          this.readPage = (response === 'Reading');
          resolve(response);
        },
        error => {
          this.presentAlert("Watson API Error", error);
          reject(error);
        });
    });
  }

  debug = false;

  // present an alert to the user if `debug` = true
  presentAlert(title, message) {
    if (this.debug) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }
}
