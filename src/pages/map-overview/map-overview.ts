import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  private map: any;
  private option: String;
  private maxWidth: number = 1024;
  private maxHeight: number = 1024;
  private selBackgroundImage: any;
  private selMap: any;
  private selSpots: any;
  private d3sel: any;
  private xScale: any;
  private yScale: any;
  private d3: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.d3 = d3;

    this.map = navParams.get("map");
    this.option = navParams.get("option");
  }

  createSVG () {
    this.d3sel = d3.select(".d3");

    let selSvg = this.d3sel.append("svg")
                     .attr("width", this.maxWidth)
                     .attr("height", this.maxHeight);
    this.selMap = selSvg.append("g")
          .classed("map", true);
  }

  appendBackgroundImage () {
    this.selBackgroundImage = this.selMap.append("svg:image")
                     .attr("xlink:href", "assets/img/" + this.map.mapname + ".png")                     
                     .attr("width", 1024)
                     .attr("height", 1024);
  }


  /*
  // returns a promise while loading the file so that we can easy chain
  */
  appendDataSpots() {
    return new Promise((resolve, reject) => {
      d3.json("assets/data/" + this.map.mapname + ".json", (err, data) => {
        this.selSpots = this.selMap.selectAll(".spot")
          .data(data.spots)
          .enter().append("g")
              .classed("spot", true)
              .attr("transform", function(d) { return "translate(" + this.xScale(d.x) + "," + this.yScale(d.y) + ") rotate(" + d.angle + " 25 25)"; }.bind(this))
        this.selSpots.append("circle")
            .attr("cx", 25)
            .attr("cy", 25)
            .attr("r", 25)
            .classed("turn-indicator", true);
        this.selSpots.append("circle")
            .attr("transform", "translate(15,15)")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 4)
            .classed("player", true);
        this.selSpots.append("path")
            .attr("d", d3.symbol()
              .size(function(d) { return 200; } )
              .type(function(d) { return d3.symbolTriangle; } ))
            .attr("transform", "translate(25,40)")
            .classed("player-view", true);
        
        resolve();
      });
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

    this.createSVG();
    this.appendBackgroundImage();
    this.createScale();

    // this needs a promise, otherwise render happens too early and our data is not loaded yet.
    this.appendDataSpots().then(() => {
      this.render();

      window.addEventListener('resize', this.render.bind(this));
    });

  }

}
