import { Component } from "@angular/core";
import { CameraServiceProvider } from '../../providers/camera-service/camera-service';
import { SpeechServiceProvider } from '../../providers/speech-service/speech-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(private camera: CameraServiceProvider, private speechRecognition: SpeechServiceProvider) {}

  // take a picture
  takePicture() {
    this.camera.takePicture();
  }

  // listen to user
  listen() {
    this.speechRecognition.listen();
  }
}
