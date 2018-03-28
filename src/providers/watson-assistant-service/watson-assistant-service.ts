import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WatsonAssistantProvider {

  constructor(private http: HttpClient) {
    console.log('Hello Watson Provider');
  }

  link = "http://192.168.0.22:3000/message";

  conversate(text) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.link}?text=${encodeURIComponent(text)}`).subscribe(data => {
        resolve(data['output']);
      },error => {
        reject(error.toString());
      });
    });
  }
}
