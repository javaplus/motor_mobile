import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  httpClient : HttpClient;
  motorResponse: Observable<any>;
  lastDirection: string
  speed : string

  constructor(public httpClientParm: HttpClient) {
    this.httpClient = httpClientParm;
    this.lastDirection = '5'
  }

  test(event, name) {
    // alert(name + " is super cool!");
    this.motorResponse = this.httpClient.get('http://192.168.1.122:5000/test/' + name);
    this.motorResponse
    .subscribe(data => {
      console.log('response=', data);
      alert(data);
    });

  }
  move(event, direction, speed) {
    // alert(name + " is super cool!");
    let dir = speed>0?direction:this.lastDirection; // set dir to last direction if speed is zero
    let vector = dir + speed +'E';
    this.motorResponse = this.httpClient.get('http://192.168.1.122:5000/forward/' + vector);
    this.motorResponse
    .subscribe(data => {
      console.log('response=', data);
      this.lastDirection = dir;
    });

  }
  timedMove(event, direction, pspeed, time) {
    // alert(name + " is super cool!");
    let vector = {
      "direction": direction,
      "speed" : this.speed,
      "time": time
    }
    let body = JSON.stringify(vector);
    console.log(body);
    this.motorResponse = this.httpClient.post('http://localhost:5000/move', body, {
      headers: { 'Content-Type': 'application/json' }
    });
    this.motorResponse
    .subscribe(data => {
      console.log('response=', data);
    });

  }
}
