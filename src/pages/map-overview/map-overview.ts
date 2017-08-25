import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { StrategyDetailPage } from '../strategy-detail/strategy-detail'
import { SubmitPage } from '../submit/submit'
import { MapData } from '../../providers/map-data';
import { MapOverviewComponent } from '../../app/map-overview.component';

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

  @ViewChild('mapOverview') mapOverview: MapOverviewComponent;

  private map: any;
  public strategyId: string;
  public intentionName: any;
  public mapName: string;
  public votings: any[];

  public strategy = {
    id: "",
    name : "",
    spots: []
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData) {

    this.mapName = navParams.get("mapName");
    this.strategyId = navParams.get("strategyId");
  }

  openPage (location) {
    this.navCtrl.push(StrategyDetailPage, {
      spotId : location.spotId
    });
  }

  openSubmitPage() {
    this.navCtrl.push(SubmitPage);
  }

  loadToplist () {
    this.mapOverview.getLocations().then(spots => {
      let votings = [];

      for (var k in spots) {
        votings.push({
          spotId: k,
          value: spots[k].rating
        });
      }
      
      votings.sort( (a,b) => {
        return a.value > b.value ? 1 : -1;
      });
      this.votings = votings;
    });
  }

  onMouseEnterCard (item) {
      this.mapOverview.highlight(true, item);
  }
  onMouseLeaveCard (item) {
      this.mapOverview.highlight(false, item);
  }

  logPress(event) {
    console.log(event);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapOverviewPage');

    ga('set', 'page', '/map-overview');
    ga('send', 'event', "page", "visit", "map-overview");
    ga('send', 'event', "strategy", "selected", this.strategyId);
    ga('send', 'event', "intention", "selected", this.intentionName);

    
      this.loadToplist();
  }

}
