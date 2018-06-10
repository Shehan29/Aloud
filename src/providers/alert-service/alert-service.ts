import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertServiceProvider {
  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertController Provider');
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
