import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MapData } from '../providers/map-data';
import * as d3 from 'd3';
import { DomController } from 'ionic-angular';

import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

@Component({
  selector: 'map-overview',
  template: `
      <div class="d3"></div>
    `
})
export class MapOverviewComponent implements AfterViewInit {
  @Input() mapName: string = "";
  @Input() strategyId: string = "";
  @Input() intentionName: string = "";
  @Input() maxWidth: number = 1024;
  @Input() maxHeight: number = 1024;

  @Output() spotPress: EventEmitter<any> = new EventEmitter<any>();
  @Output() press: EventEmitter<any> = new EventEmitter<any>();

  private map: any;
  private locations: any;
  private selBackgroundImage: any;
  private selMap: any;
  private selSpotsEnter: any;
  private selSpots: any;
  private selSmoke: any;
  private selHoverSmoke: any;
  private selSpotOuter: any;
  private d3sel: any;
  private xScale: any;
  private yScale: any;
  private d3: any;
  private divTooltip: any;

  constructor(public mapData: MapData, public firebaseApp: FirebaseApp, private domCtrl : DomController) {
    this.d3 = d3;
  }

  createSVG() {
    if (this.d3sel) {
      return;
    }
    var alld3sels = this.d3.selectAll(".d3");
    this.d3sel = d3.select(alld3sels.nodes()[alld3sels.size() - 1]); //workaround to fix ionic backstack behavior
    this.maxHeight = this.d3sel.node().parentNode.offsetHeight;

    let selSvg = this.d3sel.append("svg")
      .attr("width", this.maxWidth)
      .attr("height", this.maxHeight > 1024 ? this.maxHeight : 1024);
    this.selMap = selSvg.append("g")
      .classed("map", true);
  }

  appendBackgroundImage() {
    var that = this;
    if (this.selBackgroundImage && !this.selBackgroundImage.classed(this.mapName)) {
      this.selBackgroundImage.remove();
    }

    this.firebaseApp.storage().ref('i/o/' + this.mapName + '.png').getDownloadURL().then((url) => {
      this.selBackgroundImage = this.selMap.insert("svg:image", ":first-child")
        .attr("xlink:href", url)
        .attr("width", 1024)
        .attr("height", 1024)
        .classed(this.mapName, true)
        .on("click", (e) => {
          let mouse = that.d3.mouse(that.d3.event.currentTarget);
          that.press.emit({ x: parseInt(mouse[0]) - 25, y: parseInt(mouse[1]) - 25 })
        });
    });

  }

  public clearDataSpots() {
    if (this.selSpotsEnter) {
      this.selSpotsEnter.remove();
      this.selSpotOuter.remove();
      this.selSpots.remove();
      this.selSmoke.remove();
      this.selHoverSmoke.remove();
    }
  }

