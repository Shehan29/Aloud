import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AlertServiceProvider } from '../alert-service/alert-service';
import { Injectable } from '@angular/core';

@Injectable()
export class ReadingServiceProvider {

  constructor(private tts: TextToSpeech, private alertController: AlertServiceProvider) {
    console.log('Hello ReadingServiceProvider Provider');
  }

  // read text
  read(text) {
    this.tts.speak(text.replace(/(\r\n|\n|\r)/gm,"").toLowerCase()).then(() => console.log('Success')).catch((error: any) => this.alertController.presentAlert("Speaking Failed", error));
  }
}
