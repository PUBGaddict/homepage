import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MapData } from '../providers/map-data';
import * as d3 from 'd3';

@Component({
    selector: 'map-overview',
    template: `
      <div class="d3"></div>
    `/*,
    styleUrls: ['map-overview.component.scss']*/
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

    public strategy = {
        id: "",
        name: "",
        spots: []
    };


    constructor(public mapData: MapData) {
        this.d3 = d3;
        this.mapName = this.mapName;
        this.strategyId = this.strategyId;
        this.intentionName = this.intentionName;
    }

    createSVG() {
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
        this.selBackgroundImage = this.selMap.append("svg:image")
            .attr("xlink:href", "/assets/img/" + this.map.mapname + ".png")
            .attr("width", 1024)
            .attr("height", 1024)
            .on("click", (e) => {
                let mouse = that.d3.mouse(that.d3.event.currentTarget);
                that.press.emit({ x: parseInt(mouse[0]) - 25, y: parseInt(mouse[1]) - 25 })
            });
    }

    public clearDataSpots () {
        if (this.selSpotsEnter) {
            this.selSpotsEnter.remove();
            this.selSpotOuter.remove();
            this.selSpots.remove();
            this.selSmoke.remove();
            this.selHoverSmoke.remove();
        }
    }

    public appendDataSpots(spots) {
        var that = this;
        if (this.selSpotsEnter) {
            this.selSpotsEnter.remove();
            this.selSpotOuter.remove();
            this.selSpots.remove();
            this.selSmoke.remove();
            this.selHoverSmoke.remove();
        }
        this.selSpotsEnter = this.selMap.selectAll(".spot")
            .data(spots)
            .enter();
        this.selSpotOuter = this.selSpotsEnter.append("g")
            .classed("outerspot", true);
        this.selSpotOuter.append("line")
            .classed("smokeline", true)
            .classed("nodisplay", (d) => {
                return !d.endx;
            })
            .attr("x1", (d) => { return d.x + 25 })
            .attr("y1", (d) => { return d.y + 25 })
            .attr("x2", (d) => { return d.endx ? d.endx + 25 : 0 })
            .attr("y2", (d) => { return d.endy ? d.endy + 25 : 0 })
            .on("click", (e) => { that.spotPress.emit(e) });
        this.selSpots = this.selSpotOuter.append("g")
            .classed("spot", true)
            .attr("transform", function (d) { return "translate(" + that.xScale(d.x) + "," + that.yScale(d.y) + ") rotate(" + d.angle + " 25 25)"; })
        this.selSmoke = this.selSpotOuter.append("g")
            .attr("transform", function (d) { return (d.endx && d.endy) ? "translate(" + that.xScale(d.endx) + "," + that.yScale(d.endy) + ")" : "translate(0,0)"; })
            .classed("smoke", true)
            .classed("nodisplay", (d) => {
                return !d.endx;
            })
            .append("circle")
            .attr("cx", 25)
            .attr("cy", 25)
            .attr("r", 10)
            .on("click", (e) => { that.spotPress.emit(e) });
        this.selHoverSmoke = this.selSpotOuter.append("g")
            .attr("transform", function (d) { return (d.endx && d.endy) ? "translate(" + that.xScale(d.endx) + "," + that.yScale(d.endy) + ")" : "translate(0,0)"; })
            .classed("smokebig", true)
            .classed("nodisplay", true)
            .append("circle")
            .attr("cx", 25)
            .attr("cy", 25)
            .attr("r", 30)
            .on("click", (e) => { that.spotPress.emit(e) });
        this.selSpots.append("circle")
            .attr("transform", "translate(15,15)")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 7)
            .classed("player", true)
            .on("click", (e) => { that.spotPress.emit(e) });
        this.selSpots.append("path")
            .attr("d", d3.symbol()
                .size(function (d) { return 700; })
                .type(function (d) { return d3.symbolTriangle; }))
            .attr("transform", "translate(25,50)")
            .classed("player-view", true)
            .classed("nodisplay", (d) => {
                return !!d.endx;
            });
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
            .filter(function (d) { return d.id === item.$key; })
            .classed("hover", enable);
    }

    ngAfterViewInit() {
        this.mapData.getMap(this.mapName).subscribe(map => {
            this.map = map;
            this.createSVG();
            this.appendBackgroundImage();
            this.createScale();
            window.addEventListener('resize', this.render.bind(this));
            if (!this.intentionName && !this.strategyId) {

                // submit page
            } else {
                let intention = this.mapData.getIntentionFromMap(map, this.intentionName);
                this.strategy = this.mapData.getStrategyFromIntention(intention, this.strategyId);

                // this needs a promise, otherwise render happens too early and our data is not loaded yet.
                this.appendDataSpots(this.strategy.spots);
                this.render();
            }
        });
    }
}