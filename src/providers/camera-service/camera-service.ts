import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import { GoogleCloudVisionServiceProvider } from '../google-cloud-vision-service/google-cloud-vision-service';
import { AlertServiceProvider } from '../alert-service/alert-service';
import { ReadingServiceProvider } from '../reading-service/reading-service';

@Injectable()
export class CameraServiceProvider {
  constructor(private cameraPreview: CameraPreview, private androidPermissions: AndroidPermissions, private vision: GoogleCloudVisionServiceProvider, private alertController: AlertServiceProvider, private reader: ReadingServiceProvider) {
    console.log('Hello CameraServiceProvider Provider');
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
  }

  // take a picture
  takePicture() {
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      return this.vision.getResponse(imageData).subscribe((result) => {
        const text = this.vision.getText(result);
        this.alertController.presentAlert('Vision API Response', text);
        this.reader.read(text);
      }, err => {
        this.reader.read("I am unable to read this at the moment.");
        this.alertController.presentAlert("API CALL FAILED", err.message.toString());
      });
    }, (err) => {
      this.reader.read("I am unable to take a picture of this at the moment.");
      this.alertController.presentAlert("IMAGE CAPTURE FAILED", err.message.toString());
    });
  }
}
