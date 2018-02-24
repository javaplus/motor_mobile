import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-scene-details',
  templateUrl: 'scene-details.html'
})
export class SceneDetailsPage {
  selectedScene: any;
  myStorage: Storage;
  sceneName : string

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.myStorage = storage;
    // If we navigated to this page, we will have an item available as a nav param
    this.sceneName = navParams.get('scene');
    //let thescene = "scene1";
    console.log(this.sceneName);
    this.myStorage.get(this.sceneName).then((sceneData) =>{
      console.log(sceneData);

      this.selectedScene = sceneData;


    });
  }
  save(event) {
    // alert(name + " is super cool!");
    console.log(this.selectedScene);
    // let's write the updates back to storage.
    this.myStorage.set(this.sceneName, this.selectedScene);
  }
}
