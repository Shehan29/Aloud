import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders} from '@angular/common/http';

@Injectable()
export class OxfordDictionaryServiceProvider {

  constructor(private http: HttpClient) {
    console.log('Hello OxfordDictionaryServiceProvider Provider');
  }

  // get response from API
  getResponse(word) {
    const key = "8d60dc910e5e73f09022001726bfff28";
    let headers = new HttpHeaders().set('Accept', 'application/json').set('app_id', '878adc7c').set('app_key', key);
    return this.http.get(`https://od-api.oxforddictionaries.com:443/api/v1/entries/en/${word}`, {headers})
  }

  // extract text from json response sent by API
  getDefinition(response) {
    const senses = response["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0];
    return senses["definitions"][0];
  }

  // define a word
  define(word) {
    const errorMessage = "not recognized";
    return new Promise( (resolve, reject) => {
      this.getResponse(word).subscribe(response => {
        try {
          resolve(this.getDefinition(response));
        } catch (e) {
          reject(errorMessage);
        }
      }, _ => {
        reject(errorMessage);
      });
    });
  }
}
