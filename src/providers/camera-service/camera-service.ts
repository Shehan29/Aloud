import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';

@Injectable()
export class CameraServiceProvider {
  constructor(private cameraPreview: CameraPreview, private androidPermissions: AndroidPermissions) {
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

  takePicture() {
    return this.cameraPreview.takePicture(this.pictureOpts);
  }
}
