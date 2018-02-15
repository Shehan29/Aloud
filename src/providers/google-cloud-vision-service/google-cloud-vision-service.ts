import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleCloudVisionServiceProvider {

  constructor(private http: HttpClient) {
    console.log('Hello GoogleCloudVisionServiceProvider Provider');
  }

  getText(imageData) {
    const base64Image = imageData.toString('base64');
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    };
    const key = "AIzaSyD9Cudvk4q-h2FYkpMUM8hc6h0ckrP3MsU";
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + key, body);
  }
}
