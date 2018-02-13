import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import {Component} from "@angular/core";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleCloudVisionServiceProvider } from '../../providers/google-cloud-vision-service/google-cloud-vision-service';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(private cameraPreview: CameraPreview, private vision: GoogleCloudVisionServiceProvider, private alertCtrl: AlertController, private androidPermissions: AndroidPermissions) {
    this.initializePreview();
    this.checkPermissions();
  }

  cameraPreviewOpts: CameraPreviewOptions = {
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height,
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
    this.cameraPreview.startCamera(this.cameraPreviewOpts).then(
      (res) => {console.log(res)},
      (err) => {console.log(err)}
    );
  }

  // check permissions for camera use
  checkPermissions(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
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
        this.presentAlert('Vision API Response', this.getText(result));
      }, err => {
        this.presentAlert("API CALL FAILED", err.message.toString());
      });
    }, (err) => {
      this.presentAlert("IMAGE CAPTURE FAILED", err.message.toString());
    });
  }

  // present an alert to the user
  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
