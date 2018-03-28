import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { Component } from "@angular/core";
import { AlertController } from 'ionic-angular';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleCloudVisionServiceProvider } from '../../providers/google-cloud-vision-service/google-cloud-vision-service';
import { WatsonAssistantProvider } from '../../providers/watson-assistant-service/watson-assistant-service';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(private cameraPreview: CameraPreview, private vision: GoogleCloudVisionServiceProvider, private assistant: WatsonAssistantProvider, private tts: TextToSpeech, private speechRecognition: SpeechRecognition, private http: HttpClient, private alertCtrl: AlertController, private androidPermissions: AndroidPermissions) {
    this.initializePreview();
    this.checkPermissions();
  }

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 50,
    width: window.screen.width,
    height: window.screen.height-100,
    camera: 'rear',
    tapPhoto: true,
    previewDrag: true,
    toBack: true,
    alpha: 1
  };

  pictureOpts: CameraPreviewPictureOptions = {
    width: 1280,
    height: 1280,
    quality: 85
  };

  // start camera
  initializePreview(){
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(res => console.log(res), err => console.log(err));
  }

  // check permissions for camera use
  checkPermissions(){
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA.toString()]);
    this.speechRecognition.requestPermission().then(() => console.log('Granted'), () => console.log('Denied'));
  }

  // extract text from json response sent by vision api
  getText(result) {
    try {
      const responses = result["responses"][0];
      return responses["textAnnotations"][0]["description"].toString();
    } catch (e) {
      return "No text detected";
    }
  }

  // take a picture
  takePicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      return this.vision.getText(imageData).subscribe((result) => {
        const text = this.getText(result);
        this.presentAlert('Vision API Response', text);
        this.read(text);
      }, err => {
        this.presentAlert("API CALL FAILED", err.message.toString());
      });
    }, (err) => {
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
          this.define(lastWord).then((definition) => this.read(`${lastWord} is ${definition}`));
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

  // define a word
  define(word) {
    return new Promise( (resolve, reject) => {
      let headers = new HttpHeaders().set('Accept', 'application/json').set('app_id', '878adc7c').set('app_key', '8d60dc910e5e73f09022001726bfff28');

      this.http.get(`https://od-api.oxforddictionaries.com:443/api/v1/entries/en/${word}`, {headers}).subscribe(response => {
        try {
          const senses = response["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0];
          // this.presentAlert("Definition", JSON.stringify(senses));

          const definition = senses["definitions"][0];
          resolve(definition);
        } catch (e) {
          reject(this.presentAlert("JSON Fail", e));
        }
      }, error => {
        reject(this.presentAlert("API FAIL", error));
      });
    });
  }

  debug = false;

  // present an alert to the user
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
