import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'youtube-player',
  template: `
      <div [id]="playerId"></div>
  `
})
export class YoutubePlayerComponent implements AfterViewInit {
  public player: any;
  @Input() playerId: string = "player" + Math.floor(Math.random() * 100000);
  @Input() vid: string = "";
  @Input() start: number = 0;
  @Input() end: number = 99;
  @Input() height: string = "390";
  @Input() width: string = "640";

  constructor() {
   
  }

  ngAfterViewInit() {
    this.player = new window["YT"].Player(this.playerId, {
      height: this.height,
      width: this.width,
      videoId: this.vid,
      playerVars: { 'autoplay': 1, 'loop': 1, 'controls': 0, 'fs': 0, 'iv_load_policy': 3, 'modestbranding': 1, 'playsinline': 1, 'rel': 0, 'showinfo': 0 },
      events: {
        'onReady': this.onPlayerReady.bind(this)
      }
    });
  }

  onPlayerReady(event) {
    var player = event.target,
        START = this.start,
        END = this.end;
    player.mute();
    player.seekTo(START);
    setInterval(function () {
      if (player.getCurrentTime() > END) {
        player.seekTo(START);
      }
    }, 100)
    player.playVideo();
  }
}