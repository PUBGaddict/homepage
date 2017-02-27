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
  private title: String;
  private option: String;
  private selOuterGroup: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  createSVG () {
    let d3sel = d3.select("#d3");

    let d3svg = d3sel.append("svg")
                     .attr("width", 1024)
                     .attr("height", 1024);
                     debugger;
    this.selOuterGroup = d3svg.append("g").classed("outerGroup", true);
  }

  appendBackgroundImage () {
    this.selOuterGroup.append("svg:image")
                     .attr("xlink:href", "assets/img/de_dust2.jpg")                     
                     .attr("width", 1024)
                     .attr("height", 1024);
  }

  appendDataSpots() {
    d3.json("assets/data/dust2_spots.json", (err, data) => {
      var d3spots = this.selOuterGroup.selectAll("g")
         .data(data.spots)
         .enter();
      let selGroup = d3spots.append("g")
            .attr("transform", function(d) { return "translate("+d.x + "," + d.y+")"; })
      selGroup.append("circle")
          .attr("cx", "25")
          .attr("cy", "25")
          .attr("r", "25")
          .classed("rect", true);
      selGroup.append("circle")
          .attr("transform", "translate(15,15)")
          .attr("cx", function(d) { return 10 })
          .attr("cy", function(d) { return 10 })
          .attr("r", 10)
          .style("fill", "blue");
     
      selGroup.append("path")
          .attr("d", d3.symbol()
            .size(function(d) { return 200; } )
            .type(function(d) { return d3.symbolTriangle; } ))
          .attr("transform", "translate(25,44)");//function(d) { return "translate(" + 10 + "," + (10 + 20) + ")"; });
    });
  }

  ionViewDidLoad() {
    this.title = this.navParams.get("map").title;
    this.option = this.navParams.get("option");

    console.log('ionViewDidLoad MapOverviewPage');

    this.createSVG();
    this.appendBackgroundImage();
    this.appendDataSpots();
  }

}
