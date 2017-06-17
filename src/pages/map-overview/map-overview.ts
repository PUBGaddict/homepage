import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StrategyDetailPage } from '../strategy-detail/strategy-detail'
import { SubmitPage } from '../submit/submit'
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { MapData } from '../../providers/map-data';

/*
  Generated class for the MapOverview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map-overview',
  templateUrl: 'map-overview.html'
})
export class MapOverviewPage {
  private map: any;
  public strategyId: string;
  public intentionName: any;
  public mapName: string;
  public votings: FirebaseListObservable<any[]>;

  public strategy = {
    id: "",
    name : "",
    spots: []
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private angularfire: AngularFireDatabase, public mapData: MapData) {

    this.mapName = navParams.get("mapName");
    this.strategyId = navParams.get("strategyId");
    this.intentionName = navParams.get("intentionName");
    
    this.loadToplist();
  }

  ionViewWillEnter () {
    this.loadToplist();
  }

  openPage (spot) {
    this.navCtrl.push(StrategyDetailPage, {
      mapName: this.mapName,
      strategyId: this.strategyId,
      intentionName: this.intentionName,
      spotId: spot.id ? spot.id : spot.$key // its spot.id when clicking on the d3-svg on the map, and spot.$key when coming from the toplist 
    });
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }

  loadToplist () {
    this.votings = this.angularfire.list('/ratings/' + 
            this.mapName + "/" + 
            this.strategyId  + "/" + 
            this.intentionName, {
              query: { 
              orderByChild: 'value',
              limitToLast: 8
            } 
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;
  }

  onMouseEnterCard (item) {
    /*this.d3.selectAll("g.outerspot")
        .filter(function(d) { return d.id === item.$key; })
        .classed("hover", true);*/
  }
  onMouseLeaveCard (item) {
   /* this.d3.selectAll("g.outerspot")
        .filter(function(d) { return d.id === item.$key; })
        .classed("hover", false);*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapOverviewPage');
    this.mapData.getMap(this.mapName).subscribe(map => {
        this.map = map;
        let intention = this.mapData.getIntentionFromMap(map, this.intentionName);
        this.strategy = this.mapData.getStrategyFromIntention(intention, this.strategyId);
    });

    ga('set', 'page', '/map-overview');
    ga('send', 'event', "page", "visit", "map-overview");
    ga('send', 'event', "strategy", "selected", this.strategyId);
    ga('send', 'event', "intention", "selected", this.intentionName);
  }

}
