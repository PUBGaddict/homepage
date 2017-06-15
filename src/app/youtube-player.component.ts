import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'youtube-player',
  template: `
      <iframe [id]="playerId" width="640" height="390" frameborder="0"></iframe>
  `
})
export class YoutubePlayerComponent implements AfterViewInit {
  public player: any;
  @Input() playerId: string = "player" + Math.floor(Math.random() * 1000);
  @Input() start: string = "0";
  @Input() end: string = "99";

  constructor() {    
   
  }

  ngAfterViewInit() {
    debugger;
    var YT = window["YT"];
    this.player = new YT.Player(this.playerId, {
/*      height: '390',
      width: '640',*/
      videoId: 'Dc6wTKOvpDk',
      playerVars: { 'autoplay': 1, 'loop': 1, 'controls': 0, 'fs': 0, 'iv_load_policy': 3, 'modestbranding': 1, 'playsinline': 1, 'rel': 0, 'showinfo': 0 },
      events: {
        onReady: this.onPlayerReady
      }
    });
  }

  onPlayerReady(event) {
    debugger;
    var START = parseInt(this.start,10);
    var END = parseInt(this.end,10);
    event.target.seekTo(START);
    setInterval(function () {
      if (event.target.getCurrentTime() > END) {
        event.target.seekTo(START);
      }
    }, 100)
    event.target.playVideo();
  }
}