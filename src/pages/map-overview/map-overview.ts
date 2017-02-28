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
  private mapname: String;
  private option: String;
  private height: Number;
  private width: Number;
  private maxWidth: Number;
  private maxHeight: Number;
  private selBackgroundImage: any;
  private selMap: any;
  private selSvg: any;
  private selSpots: any;
  private d3sel: any;
  private xScale: any;
  private yScale: any;
  private d3: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.maxHeight = 1024;
    this.maxWidth = 1024;
    this.d3 = d3;
  }

  createSVG () {
    this.d3sel = d3.select(".d3");

    this.selSvg = this.d3sel.append("svg")
                     .attr("width", this.maxWidth)
                     .attr("height", this.maxHeight);
    this.selMap = this.selSvg.append("g")
          .classed("map", true);
  }

  appendBackgroundImage () {
    this.selBackgroundImage = this.selMap.append("svg:image")
                     .attr("xlink:href", "assets/img/de_dust2.png")                     
                     .attr("width", 1024)
                     .attr("height", 1024);
  }


  /*
  // returns a promise while loading the file so that we can easy chain
  */
  appendDataSpots() {
    return new Promise((resolve, reject) => {
      d3.json("assets/data/" + this.mapname + ".json", (err, data) => {
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

        this.selMap.append("g")
            .classed("xAxis", true)
            .attr("transform", "translate(0, " + this.maxHeight + ")")
            .call(d3.axisBottom(this.xScale)),
        
        this.selMap.append("g")            
            .classed("yAxis", true)
            .attr("transform", "translate(" + this.maxWidth + ", 0)")
            .call(d3.axisLeft(this.yScale));
  }
  
  render() {
    let minWidth = this.d3sel.node().parentNode.offsetWidth;
    this.width = minWidth < this.maxWidth ? minWidth : this.maxWidth;
    this.height = this.width; // for 1:1 aspect ratio

    // updates scales
    this.xScale.range([0, this.width]);
    this.yScale.range([this.height,0]);

    // update svg element
    this.selSvg
        .attr("width", this.width)
        .attr("height", this.height);

    this.selBackgroundImage
        .attr("width", this.width)
        .attr("height", this.height);


    var that = this; // no other way due to each() overwriting this with necessary information
    this.selSpots.each(function(d, i) { // test
      that.d3.select(this).attr("transform", "translate(" + that.xScale(d.x) + "," + that.yScale(d.y) + ") rotate(" + d.angle + " 25 25)");
    })
  }

  ionViewDidLoad() {
    this.mapname = this.navParams.get("map").mapname;
    this.option = this.navParams.get("option");

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
