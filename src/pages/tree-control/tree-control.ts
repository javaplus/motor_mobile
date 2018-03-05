import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-tree-control',
  templateUrl: 'tree-control.html'
})
export class TreeControlPage {
  httpClient: HttpClient;
  motorResponse: Observable<any>;
  lastDirection: string
  myStorage: Storage
  mytoast: Toast;
  sceneButtonInfo: Map<string, boolean>;
  productionMode: boolean = true;
  static sceneNameList = new Array("step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9", "step10", "step11", "step12", "step13", "step14", "step15", "step16", "step17", "step18", "step19", "step20", "step21");
  
  constructor(public httpClientParm: HttpClient, private storage: Storage, private toast: Toast) {
    console.log("in TreeControl Page constructor");
    this.httpClient = httpClientParm;
    this.lastDirection = '5';
    this.myStorage = storage;
    this.mytoast = toast;
    TreeControlPage.initializeSceneData(this.myStorage);
    this.initializeButtonInfo(false);
    console.log(this.sceneButtonInfo);
  }

  isStepEnabled(sceneName) {
    return this.sceneButtonInfo.get(sceneName);
  }
  initializeButtonInfo(defaultValue:boolean) {
    this.sceneButtonInfo = new Map();
    // take sceneNameList and build list with disable/enabled status
    TreeControlPage.sceneNameList.forEach(scenName => {
      this.sceneButtonInfo.set(scenName, defaultValue);
    });
    this.sceneButtonInfo.set("step1", true);

  }

  sceneNameList() {
    return TreeControlPage.sceneNameList;
  }

  static initializeSceneData(myStorage) {
    // try to get scene data
    TreeControlPage.sceneNameList.forEach(sceneName => {
      myStorage.get(sceneName).then((sceneData) => {
        if (!sceneData) {
          let sceneStuff = TreeControlPage.initMotorData(5);
          myStorage.set(sceneName, sceneStuff);
        }
      });

    });
    myStorage.set("motorURL2", "http://192.168.0.50:5000/move");
    myStorage.set("motorURL1", "http://192.168.0.52:5000/move");
    myStorage.set("motorURL3", "http://192.168.0.54:5000/move");
    myStorage.set("motorURL4", "http://192.168.0.56:5000/move");
    myStorage.set("motorURL5", "http://192.168.0.58:5000/move");
  }

  static initMotorData(numOfMotors) {
    let sceneStuff = { "movements": [] };

    for (let index = 0; index < numOfMotors; index++) {
      sceneStuff.movements[index] = {
        "motor": `${index + 1}`,
        "dir": "5",
        "speed": "255",
        "time": "13",
        "isDisabled": true
      };
    }
    console.log(sceneStuff);
    return sceneStuff;

  }


  enableNextStepButton(stepName: string) {
    //disable current button
    this.sceneButtonInfo.set(stepName, false);
    let thisStepNumber = stepName.substr("step".length)
    let nexStepNumber = Number.parseInt(thisStepNumber) + 1;
    let nextSceneName = "step" + nexStepNumber;
    //console.log("nextStep Numer " + nextSceneName);
    if (this.sceneButtonInfo.has(nextSceneName)) {
      this.sceneButtonInfo.set(nextSceneName, true);
    } else {
      // if we hit the end set the first button back to enabled
      this.sceneButtonInfo.set(TreeControlPage.sceneNameList[0], true);
    }

  }
  moveForScene(event, sceneName) {
    //console.log("scenName=" + sceneName);
    if (this.productionMode) {
      this.enableNextStepButton(sceneName);
    }
    this.myStorage.get(sceneName).then((scenedetails) => {
      //console.log(scenedetails);
      scenedetails.movements.forEach(movement => {
        if (movement.isDisabled == false) {
          this.processMovement(movement);
        }
      });
    });
    this.mytoast.show(`Step Instructions sent!!!`, '4000', 'center').subscribe(
      toast => {
        //console.log(toast);
      }
    );

  }

  processMovement(movement) {
    let vector = {
      "direction": movement.dir,
      "speed": `${movement.speed}`,
      "time": movement.time
    }
    // get motor url then call API
    let body = JSON.stringify(vector);
    console.log(body);
    this.callMotorAPI(movement.motor, body);

  }

  callMotorAPI(motorNum, body) {
    let motorURL = "NA";
    this.myStorage.get("motorURL" + motorNum).then((motorURL) => {
      this.httpClient.post(motorURL, body, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe(data => {
        console.log('response=', data);
      });
    });

  }

  toggleModes($event){
    console.log("Toggling modes");
    if(this.productionMode){
      this.initializeButtonInfo(false);
    }else{
      this.initializeButtonInfo(true);
    }
  }

}
