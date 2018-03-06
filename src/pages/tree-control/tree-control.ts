import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {LoadingController} from 'ionic-angular';

@Component({
  selector: 'page-tree-control',
  templateUrl: 'tree-control.html'
})
export class TreeControlPage {
  motorResponse: Observable<any>;
  sceneButtonInfo: Map<string, {enabled:boolean, notes:string}>;
  productionMode: boolean = true;
  currentScene: string = null;
  static sceneNameList = new Array("step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9", "step10", "step11", "step12", "step13", "step14", "step15", "step16", "step17", "step18", "step19", "step20", "step21");
  
  constructor(private httpClient: HttpClient, private myStorage: Storage,private loadingCtrl: LoadingController) {
    console.log("in TreeControl Page constructor");
    //this.myStorage = storage;
    TreeControlPage.initializeSceneData(this.myStorage);
    if(this.currentScene==null){
      this.initializeButtonInfo(false, "step1");
      this.currentScene = "step1";
    }
    console.log(this.sceneButtonInfo);
  }

  isStepEnabled(sceneName) {
    var sceneinfo = this.sceneButtonInfo.get(sceneName);
    if(sceneinfo!=undefined){
        return sceneinfo.enabled;
    }else{
      return false;
    }
  }

  getStepDetails(stepName){
    return this.sceneButtonInfo.get(stepName);
  }

  initializeButtonInfo(defaultValue:boolean, selectedScene:string) {
    this.sceneButtonInfo = new Map();
    // take sceneNameList and build list with disable/enabled status
    TreeControlPage.sceneNameList.forEach(sceneName => {
      this.myStorage.get(sceneName).then(sceneInfo=>{
        if(sceneName!=selectedScene){
          this.sceneButtonInfo.set(sceneName, {enabled:defaultValue,notes:sceneInfo.notes});
        }else{
          this.sceneButtonInfo.set(sceneName, {enabled:true,notes:sceneInfo.notes});
        }
      });
      
    });
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
    let sceneStuff = { "movements": [], "notes":""};

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
    if(this.productionMode){
      //disable current button
      this.sceneButtonInfo.get(stepName).enabled=false;
    }
    let thisStepNumber = stepName.substr("step".length)
    let nexStepNumber = Number.parseInt(thisStepNumber) + 1;
    let nextSceneName = "step" + nexStepNumber;
    //console.log("nextStep Numer " + nextSceneName);
    if (this.sceneButtonInfo.has(nextSceneName)) {
      this.sceneButtonInfo.get(nextSceneName).enabled=true;
      this.currentScene=nextSceneName;
    } else {
      // if we hit the end set the first button back to enabled
      this.sceneButtonInfo.get(TreeControlPage.sceneNameList[0]).enabled = true;
      this.currentScene="step1";
    }

  }
  moveForScene(event, sceneName) {
    this.presentLoadingCircles();
    //console.log("scenName=" + sceneName);
    this.enableNextStepButton(sceneName);
    
    this.myStorage.get(sceneName).then((scenedetails) => {
      //console.log(scenedetails);
      scenedetails.movements.forEach(movement => {
        if (movement.isDisabled == false) {
          this.processMovement(movement);
        }
      });
    });

  }

  presentLoadingCircles() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Moving Props Now... Please wait till all movement stops before clicking next step...',
      duration: 3000
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
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
      console.log("currentscene=" + this.currentScene);
      this.initializeButtonInfo(false, this.currentScene);
    }else{
      this.initializeButtonInfo(true, null);
    }
  }

  getNotesForStepName(stepName){
    this.myStorage.get(stepName).then(value=>{

    });
  }

}
