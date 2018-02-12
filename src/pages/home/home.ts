import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';
import {Component} from "@angular/core";
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(private cameraPreview: CameraPreview, private androidPermissions: AndroidPermissions) {
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

  // take a picture
  takePicture() {
    let picture = "";
    this.cameraPreview.takePicture(this.pictureOpts).then((imageData) => {
      picture = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
      picture = 'assets/img/test.jpg';
    });
    console.log(picture);
  }
}
