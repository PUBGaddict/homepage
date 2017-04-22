import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MapData } from '../../providers/map-data';

import { StrategyDetailPage } from '../strategy-detail/strategy-detail'

import * as d3 from 'd3';

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
  private strategyId: string;
  private intentionName: any;
  private map: any;
  public mapName: string;
  private maxWidth: number = 1024;
  private maxHeight: number = 1024;
  private selBackgroundImage: any;
  private selMap: any;
  private selSpotsEnter: any;
  private selSpots: any;
  private selSmoke: any;
  private selSpotOuter: any;
  private d3sel: any;
  private xScale: any;
  private yScale: any;
  private d3: any;

  public strategy = {
    id: "",
    name : "",
    spots: []
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapData: MapData) {
    this.d3 = d3;
    this.mapName = navParams.get("mapName");
    this.strategyId = navParams.get("strategyId");
    this.intentionName = navParams.get("intentionName");
  }

  createSVG () {
    this.d3sel = this.d3.select(".d3");

    let selSvg = this.d3sel.append("svg")
                     .attr("width", this.maxWidth)
                     .attr("height", this.maxHeight);
    this.selMap = selSvg.append("g")
          .classed("map", true);
  }

  appendBackgroundImage () {
    this.selBackgroundImage = this.selMap.append("svg:image")
        .attr("xlink:href", "http://csgospots.square7.ch/images/" + this.map.mapname + ".png")                     
        .attr("width", 1024)
        .attr("height", 1024)
        .on("click", function(d) {
          console.log(parseInt(d3.mouse(this)[0]) + "," + parseInt(d3.mouse(this)[1]));
        });
  }

  appendDataSpots() {
    this.selSpotsEnter = this.selMap.selectAll(".spot")
        .data(this.strategy.spots)
        .enter();
    this.selSpotOuter = this.selSpotsEnter.append("g")
        .classed("outerspot", true);
    this.selSpotOuter.append("line")
          .classed("smokeline", true)
          .classed("nodisplay", (d) => {
            return !d.endx; 
          })
          .attr("x1", (d) => {return d.x + 25})
          .attr("y1", (d) => {return d.y + 25})
          .attr("x2", (d) => {return d.endx ? d.endx + 25 : 0})
          .attr("y2", (d) => {return d.endy ? d.endy + 25 : 0})
          .on("click", this.openPage.bind(this));
    this.selSpots = this.selSpotOuter.append("g")
          .classed("spot", true)
          .attr("transform", function(d) { return "translate(" + this.xScale(d.x) + "," + this.yScale(d.y) + ") rotate(" + d.angle + " 25 25)"; }.bind(this))
    this.selSmoke = this.selSpotOuter.append("g")
          .attr("transform", function(d) { return (d.endx && d.endy) ? "translate(" + this.xScale(d.endx) + "," + this.yScale(d.endy) + ")" : "translate(0,0)"; }.bind(this))
          .classed("smoke", true)
          .classed("nodisplay", (d) => {
            return !d.endx; 
          })
          .append("circle")
          .attr("cx", 25)
          .attr("cy", 25)
          .attr("r", 25)
          .on("click", this.openPage.bind(this));
    this.selSpots.append("circle")
        .attr("cx", 25)
        .attr("cy", 25)
        .attr("r", 25)
        .classed("turn-indicator", true);
    this.selSpots.append("circle")
        .attr("transform", "translate(15,15)")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 7)
        .classed("player", true)
        .on("click", this.openPage.bind(this));
    this.selSpots.append("path")
        .attr("d", d3.symbol()
          .size(function(d) { return 700; } )
          .type(function(d) { return d3.symbolTriangle; } ))
        .attr("transform", "translate(25,50)")
        .classed("player-view", true);
  }

  openPage (spot) {
    this.navCtrl.push(StrategyDetailPage, {
      mapName: this.mapName,
      strategyId: this.strategyId,
      intentionName: this.intentionName,
      spotId: spot.id
    });
  }

  createScale() {
    this.xScale = d3.scaleLinear().range([0,this.maxWidth]).domain([0,this.maxWidth]);
    this.yScale = d3.scaleLinear().range([0,this.maxHeight]).domain([0,this.maxHeight]);
  }
  
  render() {
    let newWidth = this.d3sel.node().parentNode.offsetWidth,
        width = newWidth > this.maxWidth ? this.maxWidth : newWidth;

    this.selMap.attr("transform", "scale(" + width / this.maxWidth + ")");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapOverviewPage');

    this.mapData.getMap(this.mapName).subscribe(map => {
      this.map = map;

      let intention = this.mapData.getIntentionFromMap(map, this.intentionName);
      this.strategy = this.mapData.getStrategyFromIntention(intention, this.strategyId);
      
      this.createSVG();
      this.appendBackgroundImage();
      this.createScale();

      // this needs a promise, otherwise render happens too early and our data is not loaded yet.
      this.appendDataSpots();
      this.render();
      window.addEventListener('resize', this.render.bind(this));
    });
  }

}
