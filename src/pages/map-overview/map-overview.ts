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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    this.title = this.navParams.get("map").title;
    this.option = this.navParams.get("option");

    console.log('ionViewDidLoad MapOverviewPage');

    var d3sel = d3.select("#d3");

    var d3svg = d3sel.append("svg")
                     .attr("width", 1024)
                     .attr("height", 1024);

    var d3g = d3svg.append("g");
                  
    var d3img = d3g.append("svg:image")
                     .attr("xlink:href", "assets/img/de_dust2.jpg")                     
                     .attr("width", 1024)
                     .attr("height", 1024);

    d3.json("assets/data/dust2_spots.json", function(err, data) {
      var d3spots = d3g.selectAll("g")
         .data(data.spots)
         .enter();
      let selGroup = d3spots.append("g")
            .attr("transform", function(d) { return "translate("+d.x + "," + d.y+")"; })
            .attr("width", "20")
            .attr("height", "20");
      selGroup.append("circle")
          .attr("cx", function(d) { return 10 })
          .attr("cy", function(d) { return 10 })
          .attr("r", 10)
          .style("fill", "blue");
        selGroup.append("rect").classed("test", true)
     
      /*selGroup.append("path")
          .attr("d", d3.symbol()
            .size(function(d) { return 200; } )
            .type(function(d) { return d3.symbolTriangle; } ))
          .attr("transform", function(d) { return "translate(" + 10 + "," + (10 + 20) + ")"; });
    */});
  }

}
