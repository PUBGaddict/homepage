import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'youtube-player',
  template: `
      <div style="padding: 16px;" [id]="playerId"></div>
  `
})
export class YoutubePlayerComponent implements AfterViewInit {
  public player: any;
  @Input() playerId: string = "player" + Math.floor(Math.random() * 100000);
  @Input() vid: string = "";
  @Input() start: number = 0;
  @Input() end: number = 98;
  @Input() height: string = "390";
  @Input() width: string = "640";
  
  constructor() {
    (<any>window).onYouTubePlayerAPIReady = function() {
      this.getPlayer();
    }.bind(this)
  }

  getPlayer () {
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

  public play(mSettings) {
    this.player.loadVideoById(mSettings);
  }

  ngAfterViewInit() {
    if (window["YT"].Player) {
      this.getPlayer();
    } 
  }

  onPlayerReady(event) {
    var player = event.target;
    player.mute();
    player.seekTo(this.start);
    setInterval(function () {
      if (player.getCurrentTime() > this.end) {
        player.seekTo(this.start);
      }
    }, 100)
    player.playVideo();
  }
}