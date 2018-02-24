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

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.myStorage = storage;
    // If we navigated to this page, we will have an item available as a nav param
    let sceneName = navParams.get('scene');
    //let thescene = "scene1";
    console.log(sceneName);
    this.myStorage.get(sceneName).then((sceneData) =>{
      console.log(sceneData);

      this.selectedScene = sceneData.movements[0];


    });
  }
}
