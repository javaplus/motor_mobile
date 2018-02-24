import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-tree-control',
  templateUrl: 'tree-control.html'
})
export class TreeControlPage {
  httpClient : HttpClient;
  motorResponse: Observable<any>;
  lastDirection: string
  myStorage: Storage
  

  constructor(public httpClientParm: HttpClient, private storage: Storage) {
    console.log("in TreeControl Page constructor");
    this.httpClient = httpClientParm;
    this.lastDirection = '5';
    this.myStorage = storage;
    TreeControlPage.initializeSceneData(this.myStorage);
    
  }

  static initializeSceneData(myStorage){
    // try to get scene data
    myStorage.get("scene1").then((scene1Data)=>{
      if(!scene1Data){
        let scene1 = {
          "movements":[
            {
              "motor":"1",
              "dir":"5",
              "speed" : "255",
              "time" : "13"
            },
            {
              "motor":"2",
              "dir":"6",
              "speed" : "255",
              "time" : "10"
            } 
          ]
       }
       myStorage.set("scene1", scene1);
      }
    });
    myStorage.set("motorURL1", "http://192.168.0.50:5000/move");
    myStorage.set("motorURL2", "http://192.168.0.52:5000/move");
  }

  test(event, name) {
    // alert(name + " is super cool!");
    this.motorResponse = this.httpClient.get('http://192.168.0.50:5000/test/' + name);
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
    this.motorResponse = this.httpClient.get('http://192.168.0.50:5000/forward/' + vector);
    this.motorResponse
    .subscribe(data => {
      console.log('response=', data);
      this.lastDirection = dir;
    });

  }
  timedMove(event, direction, speed, time) {
    // alert(name + " is super cool!");
    let vector = {
      "direction": direction,
      "speed" : `${speed}`,
      "time": time
    }
    let body = JSON.stringify(vector);
    console.log(body);
    this.motorResponse = this.httpClient.post('http://192.168.0.50:5000/move', body, {
      headers: { 'Content-Type': 'application/json' }
    });
    this.motorResponse
    .subscribe(data => {
      console.log('response=', data);
    });

  }
  moveForScene(event, sceneName) {
    this.myStorage.get(sceneName).then((scenedetails) => {
      console.log(scenedetails);
      scenedetails.movements.forEach(movement => {
        this.processMovement(movement);
      });
    });

    
    
  }

  processMovement(movement){
    let vector = {
      "direction": movement.dir,
      "speed" : `${movement.speed}`,
      "time": movement.time
    }
    // get motor url then call API
    let body = JSON.stringify(vector);
    console.log(body);
    this.callMotorAPI(movement.motor, body);
        
  }

  callMotorAPI(motorNum, body){
    let motorURL = "NA";
    this.myStorage.get("motorURL"+motorNum).then((motorURL) => {
      this.httpClient.post(motorURL, body, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe(data => {
        console.log('response=', data);
      });
   });

  }

}