  public appendDataSpots(locations) {

    if (!locations) {
      return;
    }

    var that = this,
      aLocations = Object.keys(locations).map((k) => {
        return Object.assign(locations[k], { spotId: k });
      });

    if (this.selSpotsEnter) {
      this.selSpotsEnter.remove();
      this.selSpotOuter.remove();
      this.selSpots.remove();
      this.selSmoke.remove();
      this.selHoverSmoke.remove();
    }
    this.divTooltip = this.d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("text-align", "center")
      .style("height", "18px")
      .style("padding", "2px")
      .style("font", "12px sans-serif")
      .style("background", "lightsteelblue")
      .style("border-radius", "8px")
      .style("pointer-events", "none")
      .style("font", "12px sans-serif");
    this.selSpotsEnter = this.selMap.selectAll(".spot")
      .data(aLocations)
      .enter();
    this.selSpotOuter = this.selSpotsEnter.append("g")
      .attr('class', function (d) {
        let strategy = d.strategy || this.strategyId;
        return strategy + " outerspot";
      }.bind(this));
    this.selSpotOuter.append("line")
      .classed("smokeline", true)
      .classed("nodisplay", (d) => {
        return !d.end;
      })
      .attr("x1", (d) => { return d.start.x + 25 })
      .attr("y1", (d) => { return d.start.y + 25 })
      .attr("x2", (d) => { return d.end ? d.end.x + 25 : null })
      .attr("y2", (d) => { return d.end ? d.end.y + 25 : null })
      .on("click", (d) => { that.spotPress.emit(d) });
    this.selSpots = this.selSpotOuter.append("g")
      .classed("innerspot", true)
      .attr("transform", function (d) {
        return "translate(" + this.xScale(d.start.x) + "," + this.yScale(d.start.y) + ") rotate(" + (!!d.angle ? d.angle : '0') + " 25 25)";
      }.bind(this))
    this.selSmoke = this.selSpotOuter.append("g")
      .attr("transform", function (d) { return d.end ? "translate(" + that.xScale(d.end.x) + "," + that.yScale(d.end.y) + ")" : "translate(0,0)"; })
      .classed("smokebox", true)
      .classed("nodisplay", (d) => {
        return !d.end;
      })
      .append("circle")
      .attr("cx", 25)
      .attr("cy", 25)
      .attr("r", 10)
      .on("click", (d) => { that.spotPress.emit(d) })
      .on("mouseover", this.displayTooltip.bind(this))
    this.selHoverSmoke = this.selSpotOuter.append("g")
      .attr("transform", function (d) { return d.end ? "translate(" + that.xScale(d.end.x) + "," + that.yScale(d.end.y) + ")" : "translate(0,0)"; })
      .classed("smokebig", true)
      .classed("nodisplay", true)
      .append("circle")
      .attr("cx", 25)
      .attr("cy", 25)
      .attr("r", 30)
      .on("click", (d) => { that.spotPress.emit(d) })
      .on("mouseout", this.hideToolTip.bind(this));
    this.selSpots.append("circle")
      .attr("transform", "translate(15,15)")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 7)
      .classed("player", true)
      .on("click", (d) => { that.spotPress.emit(d) })
      .on("mouseover", this.displayTooltip.bind(this))
      .on("mouseout", this.hideToolTip.bind(this));
    this.selSpots.append("path")
      .attr("d", d3.symbol()
        .size(function (d) { return 700; })
        .type(function (d) { return d3.symbolTriangle; }))
      .attr("transform", "translate(25,50)")
      .classed("player-view", true)
      .classed("nodisplay", (d) => {
        return !!d.end;
      });
  }

  displayTooltip(d) {
    if (!this.mapName || !this.strategyId || !d.spotId) {
      return;
    }

    let pageX = this.d3.event.pageX,
      pageY = this.d3.event.pageY;
    this.mapData.getSpot(this.mapName, this.strategyId, d.spotId).subscribe(data => {
      let sText = data.title;
      this.divTooltip.transition()
        .duration(200)
        .style("opacity", .9);
      this.divTooltip.html(sText)
        .style("left", pageX + "px")
        .style("width", (sText.length * 7) + "px")
        .style("top", (pageY - 28) + "px");
    })
  }

  hideToolTip() {
    this.divTooltip.transition()
      .duration(500)
      .style("opacity", 0);
  }

  createScale() {
    this.xScale = d3.scaleLinear().range([0, this.maxWidth]).domain([0, this.maxWidth]);
    this.yScale = d3.scaleLinear().range([0, this.maxHeight]).domain([0, this.maxHeight]);
  }

  public render() {
    let newWidth = this.d3sel.node().parentNode.parentNode.offsetWidth,
      width = newWidth > this.maxWidth ? this.maxWidth : newWidth;

    this.selMap.attr("transform", "scale(" + (width - 100) / this.maxWidth + ")");
  }

  highlight(enable, item) {
    this.d3.selectAll("g.outerspot")
      .filter(function (d) { return d.spotId === item.$key; })
      .classed("hover", enable);
  }

  public displayMap(mapName: string, drawSpots: boolean)  {
    if (!mapName) {
      return;
    }
    this.domCtrl.write(() => {
      this.mapName = mapName;
      this.createSVG();
      this.appendBackgroundImage();
      this.createScale();
      this.render();
      
      return new Promise((resolve, reject) => {
        if (drawSpots) {
          this.mapData.getLocations(this.mapName, this.strategyId).subscribe(locations => {
            this.locations = locations;
  
            this.appendDataSpots(this.locations);
            this.render();
            resolve();
          })
        } else {
          resolve();
        }
      });
    });
  }

  ngAfterViewInit() {
    this.displayMap(this.mapName, true);
  }
}