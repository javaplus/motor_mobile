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
  static sceneNameList = new Array("scene1", "scene2", "scene3", "scene4");
  

  constructor(public httpClientParm: HttpClient, private storage: Storage) {
    console.log("in TreeControl Page constructor");
    this.httpClient = httpClientParm;
    this.lastDirection = '5';
    this.myStorage = storage;
    TreeControlPage.initializeSceneData(this.myStorage);
  }

  static initializeSceneData(myStorage){
    // try to get scene data
    TreeControlPage.sceneNameList.forEach(sceneName => {
      myStorage.get(sceneName).then((sceneData)=>{
        if(!sceneData){
          let sceneStuff = TreeControlPage.initMotorData(5);
         myStorage.set(sceneName, sceneStuff);
        }
      });
      
    });
    myStorage.set("motorURL1", "http://192.168.0.50:5000/move");
    myStorage.set("motorURL2", "http://192.168.0.52:5000/move");
    myStorage.set("motorURL3", "http://192.168.0.54:5000/move");
    myStorage.set("motorURL4", "http://192.168.0.56:5000/move");
    myStorage.set("motorURL5", "http://192.168.0.58:5000/move");
  }

  static initMotorData(numOfMotors){
    let sceneStuff = {"movements":[]};

    for (let index = 0; index < numOfMotors; index++) {
      sceneStuff.movements[index] =     {
        "motor": `${index+1}`,
        "dir":"5",
        "speed" : "255",
        "time" : "13",
        "isDisabled" : true
      };
    }
    console.log(sceneStuff);
    return sceneStuff;
    
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
        if(movement.isDisabled==false){
         this.processMovement(movement);
        }
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
