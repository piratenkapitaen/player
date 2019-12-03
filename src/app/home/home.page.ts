import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AudioService } from '../services/audio.service';
import { StreamState } from '../interfaces/stream-state';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  // files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};
  storageDirectory: string;
  file_name: string;

  range_position: any = 0;
  position: any = 0;

  constructor(public plt: Platform, private audioService: AudioService) {

    // listen to stream state
    this.audioService.getState()
    .subscribe(state => {
      this.state = state;
    });

    // copied from old Aplayer Method: storageDirectory
    if (this.plt.is('android')) {
    	console.log("Platform: Android");
      this.storageDirectory = "file:///android_asset/www/assets/audio/";
    } else if (this.plt.is('ios')){
    	console.log("Platform: iOS");
      this.storageDirectory = "../assets/audio/";
      this.storageDirectory = "./assets/audio/";
    } else { // PWA
    	console.log("Platform: PWA");
      this.storageDirectory = "./assets/audio/";
    }

  }

  ngOnInit() {
  }


  playStream(url) {
    this.audioService.playStream(url)
    .subscribe(events => {
      // listening for fun here
    });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.file_name = file.name;

    // this.position = 0;
    // this.range_position = 0;

    // alternatively: use this.storageDirectory + this.filename
    // or: "file:///android_asset/www/assets/audio/" + this.filename
    // as done in Aplayer
    this.playStream(file.path);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
  	console.log("Wert: "+change.target.value);
    this.audioService.seekTo(change.target.value);
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave called");
    this.audioService.pause();
  }

	public files = [{
        'name': 'Atempause',
        'filename': 'Atempause.mp3',
        'path': 'assets/audio/Atempause.mp3'
    }, {
        'name': 'liebevolle Güte',
        'filename': 'LiebevolleGuete.mp3',
        'path': 'assets/audio/LiebevolleGuete.mp3'
    }] 


}
