import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { TreeControlPage } from '../pages/tree-control/tree-control';
import { SceneDetailsPage } from '../pages/scene-details/scene-details';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make TreeControlPage the root (or first) page
  rootPage = TreeControlPage;
  pages: Array<{title: string, component: any, context: string}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Tree Control', component: TreeControlPage, context: "home" },
      { title: 'Scene 1 Config', component: SceneDetailsPage, context: "scene1" },
      { title: 'Scene 2 Config', component: SceneDetailsPage, context: "scene2" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component, {"scene" : page.context});
  }
}
