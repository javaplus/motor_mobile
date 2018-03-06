import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TreeControlPage } from '../tree-control/tree-control';
import { Toast } from '@ionic-native/toast';


@Component({
  selector: 'page-scene-details',
  templateUrl: 'scene-details.html'
})
export class SceneDetailsPage {
  selectedScene: any;
  myStorage: Storage;
  sceneName : string;
  nav:NavController;
  mytoast: Toast;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private toast: Toast) {
    this.myStorage = storage;
    this.nav = navCtrl;
    // If we navigated to this page, we will have an item available as a nav param
    this.sceneName = navParams.get('scene');
    this.mytoast = toast;
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
    // this.mytoast.show(this.sceneName +` Settings Saved!!!`, '4000', 'center').subscribe(
    //   toast => {
    //     //console.log(toast);
    //   }
    // );
    this.nav.setRoot(TreeControlPage, {"scene" : "home"});
  }
}
