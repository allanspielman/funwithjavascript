/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(L) {
    var u;
    L.fn.emptyForce = function() {
        for (var ah = 0, ai; (ai = L(this)[ah]) != null; ah++) {
            if (ai.nodeType === 1) {
                L.cleanData(ai.getElementsByTagName("*"))
            }
            if (L.jqplot.use_excanvas) {
                ai.outerHTML = ""
            } else {
                while (ai.firstChild) {
                    ai.removeChild(ai.firstChild)
                }
            }
            ai = null
        }
        return L(this)
    }
    ;
    L.fn.removeChildForce = function(ah) {
        while (ah.firstChild) {
            this.removeChildForce(ah.firstChild);
            ah.removeChild(ah.firstChild)
        }
    }
    ;
    L.fn.jqplot = function() {
        var ah = [];
        var aj = [];
        for (var ak = 0, ai = arguments.length; ak < ai; ak++) {
            if (L.isArray(arguments[ak])) {
                ah.push(arguments[ak])
            } else {
                if (L.isPlainObject(arguments[ak])) {
                    aj.push(arguments[ak])
                }
            }
        }
        return this.each(function(an) {
            var at, ar, aq = L(this), am = ah.length, al = aj.length, ap, ao;
            if (an < am) {
                ap = ah[an]
            } else {
                ap = am ? ah[am - 1] : null
            }
            if (an < al) {
                ao = aj[an]
            } else {
                ao = al ? aj[al - 1] : null
            }
            at = aq.attr("id");
            if (at === u) {
                at = "jqplot_target_" + L.jqplot.targetCounter++;
                aq.attr("id", at)
            }
            ar = L.jqplot(at, ap, ao);
            aq.data("jqplot", ar)
        })
    }
    ;
    L.jqplot = function(an, ak, ai) {
        var aj = null
          , ah = null;
        if (arguments.length === 3) {
            aj = ak;
            ah = ai
        } else {
            if (arguments.length === 2) {
                if (L.isArray(ak)) {
                    aj = ak
                } else {
                    if (L.isPlainObject(ak)) {
                        ah = ak
                    }
                }
            }
        }
        if (aj === null && ah !== null && ah.data) {
            aj = ah.data
        }
        var am = new R();
        L("#" + an).removeClass("jqplot-error");
        if (L.jqplot.config.catchErrors) {
            try {
                am.init(an, aj, ah);
                am.draw();
                am.themeEngine.init.call(am);
                return am
            } catch (al) {
                var ao = L.jqplot.config.errorMessage || al.message;
                L("#" + an).append('<div class="jqplot-error-message">' + ao + "</div>");
                L("#" + an).addClass("jqplot-error");
                document.getElementById(an).style.background = L.jqplot.config.errorBackground;
                document.getElementById(an).style.border = L.jqplot.config.errorBorder;
                document.getElementById(an).style.fontFamily = L.jqplot.config.errorFontFamily;
                document.getElementById(an).style.fontSize = L.jqplot.config.errorFontSize;
                document.getElementById(an).style.fontStyle = L.jqplot.config.errorFontStyle;
                document.getElementById(an).style.fontWeight = L.jqplot.config.errorFontWeight
            }
        } else {
            am.init(an, aj, ah);
            am.draw();
            am.themeEngine.init.call(am);
            return am
        }
    }
    ;
    L.jqplot.version = "1.0.8";
    L.jqplot.revision = "1250";
    L.jqplot.targetCounter = 1;
    L.jqplot.CanvasManager = function() {
        if (typeof L.jqplot.CanvasManager.canvases == "undefined") {
            L.jqplot.CanvasManager.canvases = [];
            L.jqplot.CanvasManager.free = []
        }
        var ah = [];
        this.getCanvas = function() {
            var ak;
            var aj = true;
            if (!L.jqplot.use_excanvas) {
                for (var al = 0, ai = L.jqplot.CanvasManager.canvases.length; al < ai; al++) {
                    if (L.jqplot.CanvasManager.free[al] === true) {
                        aj = false;
                        ak = L.jqplot.CanvasManager.canvases[al];
                        L.jqplot.CanvasManager.free[al] = false;
                        ah.push(al);
                        break
                    }
                }
            }
            if (aj) {
                ak = document.createElement("canvas");
                ah.push(L.jqplot.CanvasManager.canvases.length);
                L.jqplot.CanvasManager.canvases.push(ak);
                L.jqplot.CanvasManager.free.push(false)
            }
            return ak
        }
        ;
        this.initCanvas = function(ai) {
            if (L.jqplot.use_excanvas) {
                return window.G_vmlCanvasManager.initElement(ai)
            }
            return ai
        }
        ;
        this.freeAllCanvases = function() {
            for (var aj = 0, ai = ah.length; aj < ai; aj++) {
                this.freeCanvas(ah[aj])
            }
            ah = []
        }
        ;
        this.freeCanvas = function(ai) {
            if (L.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== u) {
                window.G_vmlCanvasManager.uninitElement(L.jqplot.CanvasManager.canvases[ai]);
                L.jqplot.CanvasManager.canvases[ai] = null
            } else {
                var aj = L.jqplot.CanvasManager.canvases[ai];
                aj.getContext("2d").clearRect(0, 0, aj.width, aj.height);
                L(aj).unbind().removeAttr("class").removeAttr("style");
                L(aj).css({
                    left: "",
                    top: "",
                    position: ""
                });
                aj.width = 0;
                aj.height = 0;
                L.jqplot.CanvasManager.free[ai] = true
            }
        }
    }
    ;
    L.jqplot.log = function() {
        if (window.console) {
            window.console.log.apply(window.console, arguments)
        }
    }
    ;
    L.jqplot.config = {
        addDomReference: false,
        enablePlugins: false,
        defaultHeight: 300,
        defaultWidth: 400,
        UTCAdjust: false,
        timezoneOffset: new Date(new Date().getTimezoneOffset() * 60000),
        errorMessage: "",
        errorBackground: "",
        errorBorder: "",
        errorFontFamily: "",
        errorFontSize: "",
        errorFontStyle: "",
        errorFontWeight: "",
        catchErrors: false,
        defaultTickFormatString: "%.1f",
        defaultColors: ["#4bb2c5", "#EAA228", "#c5b47f", "#579575", "#839557", "#958c12", "#953579", "#4b5de4", "#d8b83f", "#ff5800", "#0085cc", "#c747a3", "#cddf54", "#FBD178", "#26B4E3", "#bd70c7"],
        defaultNegativeColors: ["#498991", "#C08840", "#9F9274", "#546D61", "#646C4A", "#6F6621", "#6E3F5F", "#4F64B0", "#A89050", "#C45923", "#187399", "#945381", "#959E5C", "#C7AF7B", "#478396", "#907294"],
        dashLength: 4,
        gapLength: 4,
        dotGapLength: 2.5,
        srcLocation: "jqplot/src/",
        pluginLocation: "jqplot/src/plugins/"
    };
    L.jqplot.arrayMax = function(ah) {
        return Math.max.apply(Math, ah)
    }
    ;
    L.jqplot.arrayMin = function(ah) {
        return Math.min.apply(Math, ah)
    }
    ;
    L.jqplot.enablePlugins = L.jqplot.config.enablePlugins;
    L.jqplot.support_canvas = function() {
        if (typeof L.jqplot.support_canvas.result == "undefined") {
            L.jqplot.support_canvas.result = !!document.createElement("canvas").getContext
        }
        return L.jqplot.support_canvas.result
    }
    ;
    L.jqplot.support_canvas_text = function() {
        if (typeof L.jqplot.support_canvas_text.result == "undefined") {
            if (window.G_vmlCanvasManager !== u && window.G_vmlCanvasManager._version > 887) {
                L.jqplot.support_canvas_text.result = true
            } else {
                L.jqplot.support_canvas_text.result = !!(document.createElement("canvas").getContext && typeof document.createElement("canvas").getContext("2d").fillText == "function")
            }
        }
        return L.jqplot.support_canvas_text.result
    }
    ;
    L.jqplot.use_excanvas = ((!L.support.boxModel || !L.support.objectAll || !$support.leadingWhitespace) && !L.jqplot.support_canvas()) ? true : false;
    L.jqplot.preInitHooks = [];
    L.jqplot.postInitHooks = [];
    L.jqplot.preParseOptionsHooks = [];
    L.jqplot.postParseOptionsHooks = [];
    L.jqplot.preDrawHooks = [];
    L.jqplot.postDrawHooks = [];
    L.jqplot.preDrawSeriesHooks = [];
    L.jqplot.postDrawSeriesHooks = [];
    L.jqplot.preDrawLegendHooks = [];
    L.jqplot.addLegendRowHooks = [];
    L.jqplot.preSeriesInitHooks = [];
    L.jqplot.postSeriesInitHooks = [];
    L.jqplot.preParseSeriesOptionsHooks = [];
    L.jqplot.postParseSeriesOptionsHooks = [];
    L.jqplot.eventListenerHooks = [];
    L.jqplot.preDrawSeriesShadowHooks = [];
    L.jqplot.postDrawSeriesShadowHooks = [];
    L.jqplot.ElemContainer = function() {
        this._elem;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {
            height: null,
            width: null
        }
    }
    ;
    L.jqplot.ElemContainer.prototype.createElement = function(ak, am, ai, aj, an) {
        this._offsets = am;
        var ah = ai || "jqplot";
        var al = document.createElement(ak);
        this._elem = L(al);
        this._elem.addClass(ah);
        this._elem.css(aj);
        this._elem.attr(an);
        al = null;
        return this._elem
    }
    ;
    L.jqplot.ElemContainer.prototype.getWidth = function() {
        if (this._elem) {
            return this._elem.outerWidth(true)
        } else {
            return null
        }
    }
    ;
    L.jqplot.ElemContainer.prototype.getHeight = function() {
        if (this._elem) {
            return this._elem.outerHeight(true)
        } else {
            return null
        }
    }
    ;
    L.jqplot.ElemContainer.prototype.getPosition = function() {
        if (this._elem) {
            return this._elem.position()
        } else {
            return {
                top: null,
                left: null,
                bottom: null,
                right: null
            }
        }
    }
    ;
    L.jqplot.ElemContainer.prototype.getTop = function() {
        return this.getPosition().top
    }
    ;
    L.jqplot.ElemContainer.prototype.getLeft = function() {
        return this.getPosition().left
    }
    ;
    L.jqplot.ElemContainer.prototype.getBottom = function() {
        return this._elem.css("bottom")
    }
    ;
    L.jqplot.ElemContainer.prototype.getRight = function() {
        return this._elem.css("right")
    }
    ;
    function w(ah) {
        L.jqplot.ElemContainer.call(this);
        this.name = ah;
        this._series = [];
        this.show = false;
        this.tickRenderer = L.jqplot.AxisTickRenderer;
        this.tickOptions = {};
        this.labelRenderer = L.jqplot.AxisLabelRenderer;
        this.labelOptions = {};
        this.label = null;
        this.showLabel = true;
        this.min = null;
        this.max = null;
        this.autoscale = false;
        this.pad = 1.2;
        this.padMax = null;
        this.padMin = null;
        this.ticks = [];
        this.numberTicks;
        this.tickInterval;
        this.renderer = L.jqplot.LinearAxisRenderer;
        this.rendererOptions = {};
        this.showTicks = true;
        this.showTickMarks = true;
        this.showMinorTicks = true;
        this.drawMajorGridlines = true;
        this.drawMinorGridlines = false;
        this.drawMajorTickMarks = true;
        this.drawMinorTickMarks = true;
        this.useSeriesColor = false;
        this.borderWidth = null;
        this.borderColor = null;
        this.scaleToHiddenSeries = false;
        this._dataBounds = {
            min: null,
            max: null
        };
        this._intervalStats = [];
        this._offsets = {
            min: null,
            max: null
        };
        this._ticks = [];
        this._label = null;
        this.syncTicks = null;
        this.tickSpacing = 75;
        this._min = null;
        this._max = null;
        this._tickInterval = null;
        this._numberTicks = null;
        this.__ticks = null;
        this._options = {}
    }
    w.prototype = new L.jqplot.ElemContainer();
    w.prototype.constructor = w;
    w.prototype.init = function() {
        if (L.isFunction(this.renderer)) {
            this.renderer = new this.renderer()
        }
        this.tickOptions.axis = this.name;
        if (this.tickOptions.showMark == null) {
            this.tickOptions.showMark = this.showTicks
        }
        if (this.tickOptions.showMark == null) {
            this.tickOptions.showMark = this.showTickMarks
        }
        if (this.tickOptions.showLabel == null) {
            this.tickOptions.showLabel = this.showTicks
        }
        if (this.label == null || this.label == "") {
            this.showLabel = false
        } else {
            this.labelOptions.label = this.label
        }
        if (this.showLabel == false) {
            this.labelOptions.show = false
        }
        if (this.pad == 0) {
            this.pad = 1
        }
        if (this.padMax == 0) {
            this.padMax = 1
        }
        if (this.padMin == 0) {
            this.padMin = 1
        }
        if (this.padMax == null) {
            this.padMax = (this.pad - 1) / 2 + 1
        }
        if (this.padMin == null) {
            this.padMin = (this.pad - 1) / 2 + 1
        }
        this.pad = this.padMax + this.padMin - 1;
        if (this.min != null || this.max != null) {
            this.autoscale = false
        }
        if (this.syncTicks == null && this.name.indexOf("y") > -1) {
            this.syncTicks = true
        } else {
            if (this.syncTicks == null) {
                this.syncTicks = false
            }
        }
        this.renderer.init.call(this, this.rendererOptions)
    }
    ;
    w.prototype.draw = function(ah, ai) {
        if (this.__ticks) {
            this.__ticks = null
        }
        return this.renderer.draw.call(this, ah, ai)
    }
    ;
    w.prototype.set = function() {
        this.renderer.set.call(this)
    }
    ;
    w.prototype.pack = function(ai, ah) {
        if (this.show) {
            this.renderer.pack.call(this, ai, ah)
        }
        if (this._min == null) {
            this._min = this.min;
            this._max = this.max;
            this._tickInterval = this.tickInterval;
            this._numberTicks = this.numberTicks;
            this.__ticks = this._ticks
        }
    }
    ;
    w.prototype.reset = function() {
        this.renderer.reset.call(this)
    }
    ;
    w.prototype.resetScale = function(ah) {
        L.extend(true, this, {
            min: null,
            max: null,
            numberTicks: null,
            tickInterval: null,
            _ticks: [],
            ticks: []
        }, ah);
        this.resetDataBounds()
    }
    ;
    w.prototype.resetDataBounds = function() {
        var ao = this._dataBounds;
        ao.min = null;
        ao.max = null;
        var ai, ap, am;
        var aj = (this.show) ? true : false;
        for (var al = 0; al < this._series.length; al++) {
            ap = this._series[al];
            if (ap.show || this.scaleToHiddenSeries) {
                am = ap._plotData;
                if (ap._type === "line" && ap.renderer.bands.show && this.name.charAt(0) !== "x") {
                    am = [[0, ap.renderer.bands._min], [1, ap.renderer.bands._max]]
                }
                var ah = 1
                  , an = 1;
                if (ap._type != null && ap._type == "ohlc") {
                    ah = 3;
                    an = 2
                }
                for (var ak = 0, ai = am.length; ak < ai; ak++) {
                    if (this.name == "xaxis" || this.name == "x2axis") {
                        if ((am[ak][0] != null && am[ak][0] < ao.min) || ao.min == null) {
                            ao.min = am[ak][0]
                        }
                        if ((am[ak][0] != null && am[ak][0] > ao.max) || ao.max == null) {
                            ao.max = am[ak][0]
                        }
                    } else {
                        if ((am[ak][ah] != null && am[ak][ah] < ao.min) || ao.min == null) {
                            ao.min = am[ak][ah]
                        }
                        if ((am[ak][an] != null && am[ak][an] > ao.max) || ao.max == null) {
                            ao.max = am[ak][an]
                        }
                    }
                }
                if (aj && ap.renderer.constructor !== L.jqplot.BarRenderer) {
                    aj = false
                } else {
                    if (aj && this._options.hasOwnProperty("forceTickAt0") && this._options.forceTickAt0 == false) {
                        aj = false
                    } else {
                        if (aj && ap.renderer.constructor === L.jqplot.BarRenderer) {
                            if (ap.barDirection == "vertical" && this.name != "xaxis" && this.name != "x2axis") {
                                if (this._options.pad != null || this._options.padMin != null) {
                                    aj = false
                                }
                            } else {
                                if (ap.barDirection == "horizontal" && (this.name == "xaxis" || this.name == "x2axis")) {
                                    if (this._options.pad != null || this._options.padMin != null) {
                                        aj = false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (aj && this.renderer.constructor === L.jqplot.LinearAxisRenderer && ao.min >= 0) {
            this.padMin = 1;
            this.forceTickAt0 = true
        }
    }
    ;
    function q(ah) {
        L.jqplot.ElemContainer.call(this);
        this.show = false;
        this.location = "ne";
        this.labels = [];
        this.showLabels = true;
        this.showSwatches = true;
        this.placement = "insideGrid";
        this.xoffset = 0;
        this.yoffset = 0;
        this.border;
        this.background;
        this.textColor;
        this.fontFamily;
        this.fontSize;
        this.rowSpacing = "0.5em";
        this.renderer = L.jqplot.TableLegendRenderer;
        this.rendererOptions = {};
        this.preDraw = false;
        this.marginTop = null;
        this.marginRight = null;
        this.marginBottom = null;
        this.marginLeft = null;
        this.escapeHtml = false;
        this._series = [];
        L.extend(true, this, ah)
    }
    q.prototype = new L.jqplot.ElemContainer();
    q.prototype.constructor = q;
    q.prototype.setOptions = function(ah) {
        L.extend(true, this, ah);
        if (this.placement == "inside") {
            this.placement = "insideGrid"
        }
        if (this.xoffset > 0) {
            if (this.placement == "insideGrid") {
                switch (this.location) {
                case "nw":
                case "w":
                case "sw":
                    if (this.marginLeft == null) {
                        this.marginLeft = this.xoffset + "px"
                    }
                    this.marginRight = "0px";
                    break;
                case "ne":
                case "e":
                case "se":
                default:
                    if (this.marginRight == null) {
                        this.marginRight = this.xoffset + "px"
                    }
                    this.marginLeft = "0px";
                    break
                }
            } else {
                if (this.placement == "outside") {
                    switch (this.location) {
                    case "nw":
                    case "w":
                    case "sw":
                        if (this.marginRight == null) {
                            this.marginRight = this.xoffset + "px"
                        }
                        this.marginLeft = "0px";
                        break;
                    case "ne":
                    case "e":
                    case "se":
                    default:
                        if (this.marginLeft == null) {
                            this.marginLeft = this.xoffset + "px"
                        }
                        this.marginRight = "0px";
                        break
                    }
                }
            }
            this.xoffset = 0
        }
        if (this.yoffset > 0) {
            if (this.placement == "outside") {
                switch (this.location) {
                case "sw":
                case "s":
                case "se":
                    if (this.marginTop == null) {
                        this.marginTop = this.yoffset + "px"
                    }
                    this.marginBottom = "0px";
                    break;
                case "ne":
                case "n":
                case "nw":
                default:
                    if (this.marginBottom == null) {
                        this.marginBottom = this.yoffset + "px"
                    }
                    this.marginTop = "0px";
                    break
                }
            } else {
                if (this.placement == "insideGrid") {
                    switch (this.location) {
                    case "sw":
                    case "s":
                    case "se":
                        if (this.marginBottom == null) {
                            this.marginBottom = this.yoffset + "px"
                        }
                        this.marginTop = "0px";
                        break;
                    case "ne":
                    case "n":
                    case "nw":
                    default:
                        if (this.marginTop == null) {
                            this.marginTop = this.yoffset + "px"
                        }
                        this.marginBottom = "0px";
                        break
                    }
                }
            }
            this.yoffset = 0
        }
    }
    ;
    q.prototype.init = function() {
        if (L.isFunction(this.renderer)) {
            this.renderer = new this.renderer()
        }
        this.renderer.init.call(this, this.rendererOptions)
    }
    ;
    q.prototype.draw = function(ai, aj) {
        for (var ah = 0; ah < L.jqplot.preDrawLegendHooks.length; ah++) {
            L.jqplot.preDrawLegendHooks[ah].call(this, ai)
        }
        return this.renderer.draw.call(this, ai, aj)
    }
    ;
    q.prototype.pack = function(ah) {
        this.renderer.pack.call(this, ah)
    }
    ;
    function y(ah) {
        L.jqplot.ElemContainer.call(this);
        this.text = ah;
        this.show = true;
        this.fontFamily;
        this.fontSize;
        this.textAlign;
        this.textColor;
        this.renderer = L.jqplot.DivTitleRenderer;
        this.rendererOptions = {};
        this.escapeHtml = false
    }
    y.prototype = new L.jqplot.ElemContainer();
    y.prototype.constructor = y;
    y.prototype.init = function() {
        if (L.isFunction(this.renderer)) {
            this.renderer = new this.renderer()
        }
        this.renderer.init.call(this, this.rendererOptions)
    }
    ;
    y.prototype.draw = function(ah) {
        return this.renderer.draw.call(this, ah)
    }
    ;
    y.prototype.pack = function() {
        this.renderer.pack.call(this)
    }
    ;
    function S(ah) {
        ah = ah || {};
        L.jqplot.ElemContainer.call(this);
        this.show = true;
        this.xaxis = "xaxis";
        this._xaxis;
        this.yaxis = "yaxis";
        this._yaxis;
        this.gridBorderWidth = 2;
        this.renderer = L.jqplot.LineRenderer;
        this.rendererOptions = {};
        this.data = [];
        this.gridData = [];
        this.label = "";
        this.showLabel = true;
        this.color;
        this.negativeColor;
        this.lineWidth = 2.5;
        this.lineJoin = "round";
        this.lineCap = "round";
        this.linePattern = "solid";
        this.shadow = true;
        this.shadowAngle = 45;
        this.shadowOffset = 1.25;
        this.shadowDepth = 3;
        this.shadowAlpha = "0.1";
        this.breakOnNull = false;
        this.markerRenderer = L.jqplot.MarkerRenderer;
        this.markerOptions = {};
        this.showLine = true;
        this.showMarker = true;
        this.index;
        this.fill = false;
        this.fillColor;
        this.fillAlpha;
        this.fillAndStroke = false;
        this.disableStack = false;
        this._stack = false;
        this.neighborThreshold = 4;
        this.fillToZero = false;
        this.fillToValue = 0;
        this.fillAxis = "y";
        this.useNegativeColors = true;
        this._stackData = [];
        this._plotData = [];
        this._plotValues = {
            x: [],
            y: []
        };
        this._intervals = {
            x: {},
            y: {}
        };
        this._prevPlotData = [];
        this._prevGridData = [];
        this._stackAxis = "y";
        this._primaryAxis = "_xaxis";
        this.canvas = new L.jqplot.GenericCanvas();
        this.shadowCanvas = new L.jqplot.GenericCanvas();
        this.plugins = {};
        this._sumy = 0;
        this._sumx = 0;
        this._type = ""
    }
    S.prototype = new L.jqplot.ElemContainer();
    S.prototype.constructor = S;
    S.prototype.init = function(ak, ao, am) {
        this.index = ak;
        this.gridBorderWidth = ao;
        var an = this.data;
        var aj = [], al, ah;
        for (al = 0,
        ah = an.length; al < ah; al++) {
            if (!this.breakOnNull) {
                if (an[al] == null || an[al][0] == null || an[al][1] == null) {
                    continue
                } else {
                    aj.push(an[al])
                }
            } else {
                aj.push(an[al])
            }
        }
        this.data = aj;
        if (!this.color) {
            this.color = am.colorGenerator.get(this.index)
        }
        if (!this.negativeColor) {
            this.negativeColor = am.negativeColorGenerator.get(this.index)
        }
        if (!this.fillColor) {
            this.fillColor = this.color
        }
        if (this.fillAlpha) {
            var ai = L.jqplot.normalize2rgb(this.fillColor);
            var ai = L.jqplot.getColorComponents(ai);
            this.fillColor = "rgba(" + ai[0] + "," + ai[1] + "," + ai[2] + "," + this.fillAlpha + ")"
        }
        if (L.isFunction(this.renderer)) {
            this.renderer = new this.renderer()
        }
        this.renderer.init.call(this, this.rendererOptions, am);
        this.markerRenderer = new this.markerRenderer();
        if (!this.markerOptions.color) {
            this.markerOptions.color = this.color
        }
        if (this.markerOptions.show == null) {
            this.markerOptions.show = this.showMarker
        }
        this.showMarker = this.markerOptions.show;
        this.markerRenderer.init(this.markerOptions)
    }
    ;
    S.prototype.draw = function(an, ak, am) {
        var ai = (ak == u) ? {} : ak;
        an = (an == u) ? this.canvas._ctx : an;
        var ah, al, aj;
        for (ah = 0; ah < L.jqplot.preDrawSeriesHooks.length; ah++) {
            L.jqplot.preDrawSeriesHooks[ah].call(this, an, ai)
        }
        if (this.show) {
            this.renderer.setGridData.call(this, am);
            if (!ai.preventJqPlotSeriesDrawTrigger) {
                L(an.canvas).trigger("jqplotSeriesDraw", [this.data, this.gridData])
            }
            al = [];
            if (ai.data) {
                al = ai.data
            } else {
                if (!this._stack) {
                    al = this.data
                } else {
                    al = this._plotData
                }
            }
            aj = ai.gridData || this.renderer.makeGridData.call(this, al, am);
            if (this._type === "line" && this.renderer.smooth && this.renderer._smoothedData.length) {
                aj = this.renderer._smoothedData
            }
            this.renderer.draw.call(this, an, aj, ai, am)
        }
        for (ah = 0; ah < L.jqplot.postDrawSeriesHooks.length; ah++) {
            L.jqplot.postDrawSeriesHooks[ah].call(this, an, ai, am)
        }
        an = ak = am = ah = al = aj = null
    }
    ;
    S.prototype.drawShadow = function(an, ak, am) {
        var ai = (ak == u) ? {} : ak;
        an = (an == u) ? this.shadowCanvas._ctx : an;
        var ah, al, aj;
        for (ah = 0; ah < L.jqplot.preDrawSeriesShadowHooks.length; ah++) {
            L.jqplot.preDrawSeriesShadowHooks[ah].call(this, an, ai)
        }
        if (this.shadow) {
            this.renderer.setGridData.call(this, am);
            al = [];
            if (ai.data) {
                al = ai.data
            } else {
                if (!this._stack) {
                    al = this.data
                } else {
                    al = this._plotData
                }
            }
            aj = ai.gridData || this.renderer.makeGridData.call(this, al, am);
            this.renderer.drawShadow.call(this, an, aj, ai, am)
        }
        for (ah = 0; ah < L.jqplot.postDrawSeriesShadowHooks.length; ah++) {
            L.jqplot.postDrawSeriesShadowHooks[ah].call(this, an, ai)
        }
        an = ak = am = ah = al = aj = null
    }
    ;
    S.prototype.toggleDisplay = function(ai, ak) {
        var ah, aj;
        if (ai.data.series) {
            ah = ai.data.series
        } else {
            ah = this
        }
        if (ai.data.speed) {
            aj = ai.data.speed
        }
        if (aj) {
            if (ah.canvas._elem.is(":hidden") || !ah.show) {
                ah.show = true;
                ah.canvas._elem.removeClass("jqplot-series-hidden");
                if (ah.shadowCanvas._elem) {
                    ah.shadowCanvas._elem.fadeIn(aj)
                }
                ah.canvas._elem.fadeIn(aj, ak);
                ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-" + ah.index).fadeIn(aj)
            } else {
                ah.show = false;
                ah.canvas._elem.addClass("jqplot-series-hidden");
                if (ah.shadowCanvas._elem) {
                    ah.shadowCanvas._elem.fadeOut(aj)
                }
                ah.canvas._elem.fadeOut(aj, ak);
                ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-" + ah.index).fadeOut(aj)
            }
        } else {
            if (ah.canvas._elem.is(":hidden") || !ah.show) {
                ah.show = true;
                ah.canvas._elem.removeClass("jqplot-series-hidden");
                if (ah.shadowCanvas._elem) {
                    ah.shadowCanvas._elem.show()
                }
                ah.canvas._elem.show(0, ak);
                ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-" + ah.index).show()
            } else {
                ah.show = false;
                ah.canvas._elem.addClass("jqplot-series-hidden");
                if (ah.shadowCanvas._elem) {
                    ah.shadowCanvas._elem.hide()
                }
                ah.canvas._elem.hide(0, ak);
                ah.canvas._elem.nextAll(".jqplot-point-label.jqplot-series-" + ah.index).hide()
            }
        }
    }
    ;
    function M() {
        L.jqplot.ElemContainer.call(this);
        this.drawGridlines = true;
        this.gridLineColor = "#cccccc";
        this.gridLineWidth = 1;
        this.background = "#fffdf6";
        this.borderColor = "#999999";
        this.borderWidth = 2;
        this.drawBorder = true;
        this.shadow = true;
        this.shadowAngle = 45;
        this.shadowOffset = 1.5;
        this.shadowWidth = 3;
        this.shadowDepth = 3;
        this.shadowColor = null;
        this.shadowAlpha = "0.07";
        this._left;
        this._top;
        this._right;
        this._bottom;
        this._width;
        this._height;
        this._axes = [];
        this.renderer = L.jqplot.CanvasGridRenderer;
        this.rendererOptions = {};
        this._offsets = {
            top: null,
            bottom: null,
            left: null,
            right: null
        }
    }
    M.prototype = new L.jqplot.ElemContainer();
    M.prototype.constructor = M;
    M.prototype.init = function() {
        if (L.isFunction(this.renderer)) {
            this.renderer = new this.renderer()
        }
        this.renderer.init.call(this, this.rendererOptions)
    }
    ;
    M.prototype.createElement = function(ah, ai) {
        this._offsets = ah;
        return this.renderer.createElement.call(this, ai)
    }
    ;
    M.prototype.draw = function() {
        this.renderer.draw.call(this)
    }
    ;
    L.jqplot.GenericCanvas = function() {
        L.jqplot.ElemContainer.call(this);
        this._ctx
    }
    ;
    L.jqplot.GenericCanvas.prototype = new L.jqplot.ElemContainer();
    L.jqplot.GenericCanvas.prototype.constructor = L.jqplot.GenericCanvas;
    L.jqplot.GenericCanvas.prototype.createElement = function(al, aj, ai, am) {
        this._offsets = al;
        var ah = "jqplot";
        if (aj != u) {
            ah = aj
        }
        var ak;
        ak = am.canvasManager.getCanvas();
        if (ai != null) {
            this._plotDimensions = ai
        }
        ak.width = this._plotDimensions.width - this._offsets.left - this._offsets.right;
        ak.height = this._plotDimensions.height - this._offsets.top - this._offsets.bottom;
        this._elem = L(ak);
        this._elem.css({
            position: "absolute",
            left: this._offsets.left,
            top: this._offsets.top
        });
        this._elem.addClass(ah);
        ak = am.canvasManager.initCanvas(ak);
        ak = null;
        return this._elem
    }
    ;
    L.jqplot.GenericCanvas.prototype.setContext = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        return this._ctx
    }
    ;
    L.jqplot.GenericCanvas.prototype.resetCanvas = function() {
        if (this._elem) {
            if (L.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== u) {
                window.G_vmlCanvasManager.uninitElement(this._elem.get(0))
            }
            this._elem.emptyForce()
        }
        this._ctx = null
    }
    ;
    L.jqplot.HooksManager = function() {
        this.hooks = [];
        this.args = []
    }
    ;
    L.jqplot.HooksManager.prototype.addOnce = function(ak, ai) {
        ai = ai || [];
        var al = false;
        for (var aj = 0, ah = this.hooks.length; aj < ah; aj++) {
            if (this.hooks[aj] == ak) {
                al = true
            }
        }
        if (!al) {
            this.hooks.push(ak);
            this.args.push(ai)
        }
    }
    ;
    L.jqplot.HooksManager.prototype.add = function(ai, ah) {
        ah = ah || [];
        this.hooks.push(ai);
        this.args.push(ah)
    }
    ;
    L.jqplot.EventListenerManager = function() {
        this.hooks = []
    }
    ;
    L.jqplot.EventListenerManager.prototype.addOnce = function(al, ak) {
        var am = false, aj, ai;
        for (var ai = 0, ah = this.hooks.length; ai < ah; ai++) {
            aj = this.hooks[ai];
            if (aj[0] == al && aj[1] == ak) {
                am = true
            }
        }
        if (!am) {
            this.hooks.push([al, ak])
        }
    }
    ;
    L.jqplot.EventListenerManager.prototype.add = function(ai, ah) {
        this.hooks.push([ai, ah])
    }
    ;
    var U = ["yMidAxis", "xaxis", "yaxis", "x2axis", "y2axis", "y3axis", "y4axis", "y5axis", "y6axis", "y7axis", "y8axis", "y9axis"];
    function R() {
        this.animate = false;
        this.animateReplot = false;
        this.axes = {
            xaxis: new w("xaxis"),
            yaxis: new w("yaxis"),
            x2axis: new w("x2axis"),
            y2axis: new w("y2axis"),
            y3axis: new w("y3axis"),
            y4axis: new w("y4axis"),
            y5axis: new w("y5axis"),
            y6axis: new w("y6axis"),
            y7axis: new w("y7axis"),
            y8axis: new w("y8axis"),
            y9axis: new w("y9axis"),
            yMidAxis: new w("yMidAxis")
        };
        this.baseCanvas = new L.jqplot.GenericCanvas();
        this.captureRightClick = false;
        this.data = [];
        this.dataRenderer;
        this.dataRendererOptions;
        this.defaults = {
            axesDefaults: {},
            axes: {
                xaxis: {},
                yaxis: {},
                x2axis: {},
                y2axis: {},
                y3axis: {},
                y4axis: {},
                y5axis: {},
                y6axis: {},
                y7axis: {},
                y8axis: {},
                y9axis: {},
                yMidAxis: {}
            },
            seriesDefaults: {},
            series: []
        };
        this.defaultAxisStart = 1;
        this.drawIfHidden = false;
        this.eventCanvas = new L.jqplot.GenericCanvas();
        this.fillBetween = {
            series1: null,
            series2: null,
            color: null,
            baseSeries: 0,
            fill: true
        };
        this.fontFamily;
        this.fontSize;
        this.grid = new M();
        this.legend = new q();
        this.noDataIndicator = {
            show: false,
            indicator: "Loading Data...",
            axes: {
                xaxis: {
                    min: 0,
                    max: 10,
                    tickInterval: 2,
                    show: true
                },
                yaxis: {
                    min: 0,
                    max: 12,
                    tickInterval: 3,
                    show: true
                }
            }
        };
        this.negativeSeriesColors = L.jqplot.config.defaultNegativeColors;
        this.options = {};
        this.previousSeriesStack = [];
        this.plugins = {};
        this.series = [];
        this.seriesStack = [];
        this.seriesColors = L.jqplot.config.defaultColors;
        this.sortData = true;
        this.stackSeries = false;
        this.syncXTicks = true;
        this.syncYTicks = true;
        this.target = null;
        this.targetId = null;
        this.textColor;
        this.title = new y();
        this._drawCount = 0;
        this._sumy = 0;
        this._sumx = 0;
        this._stackData = [];
        this._plotData = [];
        this._width = null;
        this._height = null;
        this._plotDimensions = {
            height: null,
            width: null
        };
        this._gridPadding = {
            top: null,
            right: null,
            bottom: null,
            left: null
        };
        this._defaultGridPadding = {
            top: 10,
            right: 10,
            bottom: 23,
            left: 10
        };
        this._addDomReference = L.jqplot.config.addDomReference;
        this.preInitHooks = new L.jqplot.HooksManager();
        this.postInitHooks = new L.jqplot.HooksManager();
        this.preParseOptionsHooks = new L.jqplot.HooksManager();
        this.postParseOptionsHooks = new L.jqplot.HooksManager();
        this.preDrawHooks = new L.jqplot.HooksManager();
        this.postDrawHooks = new L.jqplot.HooksManager();
        this.preDrawSeriesHooks = new L.jqplot.HooksManager();
        this.postDrawSeriesHooks = new L.jqplot.HooksManager();
        this.preDrawLegendHooks = new L.jqplot.HooksManager();
        this.addLegendRowHooks = new L.jqplot.HooksManager();
        this.preSeriesInitHooks = new L.jqplot.HooksManager();
        this.postSeriesInitHooks = new L.jqplot.HooksManager();
        this.preParseSeriesOptionsHooks = new L.jqplot.HooksManager();
        this.postParseSeriesOptionsHooks = new L.jqplot.HooksManager();
        this.eventListenerHooks = new L.jqplot.EventListenerManager();
        this.preDrawSeriesShadowHooks = new L.jqplot.HooksManager();
        this.postDrawSeriesShadowHooks = new L.jqplot.HooksManager();
        this.colorGenerator = new L.jqplot.ColorGenerator();
        this.negativeColorGenerator = new L.jqplot.ColorGenerator();
        this.canvasManager = new L.jqplot.CanvasManager();
        this.themeEngine = new L.jqplot.ThemeEngine();
        var aj = 0;
        this.init = function(av, ar, ay) {
            ay = ay || {};
            for (var at = 0; at < L.jqplot.preInitHooks.length; at++) {
                L.jqplot.preInitHooks[at].call(this, av, ar, ay)
            }
            for (var at = 0; at < this.preInitHooks.hooks.length; at++) {
                this.preInitHooks.hooks[at].call(this, av, ar, ay)
            }
            this.targetId = "#" + av;
            this.target = L("#" + av);
            if (this._addDomReference) {
                this.target.data("jqplot", this)
            }
            this.target.removeClass("jqplot-error");
            if (!this.target.get(0)) {
                throw new Error("No plot target specified")
            }
            if (this.target.css("position") == "static") {
                this.target.css("position", "relative")
            }
            if (!this.target.hasClass("jqplot-target")) {
                this.target.addClass("jqplot-target")
            }
            if (!this.target.height()) {
                var au;
                if (ay && ay.height) {
                    au = parseInt(ay.height, 10)
                } else {
                    if (this.target.attr("data-height")) {
                        au = parseInt(this.target.attr("data-height"), 10)
                    } else {
                        au = parseInt(L.jqplot.config.defaultHeight, 10)
                    }
                }
                this._height = au;
                this.target.css("height", au + "px")
            } else {
                this._height = au = this.target.height()
            }
            if (!this.target.width()) {
                var aw;
                if (ay && ay.width) {
                    aw = parseInt(ay.width, 10)
                } else {
                    if (this.target.attr("data-width")) {
                        aw = parseInt(this.target.attr("data-width"), 10)
                    } else {
                        aw = parseInt(L.jqplot.config.defaultWidth, 10)
                    }
                }
                this._width = aw;
                this.target.css("width", aw + "px")
            } else {
                this._width = aw = this.target.width()
            }
            for (var at = 0, ap = U.length; at < ap; at++) {
                this.axes[U[at]] = new w(U[at])
            }
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            this.baseCanvas._plotDimensions = this._plotDimensions;
            this.eventCanvas._plotDimensions = this._plotDimensions;
            this.legend._plotDimensions = this._plotDimensions;
            if (this._height <= 0 || this._width <= 0 || !this._height || !this._width) {
                throw new Error("Canvas dimension not set")
            }
            if (ay.dataRenderer && L.isFunction(ay.dataRenderer)) {
                if (ay.dataRendererOptions) {
                    this.dataRendererOptions = ay.dataRendererOptions
                }
                this.dataRenderer = ay.dataRenderer;
                ar = this.dataRenderer(ar, this, this.dataRendererOptions)
            }
            if (ay.noDataIndicator && L.isPlainObject(ay.noDataIndicator)) {
                L.extend(true, this.noDataIndicator, ay.noDataIndicator)
            }
            if (ar == null || L.isArray(ar) == false || ar.length == 0 || L.isArray(ar[0]) == false || ar[0].length == 0) {
                if (this.noDataIndicator.show == false) {
                    throw new Error("No data specified")
                } else {
                    for (var al in this.noDataIndicator.axes) {
                        for (var an in this.noDataIndicator.axes[al]) {
                            this.axes[al][an] = this.noDataIndicator.axes[al][an]
                        }
                    }
                    this.postDrawHooks.add(function() {
                        var aD = this.eventCanvas.getHeight();
                        var aA = this.eventCanvas.getWidth();
                        var az = L('<div class="jqplot-noData-container" style="position:absolute;"></div>');
                        this.target.append(az);
                        az.height(aD);
                        az.width(aA);
                        az.css("top", this.eventCanvas._offsets.top);
                        az.css("left", this.eventCanvas._offsets.left);
                        var aC = L('<div class="jqplot-noData-contents" style="text-align:center; position:relative; margin-left:auto; margin-right:auto;"></div>');
                        az.append(aC);
                        aC.html(this.noDataIndicator.indicator);
                        var aB = aC.height();
                        var ax = aC.width();
                        aC.height(aB);
                        aC.width(ax);
                        aC.css("top", (aD - aB) / 2 + "px")
                    })
                }
            }
            this.data = L.extend(true, [], ar);
            this.parseOptions(ay);
            if (this.textColor) {
                this.target.css("color", this.textColor)
            }
            if (this.fontFamily) {
                this.target.css("font-family", this.fontFamily)
            }
            if (this.fontSize) {
                this.target.css("font-size", this.fontSize)
            }
            this.title.init();
            this.legend.init();
            this._sumy = 0;
            this._sumx = 0;
            this.computePlotData();
            for (var at = 0; at < this.series.length; at++) {
                this.seriesStack.push(at);
                this.previousSeriesStack.push(at);
                this.series[at].shadowCanvas._plotDimensions = this._plotDimensions;
                this.series[at].canvas._plotDimensions = this._plotDimensions;
                for (var aq = 0; aq < L.jqplot.preSeriesInitHooks.length; aq++) {
                    L.jqplot.preSeriesInitHooks[aq].call(this.series[at], av, this.data, this.options.seriesDefaults, this.options.series[at], this)
                }
                for (var aq = 0; aq < this.preSeriesInitHooks.hooks.length; aq++) {
                    this.preSeriesInitHooks.hooks[aq].call(this.series[at], av, this.data, this.options.seriesDefaults, this.options.series[at], this)
                }
                this.series[at]._plotDimensions = this._plotDimensions;
                this.series[at].init(at, this.grid.borderWidth, this);
                for (var aq = 0; aq < L.jqplot.postSeriesInitHooks.length; aq++) {
                    L.jqplot.postSeriesInitHooks[aq].call(this.series[at], av, this.data, this.options.seriesDefaults, this.options.series[at], this)
                }
                for (var aq = 0; aq < this.postSeriesInitHooks.hooks.length; aq++) {
                    this.postSeriesInitHooks.hooks[aq].call(this.series[at], av, this.data, this.options.seriesDefaults, this.options.series[at], this)
                }
                this._sumy += this.series[at]._sumy;
                this._sumx += this.series[at]._sumx
            }
            var am, ao;
            for (var at = 0, ap = U.length; at < ap; at++) {
                am = U[at];
                ao = this.axes[am];
                ao._plotDimensions = this._plotDimensions;
                ao.init();
                if (this.axes[am].borderColor == null) {
                    if (am.charAt(0) !== "x" && ao.useSeriesColor === true && ao.show) {
                        ao.borderColor = ao._series[0].color
                    } else {
                        ao.borderColor = this.grid.borderColor
                    }
                }
            }
            if (this.sortData) {
                ah(this.series)
            }
            this.grid.init();
            this.grid._axes = this.axes;
            this.legend._series = this.series;
            for (var at = 0; at < L.jqplot.postInitHooks.length; at++) {
                L.jqplot.postInitHooks[at].call(this, av, this.data, ay)
            }
            for (var at = 0; at < this.postInitHooks.hooks.length; at++) {
                this.postInitHooks.hooks[at].call(this, av, this.data, ay)
            }
        }
        ;
        this.resetAxesScale = function(aq, am) {
            var ao = am || {};
            var ap = aq || this.axes;
            if (ap === true) {
                ap = this.axes
            }
            if (L.isArray(ap)) {
                for (var an = 0; an < ap.length; an++) {
                    this.axes[ap[an]].resetScale(ao[ap[an]])
                }
            } else {
                if (typeof (ap) === "object") {
                    for (var al in ap) {
                        this.axes[al].resetScale(ao[al])
                    }
                }
            }
        }
        ;
        this.reInitialize = function(au, al) {
            var ay = L.extend(true, {}, this.options, al);
            var aw = this.targetId.substr(1);
            var ar = (au == null) ? this.data : au;
            for (var av = 0; av < L.jqplot.preInitHooks.length; av++) {
                L.jqplot.preInitHooks[av].call(this, aw, ar, ay)
            }
            for (var av = 0; av < this.preInitHooks.hooks.length; av++) {
                this.preInitHooks.hooks[av].call(this, aw, ar, ay)
            }
            this._height = this.target.height();
            this._width = this.target.width();
            if (this._height <= 0 || this._width <= 0 || !this._height || !this._width) {
                throw new Error("Target dimension not set")
            }
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            this.baseCanvas._plotDimensions = this._plotDimensions;
            this.eventCanvas._plotDimensions = this._plotDimensions;
            this.legend._plotDimensions = this._plotDimensions;
            var am, ax, at, ao;
            for (var av = 0, aq = U.length; av < aq; av++) {
                am = U[av];
                ao = this.axes[am];
                ax = ao._ticks;
                for (var at = 0, ap = ax.length; at < ap; at++) {
                    var an = ax[at]._elem;
                    if (an) {
                        if (L.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== u) {
                            window.G_vmlCanvasManager.uninitElement(an.get(0))
                        }
                        an.emptyForce();
                        an = null;
                        ax._elem = null
                    }
                }
                ax = null;
                delete ao.ticks;
                delete ao._ticks;
                this.axes[am] = new w(am);
                this.axes[am]._plotWidth = this._width;
                this.axes[am]._plotHeight = this._height
            }
            if (au) {
                if (ay.dataRenderer && L.isFunction(ay.dataRenderer)) {
                    if (ay.dataRendererOptions) {
                        this.dataRendererOptions = ay.dataRendererOptions
                    }
                    this.dataRenderer = ay.dataRenderer;
                    au = this.dataRenderer(au, this, this.dataRendererOptions)
                }
                this.data = L.extend(true, [], au)
            }
            if (al) {
                this.parseOptions(ay)
            }
            this.title._plotWidth = this._width;
            if (this.textColor) {
                this.target.css("color", this.textColor)
            }
            if (this.fontFamily) {
                this.target.css("font-family", this.fontFamily)
            }
            if (this.fontSize) {
                this.target.css("font-size", this.fontSize)
            }
            this.title.init();
            this.legend.init();
            this._sumy = 0;
            this._sumx = 0;
            this.seriesStack = [];
            this.previousSeriesStack = [];
            this.computePlotData();
            for (var av = 0, aq = this.series.length; av < aq; av++) {
                this.seriesStack.push(av);
                this.previousSeriesStack.push(av);
                this.series[av].shadowCanvas._plotDimensions = this._plotDimensions;
                this.series[av].canvas._plotDimensions = this._plotDimensions;
                for (var at = 0; at < L.jqplot.preSeriesInitHooks.length; at++) {
                    L.jqplot.preSeriesInitHooks[at].call(this.series[av], aw, this.data, this.options.seriesDefaults, this.options.series[av], this)
                }
                for (var at = 0; at < this.preSeriesInitHooks.hooks.length; at++) {
                    this.preSeriesInitHooks.hooks[at].call(this.series[av], aw, this.data, this.options.seriesDefaults, this.options.series[av], this)
                }
                this.series[av]._plotDimensions = this._plotDimensions;
                this.series[av].init(av, this.grid.borderWidth, this);
                for (var at = 0; at < L.jqplot.postSeriesInitHooks.length; at++) {
                    L.jqplot.postSeriesInitHooks[at].call(this.series[av], aw, this.data, this.options.seriesDefaults, this.options.series[av], this)
                }
                for (var at = 0; at < this.postSeriesInitHooks.hooks.length; at++) {
                    this.postSeriesInitHooks.hooks[at].call(this.series[av], aw, this.data, this.options.seriesDefaults, this.options.series[av], this)
                }
                this._sumy += this.series[av]._sumy;
                this._sumx += this.series[av]._sumx
            }
            for (var av = 0, aq = U.length; av < aq; av++) {
                am = U[av];
                ao = this.axes[am];
                ao._plotDimensions = this._plotDimensions;
                ao.init();
                if (ao.borderColor == null) {
                    if (am.charAt(0) !== "x" && ao.useSeriesColor === true && ao.show) {
                        ao.borderColor = ao._series[0].color
                    } else {
                        ao.borderColor = this.grid.borderColor
                    }
                }
            }
            if (this.sortData) {
                ah(this.series)
            }
            this.grid.init();
            this.grid._axes = this.axes;
            this.legend._series = this.series;
            for (var av = 0, aq = L.jqplot.postInitHooks.length; av < aq; av++) {
                L.jqplot.postInitHooks[av].call(this, aw, this.data, ay)
            }
            for (var av = 0, aq = this.postInitHooks.hooks.length; av < aq; av++) {
                this.postInitHooks.hooks[av].call(this, aw, this.data, ay)
            }
        }
        ;
        this.quickInit = function() {
            this._height = this.target.height();
            this._width = this.target.width();
            if (this._height <= 0 || this._width <= 0 || !this._height || !this._width) {
                throw new Error("Target dimension not set")
            }
            this._plotDimensions.height = this._height;
            this._plotDimensions.width = this._width;
            this.grid._plotDimensions = this._plotDimensions;
            this.title._plotDimensions = this._plotDimensions;
            this.baseCanvas._plotDimensions = this._plotDimensions;
            this.eventCanvas._plotDimensions = this._plotDimensions;
            this.legend._plotDimensions = this._plotDimensions;
            for (var aq in this.axes) {
                this.axes[aq]._plotWidth = this._width;
                this.axes[aq]._plotHeight = this._height
            }
            this.title._plotWidth = this._width;
            if (this.textColor) {
                this.target.css("color", this.textColor)
            }
            if (this.fontFamily) {
                this.target.css("font-family", this.fontFamily)
            }
            if (this.fontSize) {
                this.target.css("font-size", this.fontSize)
            }
            this._sumy = 0;
            this._sumx = 0;
            this.computePlotData();
            for (var ao = 0; ao < this.series.length; ao++) {
                if (this.series[ao]._type === "line" && this.series[ao].renderer.bands.show) {
                    this.series[ao].renderer.initBands.call(this.series[ao], this.series[ao].renderer.options, this)
                }
                this.series[ao]._plotDimensions = this._plotDimensions;
                this.series[ao].canvas._plotDimensions = this._plotDimensions;
                this._sumy += this.series[ao]._sumy;
                this._sumx += this.series[ao]._sumx
            }
            var am;
            for (var al = 0; al < 12; al++) {
                am = U[al];
                var an = this.axes[am]._ticks;
                for (var ao = 0; ao < an.length; ao++) {
                    var ap = an[ao]._elem;
                    if (ap) {
                        if (L.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== u) {
                            window.G_vmlCanvasManager.uninitElement(ap.get(0))
                        }
                        ap.emptyForce();
                        ap = null;
                        an._elem = null
                    }
                }
                an = null;
                this.axes[am]._plotDimensions = this._plotDimensions;
                this.axes[am]._ticks = []
            }
            if (this.sortData) {
                ah(this.series)
            }
            this.grid._axes = this.axes;
            this.legend._series = this.series
        }
        ;
        function ah(ap) {
            var au, av, aw, al, at;
            for (var aq = 0; aq < ap.length; aq++) {
                var am;
                var ar = [ap[aq].data, ap[aq]._stackData, ap[aq]._plotData, ap[aq]._prevPlotData];
                for (var an = 0; an < 4; an++) {
                    am = true;
                    au = ar[an];
                    if (ap[aq]._stackAxis == "x") {
                        for (var ao = 0; ao < au.length; ao++) {
                            if (typeof (au[ao][1]) != "number") {
                                am = false;
                                break
                            }
                        }
                        if (am) {
                            au.sort(function(ay, ax) {
                                return ay[1] - ax[1]
                            })
                        }
                    } else {
                        for (var ao = 0; ao < au.length; ao++) {
                            if (typeof (au[ao][0]) != "number") {
                                am = false;
                                break
                            }
                        }
                        if (am) {
                            au.sort(function(ay, ax) {
                                return ay[0] - ax[0]
                            })
                        }
                    }
                }
            }
        }
        this.computePlotData = function() {
            this._plotData = [];
            this._stackData = [];
            var at, au, ao;
            for (au = 0,
            ao = this.series.length; au < ao; au++) {
                at = this.series[au];
                this._plotData.push([]);
                this._stackData.push([]);
                var am = at.data;
                this._plotData[au] = L.extend(true, [], am);
                this._stackData[au] = L.extend(true, [], am);
                at._plotData = this._plotData[au];
                at._stackData = this._stackData[au];
                var ax = {
                    x: [],
                    y: []
                };
                if (this.stackSeries && !at.disableStack) {
                    at._stack = true;
                    var av = (at._stackAxis === "x") ? 0 : 1;
                    for (var ap = 0, al = am.length; ap < al; ap++) {
                        var aw = am[ap][av];
                        if (aw == null) {
                            aw = 0
                        }
                        this._plotData[au][ap][av] = aw;
                        this._stackData[au][ap][av] = aw;
                        if (au > 0) {
                            for (var aq = au; aq--; ) {
                                var an = this._plotData[aq][ap][av];
                                if (aw * an >= 0) {
                                    this._plotData[au][ap][av] += an;
                                    this._stackData[au][ap][av] += an;
                                    break
                                }
                            }
                        }
                    }
                } else {
                    for (var ar = 0; ar < at.data.length; ar++) {
                        ax.x.push(at.data[ar][0]);
                        ax.y.push(at.data[ar][1])
                    }
                    this._stackData.push(at.data);
                    this.series[au]._stackData = at.data;
                    this._plotData.push(at.data);
                    at._plotData = at.data;
                    at._plotValues = ax
                }
                if (au > 0) {
                    at._prevPlotData = this.series[au - 1]._plotData
                }
                at._sumy = 0;
                at._sumx = 0;
                for (ar = at.data.length - 1; ar > -1; ar--) {
                    at._sumy += at.data[ar][1];
                    at._sumx += at.data[ar][0]
                }
            }
        }
        ;
        this.populatePlotData = function(au, av) {
            this._plotData = [];
            this._stackData = [];
            au._stackData = [];
            au._plotData = [];
            var ay = {
                x: [],
                y: []
            };
            if (this.stackSeries && !au.disableStack) {
                au._stack = true;
                var ax = (au._stackAxis === "x") ? 0 : 1;
                var az = L.extend(true, [], au.data);
                var aA = L.extend(true, [], au.data);
                var an, am, ao, aw, al;
                for (var ar = 0; ar < av; ar++) {
                    var ap = this.series[ar].data;
                    for (var aq = 0; aq < ap.length; aq++) {
                        ao = ap[aq];
                        an = (ao[0] != null) ? ao[0] : 0;
                        am = (ao[1] != null) ? ao[1] : 0;
                        az[aq][0] += an;
                        az[aq][1] += am;
                        aw = (ax) ? am : an;
                        if (au.data[aq][ax] * aw >= 0) {
                            aA[aq][ax] += aw
                        }
                    }
                }
                for (var at = 0; at < aA.length; at++) {
                    ay.x.push(aA[at][0]);
                    ay.y.push(aA[at][1])
                }
                this._plotData.push(aA);
                this._stackData.push(az);
                au._stackData = az;
                au._plotData = aA;
                au._plotValues = ay
            } else {
                for (var at = 0; at < au.data.length; at++) {
                    ay.x.push(au.data[at][0]);
                    ay.y.push(au.data[at][1])
                }
                this._stackData.push(au.data);
                this.series[av]._stackData = au.data;
                this._plotData.push(au.data);
                au._plotData = au.data;
                au._plotValues = ay
            }
            if (av > 0) {
                au._prevPlotData = this.series[av - 1]._plotData
            }
            au._sumy = 0;
            au._sumx = 0;
            for (at = au.data.length - 1; at > -1; at--) {
                au._sumy += au.data[at][1];
                au._sumx += au.data[at][0]
            }
        }
        ;
        this.getNextSeriesColor = (function(am) {
            var al = 0;
            var an = am.seriesColors;
            return function() {
                if (al < an.length) {
                    return an[al++]
                } else {
                    al = 0;
                    return an[al++]
                }
            }
        }
        )(this);
        this.parseOptions = function(ay) {
            for (var at = 0; at < this.preParseOptionsHooks.hooks.length; at++) {
                this.preParseOptionsHooks.hooks[at].call(this, ay)
            }
            for (var at = 0; at < L.jqplot.preParseOptionsHooks.length; at++) {
                L.jqplot.preParseOptionsHooks[at].call(this, ay)
            }
            this.options = L.extend(true, {}, this.defaults, ay);
            var am = this.options;
            this.animate = am.animate;
            this.animateReplot = am.animateReplot;
            this.stackSeries = am.stackSeries;
            if (L.isPlainObject(am.fillBetween)) {
                var ax = ["series1", "series2", "color", "baseSeries", "fill"], au;
                for (var at = 0, aq = ax.length; at < aq; at++) {
                    au = ax[at];
                    if (am.fillBetween[au] != null) {
                        this.fillBetween[au] = am.fillBetween[au]
                    }
                }
            }
            if (am.seriesColors) {
                this.seriesColors = am.seriesColors
            }
            if (am.negativeSeriesColors) {
                this.negativeSeriesColors = am.negativeSeriesColors
            }
            if (am.captureRightClick) {
                this.captureRightClick = am.captureRightClick
            }
            this.defaultAxisStart = (ay && ay.defaultAxisStart != null) ? ay.defaultAxisStart : this.defaultAxisStart;
            this.colorGenerator.setColors(this.seriesColors);
            this.negativeColorGenerator.setColors(this.negativeSeriesColors);
            L.extend(true, this._gridPadding, am.gridPadding);
            this.sortData = (am.sortData != null) ? am.sortData : this.sortData;
            for (var at = 0; at < 12; at++) {
                var an = U[at];
                var ap = this.axes[an];
                ap._options = L.extend(true, {}, am.axesDefaults, am.axes[an]);
                L.extend(true, ap, am.axesDefaults, am.axes[an]);
                ap._plotWidth = this._width;
                ap._plotHeight = this._height
            }
            var aw = function(aD, aB, aE) {
                var aA = [];
                var aC, az;
                aB = aB || "vertical";
                if (!L.isArray(aD[0])) {
                    for (aC = 0,
                    az = aD.length; aC < az; aC++) {
                        if (aB == "vertical") {
                            aA.push([aE + aC, aD[aC]])
                        } else {
                            aA.push([aD[aC], aE + aC])
                        }
                    }
                } else {
                    L.extend(true, aA, aD)
                }
                return aA
            };
            var av = 0;
            this.series = [];
            for (var at = 0; at < this.data.length; at++) {
                var al = L.extend(true, {
                    index: at
                }, {
                    seriesColors: this.seriesColors,
                    negativeSeriesColors: this.negativeSeriesColors
                }, this.options.seriesDefaults, this.options.series[at], {
                    rendererOptions: {
                        animation: {
                            show: this.animate
                        }
                    }
                });
                var ax = new S(al);
                for (var ar = 0; ar < L.jqplot.preParseSeriesOptionsHooks.length; ar++) {
                    L.jqplot.preParseSeriesOptionsHooks[ar].call(ax, this.options.seriesDefaults, this.options.series[at])
                }
                for (var ar = 0; ar < this.preParseSeriesOptionsHooks.hooks.length; ar++) {
                    this.preParseSeriesOptionsHooks.hooks[ar].call(ax, this.options.seriesDefaults, this.options.series[at])
                }
                L.extend(true, ax, al);
                var ao = "vertical";
                if (ax.renderer === L.jqplot.BarRenderer && ax.rendererOptions && ax.rendererOptions.barDirection == "horizontal") {
                    ao = "horizontal";
                    ax._stackAxis = "x";
                    ax._primaryAxis = "_yaxis"
                }
                ax.data = aw(this.data[at], ao, this.defaultAxisStart);
                switch (ax.xaxis) {
                case "xaxis":
                    ax._xaxis = this.axes.xaxis;
                    break;
                case "x2axis":
                    ax._xaxis = this.axes.x2axis;
                    break;
                default:
                    break
                }
                ax._yaxis = this.axes[ax.yaxis];
                ax._xaxis._series.push(ax);
                ax._yaxis._series.push(ax);
                if (ax.show) {
                    ax._xaxis.show = true;
                    ax._yaxis.show = true
                } else {
                    if (ax._xaxis.scaleToHiddenSeries) {
                        ax._xaxis.show = true
                    }
                    if (ax._yaxis.scaleToHiddenSeries) {
                        ax._yaxis.show = true
                    }
                }
                if (!ax.label) {
                    ax.label = "Series " + (at + 1).toString()
                }
                this.series.push(ax);
                for (var ar = 0; ar < L.jqplot.postParseSeriesOptionsHooks.length; ar++) {
                    L.jqplot.postParseSeriesOptionsHooks[ar].call(this.series[at], this.options.seriesDefaults, this.options.series[at])
                }
                for (var ar = 0; ar < this.postParseSeriesOptionsHooks.hooks.length; ar++) {
                    this.postParseSeriesOptionsHooks.hooks[ar].call(this.series[at], this.options.seriesDefaults, this.options.series[at])
                }
            }
            L.extend(true, this.grid, this.options.grid);
            for (var at = 0, aq = U.length; at < aq; at++) {
                var an = U[at];
                var ap = this.axes[an];
                if (ap.borderWidth == null) {
                    ap.borderWidth = this.grid.borderWidth
                }
            }
            if (typeof this.options.title == "string") {
                this.title.text = this.options.title
            } else {
                if (typeof this.options.title == "object") {
                    L.extend(true, this.title, this.options.title)
                }
            }
            this.title._plotWidth = this._width;
            this.legend.setOptions(this.options.legend);
            for (var at = 0; at < L.jqplot.postParseOptionsHooks.length; at++) {
                L.jqplot.postParseOptionsHooks[at].call(this, ay)
            }
            for (var at = 0; at < this.postParseOptionsHooks.hooks.length; at++) {
                this.postParseOptionsHooks.hooks[at].call(this, ay)
            }
        }
        ;
        this.destroy = function() {
            this.canvasManager.freeAllCanvases();
            if (this.eventCanvas && this.eventCanvas._elem) {
                this.eventCanvas._elem.unbind()
            }
            this.target.empty();
            this.target[0].innerHTML = ""
        }
        ;
        this.replot = function(am) {
            var an = am || {};
            var ap = an.data || null;
            var al = (an.clear === false) ? false : true;
            var ao = an.resetAxes || false;
            delete an.data;
            delete an.clear;
            delete an.resetAxes;
            this.target.trigger("jqplotPreReplot");
            if (al) {
                this.destroy()
            }
            if (ap || !L.isEmptyObject(an)) {
                this.reInitialize(ap, an)
            } else {
                this.quickInit()
            }
            if (ao) {
                this.resetAxesScale(ao, an.axes)
            }
            this.draw();
            this.target.trigger("jqplotPostReplot")
        }
        ;
        this.redraw = function(al) {
            al = (al != null) ? al : true;
            this.target.trigger("jqplotPreRedraw");
            if (al) {
                this.canvasManager.freeAllCanvases();
                this.eventCanvas._elem.unbind();
                this.target.empty()
            }
            for (var an in this.axes) {
                this.axes[an]._ticks = []
            }
            this.computePlotData();
            this._sumy = 0;
            this._sumx = 0;
            for (var am = 0, ao = this.series.length; am < ao; am++) {
                this._sumy += this.series[am]._sumy;
                this._sumx += this.series[am]._sumx
            }
            this.draw();
            this.target.trigger("jqplotPostRedraw")
        }
        ;
        this.draw = function() {
            if (this.drawIfHidden || this.target.is(":visible")) {
                this.target.trigger("jqplotPreDraw");
                var aH, aF, aE, ao;
                for (aH = 0,
                aE = L.jqplot.preDrawHooks.length; aH < aE; aH++) {
                    L.jqplot.preDrawHooks[aH].call(this)
                }
                for (aH = 0,
                aE = this.preDrawHooks.hooks.length; aH < aE; aH++) {
                    this.preDrawHooks.hooks[aH].apply(this, this.preDrawSeriesHooks.args[aH])
                }
                this.target.append(this.baseCanvas.createElement({
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }, "jqplot-base-canvas", null, this));
                this.baseCanvas.setContext();
                this.target.append(this.title.draw());
                this.title.pack({
                    top: 0,
                    left: 0
                });
                var aL = this.legend.draw({}, this);
                var al = {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                };
                if (this.legend.placement == "outsideGrid") {
                    this.target.append(aL);
                    switch (this.legend.location) {
                    case "n":
                        al.top += this.legend.getHeight();
                        break;
                    case "s":
                        al.bottom += this.legend.getHeight();
                        break;
                    case "ne":
                    case "e":
                    case "se":
                        al.right += this.legend.getWidth();
                        break;
                    case "nw":
                    case "w":
                    case "sw":
                        al.left += this.legend.getWidth();
                        break;
                    default:
                        al.right += this.legend.getWidth();
                        break
                    }
                    aL = aL.detach()
                }
                var ar = this.axes;
                var aM;
                for (aH = 0; aH < 12; aH++) {
                    aM = U[aH];
                    this.target.append(ar[aM].draw(this.baseCanvas._ctx, this));
                    ar[aM].set()
                }
                if (ar.yaxis.show) {
                    al.left += ar.yaxis.getWidth()
                }
                var aG = ["y2axis", "y3axis", "y4axis", "y5axis", "y6axis", "y7axis", "y8axis", "y9axis"];
                var az = [0, 0, 0, 0, 0, 0, 0, 0];
                var aC = 0;
                var aB;
                for (aB = 0; aB < 8; aB++) {
                    if (ar[aG[aB]].show) {
                        aC += ar[aG[aB]].getWidth();
                        az[aB] = aC
                    }
                }
                al.right += aC;
                if (ar.x2axis.show) {
                    al.top += ar.x2axis.getHeight()
                }
                if (this.title.show) {
                    al.top += this.title.getHeight()
                }
                if (ar.xaxis.show) {
                    al.bottom += ar.xaxis.getHeight()
                }
                if (this.options.gridDimensions && L.isPlainObject(this.options.gridDimensions)) {
                    var at = parseInt(this.options.gridDimensions.width, 10) || 0;
                    var aI = parseInt(this.options.gridDimensions.height, 10) || 0;
                    var an = (this._width - al.left - al.right - at) / 2;
                    var aK = (this._height - al.top - al.bottom - aI) / 2;
                    if (aK >= 0 && an >= 0) {
                        al.top += aK;
                        al.bottom += aK;
                        al.left += an;
                        al.right += an
                    }
                }
                var am = ["top", "bottom", "left", "right"];
                for (var aB in am) {
                    if (this._gridPadding[am[aB]] == null && al[am[aB]] > 0) {
                        this._gridPadding[am[aB]] = al[am[aB]]
                    } else {
                        if (this._gridPadding[am[aB]] == null) {
                            this._gridPadding[am[aB]] = this._defaultGridPadding[am[aB]]
                        }
                    }
                }
                var aA = this._gridPadding;
                if (this.legend.placement === "outsideGrid") {
                    aA = {
                        top: this.title.getHeight(),
                        left: 0,
                        right: 0,
                        bottom: 0
                    };
                    if (this.legend.location === "s") {
                        aA.left = this._gridPadding.left;
                        aA.right = this._gridPadding.right
                    }
                }
                ar.xaxis.pack({
                    position: "absolute",
                    bottom: this._gridPadding.bottom - ar.xaxis.getHeight(),
                    left: 0,
                    width: this._width
                }, {
                    min: this._gridPadding.left,
                    max: this._width - this._gridPadding.right
                });
                ar.yaxis.pack({
                    position: "absolute",
                    top: 0,
                    left: this._gridPadding.left - ar.yaxis.getWidth(),
                    height: this._height
                }, {
                    min: this._height - this._gridPadding.bottom,
                    max: this._gridPadding.top
                });
                ar.x2axis.pack({
                    position: "absolute",
                    top: this._gridPadding.top - ar.x2axis.getHeight(),
                    left: 0,
                    width: this._width
                }, {
                    min: this._gridPadding.left,
                    max: this._width - this._gridPadding.right
                });
                for (aH = 8; aH > 0; aH--) {
                    ar[aG[aH - 1]].pack({
                        position: "absolute",
                        top: 0,
                        right: this._gridPadding.right - az[aH - 1]
                    }, {
                        min: this._height - this._gridPadding.bottom,
                        max: this._gridPadding.top
                    })
                }
                var au = (this._width - this._gridPadding.left - this._gridPadding.right) / 2 + this._gridPadding.left - ar.yMidAxis.getWidth() / 2;
                ar.yMidAxis.pack({
                    position: "absolute",
                    top: 0,
                    left: au,
                    zIndex: 9,
                    textAlign: "center"
                }, {
                    min: this._height - this._gridPadding.bottom,
                    max: this._gridPadding.top
                });
                this.target.append(this.grid.createElement(this._gridPadding, this));
                this.grid.draw();
                var aq = this.series;
                var aJ = aq.length;
                for (aH = 0,
                aE = aJ; aH < aE; aH++) {
                    aF = this.seriesStack[aH];
                    this.target.append(aq[aF].shadowCanvas.createElement(this._gridPadding, "jqplot-series-shadowCanvas", null, this));
                    aq[aF].shadowCanvas.setContext();
                    aq[aF].shadowCanvas._elem.data("seriesIndex", aF)
                }
                for (aH = 0,
                aE = aJ; aH < aE; aH++) {
                    aF = this.seriesStack[aH];
                    this.target.append(aq[aF].canvas.createElement(this._gridPadding, "jqplot-series-canvas", null, this));
                    aq[aF].canvas.setContext();
                    aq[aF].canvas._elem.data("seriesIndex", aF)
                }
                this.target.append(this.eventCanvas.createElement(this._gridPadding, "jqplot-event-canvas", null, this));
                this.eventCanvas.setContext();
                this.eventCanvas._ctx.fillStyle = "rgba(0,0,0,0)";
                this.eventCanvas._ctx.fillRect(0, 0, this.eventCanvas._ctx.canvas.width, this.eventCanvas._ctx.canvas.height);
                this.bindCustomEvents();
                if (this.legend.preDraw) {
                    this.eventCanvas._elem.before(aL);
                    this.legend.pack(aA);
                    if (this.legend._elem) {
                        this.drawSeries({
                            legendInfo: {
                                location: this.legend.location,
                                placement: this.legend.placement,
                                width: this.legend.getWidth(),
                                height: this.legend.getHeight(),
                                xoffset: this.legend.xoffset,
                                yoffset: this.legend.yoffset
                            }
                        })
                    } else {
                        this.drawSeries()
                    }
                } else {
                    this.drawSeries();
                    if (aJ) {
                        L(aq[aJ - 1].canvas._elem).after(aL)
                    }
                    this.legend.pack(aA)
                }
                for (var aH = 0, aE = L.jqplot.eventListenerHooks.length; aH < aE; aH++) {
                    this.eventCanvas._elem.bind(L.jqplot.eventListenerHooks[aH][0], {
                        plot: this
                    }, L.jqplot.eventListenerHooks[aH][1])
                }
                for (var aH = 0, aE = this.eventListenerHooks.hooks.length; aH < aE; aH++) {
                    this.eventCanvas._elem.bind(this.eventListenerHooks.hooks[aH][0], {
                        plot: this
                    }, this.eventListenerHooks.hooks[aH][1])
                }
                var ay = this.fillBetween;
                if (ay.fill && ay.series1 !== ay.series2 && ay.series1 < aJ && ay.series2 < aJ && aq[ay.series1]._type === "line" && aq[ay.series2]._type === "line") {
                    this.doFillBetweenLines()
                }
                for (var aH = 0, aE = L.jqplot.postDrawHooks.length; aH < aE; aH++) {
                    L.jqplot.postDrawHooks[aH].call(this)
                }
                for (var aH = 0, aE = this.postDrawHooks.hooks.length; aH < aE; aH++) {
                    this.postDrawHooks.hooks[aH].apply(this, this.postDrawHooks.args[aH])
                }
                if (this.target.is(":visible")) {
                    this._drawCount += 1
                }
                var av, aw, aD, ap;
                for (aH = 0,
                aE = aJ; aH < aE; aH++) {
                    av = aq[aH];
                    aw = av.renderer;
                    aD = ".jqplot-point-label.jqplot-series-" + aH;
                    if (aw.animation && aw.animation._supported && aw.animation.show && (this._drawCount < 2 || this.animateReplot)) {
                        ap = this.target.find(aD);
                        ap.stop(true, true).hide();
                        av.canvas._elem.stop(true, true).hide();
                        av.shadowCanvas._elem.stop(true, true).hide();
                        av.canvas._elem.jqplotEffect("blind", {
                            mode: "show",
                            direction: aw.animation.direction
                        }, aw.animation.speed);
                        av.shadowCanvas._elem.jqplotEffect("blind", {
                            mode: "show",
                            direction: aw.animation.direction
                        }, aw.animation.speed);
                        ap.fadeIn(aw.animation.speed * 0.8)
                    }
                }
                ap = null;
                this.target.trigger("jqplotPostDraw", [this])
            }
        }
        ;
        R.prototype.doFillBetweenLines = function() {
            var an = this.fillBetween;
            var ax = an.series1;
            var av = an.series2;
            var aw = (ax < av) ? ax : av;
            var au = (av > ax) ? av : ax;
            var ar = this.series[aw];
            var aq = this.series[au];
            if (aq.renderer.smooth) {
                var ap = aq.renderer._smoothedData.slice(0).reverse()
            } else {
                var ap = aq.gridData.slice(0).reverse()
            }
            if (ar.renderer.smooth) {
                var at = ar.renderer._smoothedData.concat(ap)
            } else {
                var at = ar.gridData.concat(ap)
            }
            var ao = (an.color !== null) ? an.color : this.series[ax].fillColor;
            var ay = (an.baseSeries !== null) ? an.baseSeries : aw;
            var am = this.series[ay].renderer.shapeRenderer;
            var al = {
                fillStyle: ao,
                fill: true,
                closePath: true
            };
            am.draw(ar.shadowCanvas._ctx, at, al)
        }
        ;
        this.bindCustomEvents = function() {
            this.eventCanvas._elem.bind("click", {
                plot: this
            }, this.onClick);
            this.eventCanvas._elem.bind("dblclick", {
                plot: this
            }, this.onDblClick);
            this.eventCanvas._elem.bind("mousedown", {
                plot: this
            }, this.onMouseDown);
            this.eventCanvas._elem.bind("mousemove", {
                plot: this
            }, this.onMouseMove);
            this.eventCanvas._elem.bind("mouseenter", {
                plot: this
            }, this.onMouseEnter);
            this.eventCanvas._elem.bind("mouseleave", {
                plot: this
            }, this.onMouseLeave);
            if (this.captureRightClick) {
                this.eventCanvas._elem.bind("mouseup", {
                    plot: this
                }, this.onRightClick);
                this.eventCanvas._elem.get(0).oncontextmenu = function() {
                    return false
                }
            } else {
                this.eventCanvas._elem.bind("mouseup", {
                    plot: this
                }, this.onMouseUp)
            }
        }
        ;
        function ai(av) {
            var au = av.data.plot;
            var ap = au.eventCanvas._elem.offset();
            var at = {
                x: av.pageX - ap.left,
                y: av.pageY - ap.top
            };
            var aq = {
                xaxis: null,
                yaxis: null,
                x2axis: null,
                y2axis: null,
                y3axis: null,
                y4axis: null,
                y5axis: null,
                y6axis: null,
                y7axis: null,
                y8axis: null,
                y9axis: null,
                yMidAxis: null
            };
            var ar = ["xaxis", "yaxis", "x2axis", "y2axis", "y3axis", "y4axis", "y5axis", "y6axis", "y7axis", "y8axis", "y9axis", "yMidAxis"];
            var al = au.axes;
            var am, ao;
            for (am = 11; am > 0; am--) {
                ao = ar[am - 1];
                if (al[ao].show) {
                    aq[ao] = al[ao].series_p2u(at[ao.charAt(0)])
                }
            }
            return {
                offsets: ap,
                gridPos: at,
                dataPos: aq
            }
        }
        function ak(al, am) {
            var aq = am.series;
            var aW, aU, aT, aO, aP, aJ, aI, aw, au, az, aA, aK;
            var aS, aX, aQ, ar, aH, aM, aV;
            var an, aN;
            for (aT = am.seriesStack.length - 1; aT >= 0; aT--) {
                aW = am.seriesStack[aT];
                aO = aq[aW];
                aV = aO._highlightThreshold;
                switch (aO.renderer.constructor) {
                case L.jqplot.BarRenderer:
                    aJ = al.x;
                    aI = al.y;
                    for (aU = 0; aU < aO._barPoints.length; aU++) {
                        aH = aO._barPoints[aU];
                        aQ = aO.gridData[aU];
                        if (aJ > aH[0][0] && aJ < aH[2][0] && aI > aH[2][1] && aI < aH[0][1]) {
                            return {
                                seriesIndex: aO.index,
                                pointIndex: aU,
                                gridData: aQ,
                                data: aO.data[aU],
                                points: aO._barPoints[aU]
                            }
                        }
                    }
                    break;
                case L.jqplot.PyramidRenderer:
                    aJ = al.x;
                    aI = al.y;
                    for (aU = 0; aU < aO._barPoints.length; aU++) {
                        aH = aO._barPoints[aU];
                        aQ = aO.gridData[aU];
                        if (aJ > aH[0][0] + aV[0][0] && aJ < aH[2][0] + aV[2][0] && aI > aH[2][1] && aI < aH[0][1]) {
                            return {
                                seriesIndex: aO.index,
                                pointIndex: aU,
                                gridData: aQ,
                                data: aO.data[aU],
                                points: aO._barPoints[aU]
                            }
                        }
                    }
                    break;
                case L.jqplot.DonutRenderer:
                    az = aO.startAngle / 180 * Math.PI;
                    aJ = al.x - aO._center[0];
                    aI = al.y - aO._center[1];
                    aP = Math.sqrt(Math.pow(aJ, 2) + Math.pow(aI, 2));
                    if (aJ > 0 && -aI >= 0) {
                        aw = 2 * Math.PI - Math.atan(-aI / aJ)
                    } else {
                        if (aJ > 0 && -aI < 0) {
                            aw = -Math.atan(-aI / aJ)
                        } else {
                            if (aJ < 0) {
                                aw = Math.PI - Math.atan(-aI / aJ)
                            } else {
                                if (aJ == 0 && -aI > 0) {
                                    aw = 3 * Math.PI / 2
                                } else {
                                    if (aJ == 0 && -aI < 0) {
                                        aw = Math.PI / 2
                                    } else {
                                        if (aJ == 0 && aI == 0) {
                                            aw = 0
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (az) {
                        aw -= az;
                        if (aw < 0) {
                            aw += 2 * Math.PI
                        } else {
                            if (aw > 2 * Math.PI) {
                                aw -= 2 * Math.PI
                            }
                        }
                    }
                    au = aO.sliceMargin / 180 * Math.PI;
                    if (aP < aO._radius && aP > aO._innerRadius) {
                        for (aU = 0; aU < aO.gridData.length; aU++) {
                            aA = (aU > 0) ? aO.gridData[aU - 1][1] + au : au;
                            aK = aO.gridData[aU][1];
                            if (aw > aA && aw < aK) {
                                return {
                                    seriesIndex: aO.index,
                                    pointIndex: aU,
                                    gridData: [al.x, al.y],
                                    data: aO.data[aU]
                                }
                            }
                        }
                    }
                    break;
                case L.jqplot.PieRenderer:
                    az = aO.startAngle / 180 * Math.PI;
                    aJ = al.x - aO._center[0];
                    aI = al.y - aO._center[1];
                    aP = Math.sqrt(Math.pow(aJ, 2) + Math.pow(aI, 2));
                    if (aJ > 0 && -aI >= 0) {
                        aw = 2 * Math.PI - Math.atan(-aI / aJ)
                    } else {
                        if (aJ > 0 && -aI < 0) {
                            aw = -Math.atan(-aI / aJ)
                        } else {
                            if (aJ < 0) {
                                aw = Math.PI - Math.atan(-aI / aJ)
                            } else {
                                if (aJ == 0 && -aI > 0) {
                                    aw = 3 * Math.PI / 2
                                } else {
                                    if (aJ == 0 && -aI < 0) {
                                        aw = Math.PI / 2
                                    } else {
                                        if (aJ == 0 && aI == 0) {
                                            aw = 0
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (az) {
                        aw -= az;
                        if (aw < 0) {
                            aw += 2 * Math.PI
                        } else {
                            if (aw > 2 * Math.PI) {
                                aw -= 2 * Math.PI
                            }
                        }
                    }
                    au = aO.sliceMargin / 180 * Math.PI;
                    if (aP < aO._radius) {
                        for (aU = 0; aU < aO.gridData.length; aU++) {
                            aA = (aU > 0) ? aO.gridData[aU - 1][1] + au : au;
                            aK = aO.gridData[aU][1];
                            if (aw > aA && aw < aK) {
                                return {
                                    seriesIndex: aO.index,
                                    pointIndex: aU,
                                    gridData: [al.x, al.y],
                                    data: aO.data[aU]
                                }
                            }
                        }
                    }
                    break;
                case L.jqplot.BubbleRenderer:
                    aJ = al.x;
                    aI = al.y;
                    var aF = null;
                    if (aO.show) {
                        for (var aU = 0; aU < aO.gridData.length; aU++) {
                            aQ = aO.gridData[aU];
                            aX = Math.sqrt((aJ - aQ[0]) * (aJ - aQ[0]) + (aI - aQ[1]) * (aI - aQ[1]));
                            if (aX <= aQ[2] && (aX <= aS || aS == null)) {
                                aS = aX;
                                aF = {
                                    seriesIndex: aW,
                                    pointIndex: aU,
                                    gridData: aQ,
                                    data: aO.data[aU]
                                }
                            }
                        }
                        if (aF != null) {
                            return aF
                        }
                    }
                    break;
                case L.jqplot.FunnelRenderer:
                    aJ = al.x;
                    aI = al.y;
                    var aL = aO._vertices, ap = aL[0], ao = aL[aL.length - 1], at, aE, ay;
                    function aR(a0, a2, a1) {
                        var aZ = (a2[1] - a1[1]) / (a2[0] - a1[0]);
                        var aY = a2[1] - aZ * a2[0];
                        var a3 = a0 + a2[1];
                        return [(a3 - aY) / aZ, a3]
                    }
                    at = aR(aI, ap[0], ao[3]);
                    aE = aR(aI, ap[1], ao[2]);
                    for (aU = 0; aU < aL.length; aU++) {
                        ay = aL[aU];
                        if (aI >= ay[0][1] && aI <= ay[3][1] && aJ >= at[0] && aJ <= aE[0]) {
                            return {
                                seriesIndex: aO.index,
                                pointIndex: aU,
                                gridData: null,
                                data: aO.data[aU]
                            }
                        }
                    }
                    break;
                case L.jqplot.LineRenderer:
                    aJ = al.x;
                    aI = al.y;
                    aP = aO.renderer;
                    if (aO.show) {
                        if ((aO.fill || (aO.renderer.bands.show && aO.renderer.bands.fill)) && (!am.plugins.highlighter || !am.plugins.highlighter.show)) {
                            var ax = false;
                            if (aJ > aO._boundingBox[0][0] && aJ < aO._boundingBox[1][0] && aI > aO._boundingBox[1][1] && aI < aO._boundingBox[0][1]) {
                                var aD = aO._areaPoints.length;
                                var aG;
                                var aU = aD - 1;
                                for (var aG = 0; aG < aD; aG++) {
                                    var aC = [aO._areaPoints[aG][0], aO._areaPoints[aG][1]];
                                    var aB = [aO._areaPoints[aU][0], aO._areaPoints[aU][1]];
                                    if (aC[1] < aI && aB[1] >= aI || aB[1] < aI && aC[1] >= aI) {
                                        if (aC[0] + (aI - aC[1]) / (aB[1] - aC[1]) * (aB[0] - aC[0]) < aJ) {
                                            ax = !ax
                                        }
                                    }
                                    aU = aG
                                }
                            }
                            if (ax) {
                                return {
                                    seriesIndex: aW,
                                    pointIndex: null,
                                    gridData: aO.gridData,
                                    data: aO.data,
                                    points: aO._areaPoints
                                }
                            }
                            break
                        } else {
                            aN = aO.markerRenderer.size / 2 + aO.neighborThreshold;
                            an = (aN > 0) ? aN : 0;
                            for (var aU = 0; aU < aO.gridData.length; aU++) {
                                aQ = aO.gridData[aU];
                                if (aP.constructor == L.jqplot.OHLCRenderer) {
                                    if (aP.candleStick) {
                                        var av = aO._yaxis.series_u2p;
                                        if (aJ >= aQ[0] - aP._bodyWidth / 2 && aJ <= aQ[0] + aP._bodyWidth / 2 && aI >= av(aO.data[aU][2]) && aI <= av(aO.data[aU][3])) {
                                            return {
                                                seriesIndex: aW,
                                                pointIndex: aU,
                                                gridData: aQ,
                                                data: aO.data[aU]
                                            }
                                        }
                                    } else {
                                        if (!aP.hlc) {
                                            var av = aO._yaxis.series_u2p;
                                            if (aJ >= aQ[0] - aP._tickLength && aJ <= aQ[0] + aP._tickLength && aI >= av(aO.data[aU][2]) && aI <= av(aO.data[aU][3])) {
                                                return {
                                                    seriesIndex: aW,
                                                    pointIndex: aU,
                                                    gridData: aQ,
                                                    data: aO.data[aU]
                                                }
                                            }
                                        } else {
                                            var av = aO._yaxis.series_u2p;
                                            if (aJ >= aQ[0] - aP._tickLength && aJ <= aQ[0] + aP._tickLength && aI >= av(aO.data[aU][1]) && aI <= av(aO.data[aU][2])) {
                                                return {
                                                    seriesIndex: aW,
                                                    pointIndex: aU,
                                                    gridData: aQ,
                                                    data: aO.data[aU]
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (aQ[0] != null && aQ[1] != null) {
                                        aX = Math.sqrt((aJ - aQ[0]) * (aJ - aQ[0]) + (aI - aQ[1]) * (aI - aQ[1]));
                                        if (aX <= an && (aX <= aS || aS == null)) {
                                            aS = aX;
                                            return {
                                                seriesIndex: aW,
                                                pointIndex: aU,
                                                gridData: aQ,
                                                data: aO.data[aU]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                default:
                    aJ = al.x;
                    aI = al.y;
                    aP = aO.renderer;
                    if (aO.show) {
                        aN = aO.markerRenderer.size / 2 + aO.neighborThreshold;
                        an = (aN > 0) ? aN : 0;
                        for (var aU = 0; aU < aO.gridData.length; aU++) {
                            aQ = aO.gridData[aU];
                            if (aP.constructor == L.jqplot.OHLCRenderer) {
                                if (aP.candleStick) {
                                    var av = aO._yaxis.series_u2p;
                                    if (aJ >= aQ[0] - aP._bodyWidth / 2 && aJ <= aQ[0] + aP._bodyWidth / 2 && aI >= av(aO.data[aU][2]) && aI <= av(aO.data[aU][3])) {
                                        return {
                                            seriesIndex: aW,
                                            pointIndex: aU,
                                            gridData: aQ,
                                            data: aO.data[aU]
                                        }
                                    }
                                } else {
                                    if (!aP.hlc) {
                                        var av = aO._yaxis.series_u2p;
                                        if (aJ >= aQ[0] - aP._tickLength && aJ <= aQ[0] + aP._tickLength && aI >= av(aO.data[aU][2]) && aI <= av(aO.data[aU][3])) {
                                            return {
                                                seriesIndex: aW,
                                                pointIndex: aU,
                                                gridData: aQ,
                                                data: aO.data[aU]
                                            }
                                        }
                                    } else {
                                        var av = aO._yaxis.series_u2p;
                                        if (aJ >= aQ[0] - aP._tickLength && aJ <= aQ[0] + aP._tickLength && aI >= av(aO.data[aU][1]) && aI <= av(aO.data[aU][2])) {
                                            return {
                                                seriesIndex: aW,
                                                pointIndex: aU,
                                                gridData: aQ,
                                                data: aO.data[aU]
                                            }
                                        }
                                    }
                                }
                            } else {
                                aX = Math.sqrt((aJ - aQ[0]) * (aJ - aQ[0]) + (aI - aQ[1]) * (aI - aQ[1]));
                                if (aX <= an && (aX <= aS || aS == null)) {
                                    aS = aX;
                                    return {
                                        seriesIndex: aW,
                                        pointIndex: aU,
                                        gridData: aQ,
                                        data: aO.data[aU]
                                    }
                                }
                            }
                        }
                    }
                    break
                }
            }
            return null
        }
        this.onClick = function(an) {
            var am = ai(an);
            var ap = an.data.plot;
            var ao = ak(am.gridPos, ap);
            var al = L.Event("jqplotClick");
            al.pageX = an.pageX;
            al.pageY = an.pageY;
            L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap])
        }
        ;
        this.onDblClick = function(an) {
            var am = ai(an);
            var ap = an.data.plot;
            var ao = ak(am.gridPos, ap);
            var al = L.Event("jqplotDblClick");
            al.pageX = an.pageX;
            al.pageY = an.pageY;
            L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap])
        }
        ;
        this.onMouseDown = function(an) {
            var am = ai(an);
            var ap = an.data.plot;
            var ao = ak(am.gridPos, ap);
            var al = L.Event("jqplotMouseDown");
            al.pageX = an.pageX;
            al.pageY = an.pageY;
            L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap])
        }
        ;
        this.onMouseUp = function(an) {
            var am = ai(an);
            var al = L.Event("jqplotMouseUp");
            al.pageX = an.pageX;
            al.pageY = an.pageY;
            L(this).trigger(al, [am.gridPos, am.dataPos, null, an.data.plot])
        }
        ;
        this.onRightClick = function(an) {
            var am = ai(an);
            var ap = an.data.plot;
            var ao = ak(am.gridPos, ap);
            if (ap.captureRightClick) {
                if (an.which == 3) {
                    var al = L.Event("jqplotRightClick");
                    al.pageX = an.pageX;
                    al.pageY = an.pageY;
                    L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap])
                } else {
                    var al = L.Event("jqplotMouseUp");
                    al.pageX = an.pageX;
                    al.pageY = an.pageY;
                    L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap])
                }
            }
        }
        ;
        this.onMouseMove = function(an) {
            var am = ai(an);
            var ap = an.data.plot;
            var ao = ak(am.gridPos, ap);
            var al = L.Event("jqplotMouseMove");
            al.pageX = an.pageX;
            al.pageY = an.pageY;
            L(this).trigger(al, [am.gridPos, am.dataPos, ao, ap])
        }
        ;
        this.onMouseEnter = function(an) {
            var am = ai(an);
            var ao = an.data.plot;
            var al = L.Event("jqplotMouseEnter");
            al.pageX = an.pageX;
            al.pageY = an.pageY;
            al.relatedTarget = an.relatedTarget;
            L(this).trigger(al, [am.gridPos, am.dataPos, null, ao])
        }
        ;
        this.onMouseLeave = function(an) {
            var am = ai(an);
            var ao = an.data.plot;
            var al = L.Event("jqplotMouseLeave");
            al.pageX = an.pageX;
            al.pageY = an.pageY;
            al.relatedTarget = an.relatedTarget;
            L(this).trigger(al, [am.gridPos, am.dataPos, null, ao])
        }
        ;
        this.drawSeries = function(an, al) {
            var ap, ao, am;
            al = (typeof (an) === "number" && al == null) ? an : al;
            an = (typeof (an) === "object") ? an : {};
            if (al != u) {
                ao = this.series[al];
                am = ao.shadowCanvas._ctx;
                am.clearRect(0, 0, am.canvas.width, am.canvas.height);
                ao.drawShadow(am, an, this);
                am = ao.canvas._ctx;
                am.clearRect(0, 0, am.canvas.width, am.canvas.height);
                ao.draw(am, an, this);
                if (ao.renderer.constructor == L.jqplot.BezierCurveRenderer) {
                    if (al < this.series.length - 1) {
                        this.drawSeries(al + 1)
                    }
                }
            } else {
                for (ap = 0; ap < this.series.length; ap++) {
                    ao = this.series[ap];
                    am = ao.shadowCanvas._ctx;
                    am.clearRect(0, 0, am.canvas.width, am.canvas.height);
                    ao.drawShadow(am, an, this);
                    am = ao.canvas._ctx;
                    am.clearRect(0, 0, am.canvas.width, am.canvas.height);
                    ao.draw(am, an, this)
                }
            }
            an = al = ap = ao = am = null
        }
        ;
        this.moveSeriesToFront = function(am) {
            am = parseInt(am, 10);
            var ap = L.inArray(am, this.seriesStack);
            if (ap == -1) {
                return
            }
            if (ap == this.seriesStack.length - 1) {
                this.previousSeriesStack = this.seriesStack.slice(0);
                return
            }
            var al = this.seriesStack[this.seriesStack.length - 1];
            var ao = this.series[am].canvas._elem.detach();
            var an = this.series[am].shadowCanvas._elem.detach();
            this.series[al].shadowCanvas._elem.after(an);
            this.series[al].canvas._elem.after(ao);
            this.previousSeriesStack = this.seriesStack.slice(0);
            this.seriesStack.splice(ap, 1);
            this.seriesStack.push(am)
        }
        ;
        this.moveSeriesToBack = function(am) {
            am = parseInt(am, 10);
            var ap = L.inArray(am, this.seriesStack);
            if (ap == 0 || ap == -1) {
                return
            }
            var al = this.seriesStack[0];
            var ao = this.series[am].canvas._elem.detach();
            var an = this.series[am].shadowCanvas._elem.detach();
            this.series[al].shadowCanvas._elem.before(an);
            this.series[al].canvas._elem.before(ao);
            this.previousSeriesStack = this.seriesStack.slice(0);
            this.seriesStack.splice(ap, 1);
            this.seriesStack.unshift(am)
        }
        ;
        this.restorePreviousSeriesOrder = function() {
            var ar, aq, ap, ao, an, al, am;
            if (this.seriesStack == this.previousSeriesStack) {
                return
            }
            for (ar = 1; ar < this.previousSeriesStack.length; ar++) {
                al = this.previousSeriesStack[ar];
                am = this.previousSeriesStack[ar - 1];
                ap = this.series[al].canvas._elem.detach();
                ao = this.series[al].shadowCanvas._elem.detach();
                this.series[am].shadowCanvas._elem.after(ao);
                this.series[am].canvas._elem.after(ap)
            }
            an = this.seriesStack.slice(0);
            this.seriesStack = this.previousSeriesStack.slice(0);
            this.previousSeriesStack = an
        }
        ;
        this.restoreOriginalSeriesOrder = function() {
            var ap, ao, al = [], an, am;
            for (ap = 0; ap < this.series.length; ap++) {
                al.push(ap)
            }
            if (this.seriesStack == al) {
                return
            }
            this.previousSeriesStack = this.seriesStack.slice(0);
            this.seriesStack = al;
            for (ap = 1; ap < this.seriesStack.length; ap++) {
                an = this.series[ap].canvas._elem.detach();
                am = this.series[ap].shadowCanvas._elem.detach();
                this.series[ap - 1].shadowCanvas._elem.after(am);
                this.series[ap - 1].canvas._elem.after(an)
            }
        }
        ;
        this.activateTheme = function(al) {
            this.themeEngine.activate(this, al)
        }
    }
    L.jqplot.computeHighlightColors = function(ai) {
        var ak;
        if (L.isArray(ai)) {
            ak = [];
            for (var am = 0; am < ai.length; am++) {
                var al = L.jqplot.getColorComponents(ai[am]);
                var ah = [al[0], al[1], al[2]];
                var an = ah[0] + ah[1] + ah[2];
                for (var aj = 0; aj < 3; aj++) {
                    ah[aj] = (an > 660) ? ah[aj] * 0.85 : 0.73 * ah[aj] + 90;
                    ah[aj] = parseInt(ah[aj], 10);
                    (ah[aj] > 255) ? 255 : ah[aj]
                }
                ah[3] = 0.3 + 0.35 * al[3];
                ak.push("rgba(" + ah[0] + "," + ah[1] + "," + ah[2] + "," + ah[3] + ")")
            }
        } else {
            var al = L.jqplot.getColorComponents(ai);
            var ah = [al[0], al[1], al[2]];
            var an = ah[0] + ah[1] + ah[2];
            for (var aj = 0; aj < 3; aj++) {
                ah[aj] = (an > 660) ? ah[aj] * 0.85 : 0.73 * ah[aj] + 90;
                ah[aj] = parseInt(ah[aj], 10);
                (ah[aj] > 255) ? 255 : ah[aj]
            }
            ah[3] = 0.3 + 0.35 * al[3];
            ak = "rgba(" + ah[0] + "," + ah[1] + "," + ah[2] + "," + ah[3] + ")"
        }
        return ak
    }
    ;
    L.jqplot.ColorGenerator = function(ai) {
        ai = ai || L.jqplot.config.defaultColors;
        var ah = 0;
        this.next = function() {
            if (ah < ai.length) {
                return ai[ah++]
            } else {
                ah = 0;
                return ai[ah++]
            }
        }
        ;
        this.previous = function() {
            if (ah > 0) {
                return ai[ah--]
            } else {
                ah = ai.length - 1;
                return ai[ah]
            }
        }
        ;
        this.get = function(ak) {
            var aj = ak - ai.length * Math.floor(ak / ai.length);
            return ai[aj]
        }
        ;
        this.setColors = function(aj) {
            ai = aj
        }
        ;
        this.reset = function() {
            ah = 0
        }
        ;
        this.getIndex = function() {
            return ah
        }
        ;
        this.setIndex = function(aj) {
            ah = aj
        }
    }
    ;
    L.jqplot.hex2rgb = function(aj, ah) {
        aj = aj.replace("#", "");
        if (aj.length == 3) {
            aj = aj.charAt(0) + aj.charAt(0) + aj.charAt(1) + aj.charAt(1) + aj.charAt(2) + aj.charAt(2)
        }
        var ai;
        ai = "rgba(" + parseInt(aj.slice(0, 2), 16) + ", " + parseInt(aj.slice(2, 4), 16) + ", " + parseInt(aj.slice(4, 6), 16);
        if (ah) {
            ai += ", " + ah
        }
        ai += ")";
        return ai
    }
    ;
    L.jqplot.rgb2hex = function(am) {
        var aj = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *(?:, *[0-9.]*)?\)/;
        var ah = am.match(aj);
        var al = "#";
        for (var ak = 1; ak < 4; ak++) {
            var ai;
            if (ah[ak].search(/%/) != -1) {
                ai = parseInt(255 * ah[ak] / 100, 10).toString(16);
                if (ai.length == 1) {
                    ai = "0" + ai
                }
            } else {
                ai = parseInt(ah[ak], 10).toString(16);
                if (ai.length == 1) {
                    ai = "0" + ai
                }
            }
            al += ai
        }
        return al
    }
    ;
    L.jqplot.normalize2rgb = function(ai, ah) {
        if (ai.search(/^ *rgba?\(/) != -1) {
            return ai
        } else {
            if (ai.search(/^ *#?[0-9a-fA-F]?[0-9a-fA-F]/) != -1) {
                return L.jqplot.hex2rgb(ai, ah)
            } else {
                throw new Error("Invalid color spec")
            }
        }
    }
    ;
    L.jqplot.getColorComponents = function(am) {
        am = L.jqplot.colorKeywordMap[am] || am;
        var ak = L.jqplot.normalize2rgb(am);
        var aj = /rgba?\( *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *, *([0-9]{1,3}\.?[0-9]*%?) *,? *([0-9.]* *)?\)/;
        var ah = ak.match(aj);
        var ai = [];
        for (var al = 1; al < 4; al++) {
            if (ah[al].search(/%/) != -1) {
                ai[al - 1] = parseInt(255 * ah[al] / 100, 10)
            } else {
                ai[al - 1] = parseInt(ah[al], 10)
            }
        }
        ai[3] = parseFloat(ah[4]) ? parseFloat(ah[4]) : 1;
        return ai
    }
    ;
    L.jqplot.colorKeywordMap = {
        aliceblue: "rgb(240, 248, 255)",
        antiquewhite: "rgb(250, 235, 215)",
        aqua: "rgb( 0, 255, 255)",
        aquamarine: "rgb(127, 255, 212)",
        azure: "rgb(240, 255, 255)",
        beige: "rgb(245, 245, 220)",
        bisque: "rgb(255, 228, 196)",
        black: "rgb( 0, 0, 0)",
        blanchedalmond: "rgb(255, 235, 205)",
        blue: "rgb( 0, 0, 255)",
        blueviolet: "rgb(138, 43, 226)",
        brown: "rgb(165, 42, 42)",
        burlywood: "rgb(222, 184, 135)",
        cadetblue: "rgb( 95, 158, 160)",
        chartreuse: "rgb(127, 255, 0)",
        chocolate: "rgb(210, 105, 30)",
        coral: "rgb(255, 127, 80)",
        cornflowerblue: "rgb(100, 149, 237)",
        cornsilk: "rgb(255, 248, 220)",
        crimson: "rgb(220, 20, 60)",
        cyan: "rgb( 0, 255, 255)",
        darkblue: "rgb( 0, 0, 139)",
        darkcyan: "rgb( 0, 139, 139)",
        darkgoldenrod: "rgb(184, 134, 11)",
        darkgray: "rgb(169, 169, 169)",
        darkgreen: "rgb( 0, 100, 0)",
        darkgrey: "rgb(169, 169, 169)",
        darkkhaki: "rgb(189, 183, 107)",
        darkmagenta: "rgb(139, 0, 139)",
        darkolivegreen: "rgb( 85, 107, 47)",
        darkorange: "rgb(255, 140, 0)",
        darkorchid: "rgb(153, 50, 204)",
        darkred: "rgb(139, 0, 0)",
        darksalmon: "rgb(233, 150, 122)",
        darkseagreen: "rgb(143, 188, 143)",
        darkslateblue: "rgb( 72, 61, 139)",
        darkslategray: "rgb( 47, 79, 79)",
        darkslategrey: "rgb( 47, 79, 79)",
        darkturquoise: "rgb( 0, 206, 209)",
        darkviolet: "rgb(148, 0, 211)",
        deeppink: "rgb(255, 20, 147)",
        deepskyblue: "rgb( 0, 191, 255)",
        dimgray: "rgb(105, 105, 105)",
        dimgrey: "rgb(105, 105, 105)",
        dodgerblue: "rgb( 30, 144, 255)",
        firebrick: "rgb(178, 34, 34)",
        floralwhite: "rgb(255, 250, 240)",
        forestgreen: "rgb( 34, 139, 34)",
        fuchsia: "rgb(255, 0, 255)",
        gainsboro: "rgb(220, 220, 220)",
        ghostwhite: "rgb(248, 248, 255)",
        gold: "rgb(255, 215, 0)",
        goldenrod: "rgb(218, 165, 32)",
        gray: "rgb(128, 128, 128)",
        grey: "rgb(128, 128, 128)",
        green: "rgb( 0, 128, 0)",
        greenyellow: "rgb(173, 255, 47)",
        honeydew: "rgb(240, 255, 240)",
        hotpink: "rgb(255, 105, 180)",
        indianred: "rgb(205, 92, 92)",
        indigo: "rgb( 75, 0, 130)",
        ivory: "rgb(255, 255, 240)",
        khaki: "rgb(240, 230, 140)",
        lavender: "rgb(230, 230, 250)",
        lavenderblush: "rgb(255, 240, 245)",
        lawngreen: "rgb(124, 252, 0)",
        lemonchiffon: "rgb(255, 250, 205)",
        lightblue: "rgb(173, 216, 230)",
        lightcoral: "rgb(240, 128, 128)",
        lightcyan: "rgb(224, 255, 255)",
        lightgoldenrodyellow: "rgb(250, 250, 210)",
        lightgray: "rgb(211, 211, 211)",
        lightgreen: "rgb(144, 238, 144)",
        lightgrey: "rgb(211, 211, 211)",
        lightpink: "rgb(255, 182, 193)",
        lightsalmon: "rgb(255, 160, 122)",
        lightseagreen: "rgb( 32, 178, 170)",
        lightskyblue: "rgb(135, 206, 250)",
        lightslategray: "rgb(119, 136, 153)",
        lightslategrey: "rgb(119, 136, 153)",
        lightsteelblue: "rgb(176, 196, 222)",
        lightyellow: "rgb(255, 255, 224)",
        lime: "rgb( 0, 255, 0)",
        limegreen: "rgb( 50, 205, 50)",
        linen: "rgb(250, 240, 230)",
        magenta: "rgb(255, 0, 255)",
        maroon: "rgb(128, 0, 0)",
        mediumaquamarine: "rgb(102, 205, 170)",
        mediumblue: "rgb( 0, 0, 205)",
        mediumorchid: "rgb(186, 85, 211)",
        mediumpurple: "rgb(147, 112, 219)",
        mediumseagreen: "rgb( 60, 179, 113)",
        mediumslateblue: "rgb(123, 104, 238)",
        mediumspringgreen: "rgb( 0, 250, 154)",
        mediumturquoise: "rgb( 72, 209, 204)",
        mediumvioletred: "rgb(199, 21, 133)",
        midnightblue: "rgb( 25, 25, 112)",
        mintcream: "rgb(245, 255, 250)",
        mistyrose: "rgb(255, 228, 225)",
        moccasin: "rgb(255, 228, 181)",
        navajowhite: "rgb(255, 222, 173)",
        navy: "rgb( 0, 0, 128)",
        oldlace: "rgb(253, 245, 230)",
        olive: "rgb(128, 128, 0)",
        olivedrab: "rgb(107, 142, 35)",
        orange: "rgb(255, 165, 0)",
        orangered: "rgb(255, 69, 0)",
        orchid: "rgb(218, 112, 214)",
        palegoldenrod: "rgb(238, 232, 170)",
        palegreen: "rgb(152, 251, 152)",
        paleturquoise: "rgb(175, 238, 238)",
        palevioletred: "rgb(219, 112, 147)",
        papayawhip: "rgb(255, 239, 213)",
        peachpuff: "rgb(255, 218, 185)",
        peru: "rgb(205, 133, 63)",
        pink: "rgb(255, 192, 203)",
        plum: "rgb(221, 160, 221)",
        powderblue: "rgb(176, 224, 230)",
        purple: "rgb(128, 0, 128)",
        red: "rgb(255, 0, 0)",
        rosybrown: "rgb(188, 143, 143)",
        royalblue: "rgb( 65, 105, 225)",
        saddlebrown: "rgb(139, 69, 19)",
        salmon: "rgb(250, 128, 114)",
        sandybrown: "rgb(244, 164, 96)",
        seagreen: "rgb( 46, 139, 87)",
        seashell: "rgb(255, 245, 238)",
        sienna: "rgb(160, 82, 45)",
        silver: "rgb(192, 192, 192)",
        skyblue: "rgb(135, 206, 235)",
        slateblue: "rgb(106, 90, 205)",
        slategray: "rgb(112, 128, 144)",
        slategrey: "rgb(112, 128, 144)",
        snow: "rgb(255, 250, 250)",
        springgreen: "rgb( 0, 255, 127)",
        steelblue: "rgb( 70, 130, 180)",
        tan: "rgb(210, 180, 140)",
        teal: "rgb( 0, 128, 128)",
        thistle: "rgb(216, 191, 216)",
        tomato: "rgb(255, 99, 71)",
        turquoise: "rgb( 64, 224, 208)",
        violet: "rgb(238, 130, 238)",
        wheat: "rgb(245, 222, 179)",
        white: "rgb(255, 255, 255)",
        whitesmoke: "rgb(245, 245, 245)",
        yellow: "rgb(255, 255, 0)",
        yellowgreen: "rgb(154, 205, 50)"
    };
    L.jqplot.AxisLabelRenderer = function(ah) {
        L.jqplot.ElemContainer.call(this);
        this.axis;
        this.show = true;
        this.label = "";
        this.fontFamily = null;
        this.fontSize = null;
        this.textColor = null;
        this._elem;
        this.escapeHTML = false;
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.AxisLabelRenderer.prototype = new L.jqplot.ElemContainer();
    L.jqplot.AxisLabelRenderer.prototype.constructor = L.jqplot.AxisLabelRenderer;
    L.jqplot.AxisLabelRenderer.prototype.init = function(ah) {
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.AxisLabelRenderer.prototype.draw = function(ah, ai) {
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null
        }
        this._elem = L('<div style="position:absolute;" class="jqplot-' + this.axis + '-label"></div>');
        if (Number(this.label)) {
            this._elem.css("white-space", "nowrap")
        }
        if (!this.escapeHTML) {
            this._elem.html(this.label)
        } else {
            this._elem.text(this.label)
        }
        if (this.fontFamily) {
            this._elem.css("font-family", this.fontFamily)
        }
        if (this.fontSize) {
            this._elem.css("font-size", this.fontSize)
        }
        if (this.textColor) {
            this._elem.css("color", this.textColor)
        }
        return this._elem
    }
    ;
    L.jqplot.AxisLabelRenderer.prototype.pack = function() {}
    ;
    L.jqplot.AxisTickRenderer = function(ah) {
        L.jqplot.ElemContainer.call(this);
        this.mark = "outside";
        this.axis;
        this.showMark = true;
        this.showGridline = true;
        this.isMinorTick = false;
        this.size = 4;
        this.markSize = 6;
        this.show = true;
        this.showLabel = true;
        this.label = null;
        this.value = null;
        this._styles = {};
        this.formatter = L.jqplot.DefaultTickFormatter;
        this.prefix = "";
        this.suffix = "";
        this.formatString = "";
        this.fontFamily;
        this.fontSize;
        this.textColor;
        this.escapeHTML = false;
        this._elem;
        this._breakTick = false;
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.AxisTickRenderer.prototype.init = function(ah) {
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.AxisTickRenderer.prototype = new L.jqplot.ElemContainer();
    L.jqplot.AxisTickRenderer.prototype.constructor = L.jqplot.AxisTickRenderer;
    L.jqplot.AxisTickRenderer.prototype.setTick = function(ah, aj, ai) {
        this.value = ah;
        this.axis = aj;
        if (ai) {
            this.isMinorTick = true
        }
        return this
    }
    ;
    L.jqplot.AxisTickRenderer.prototype.draw = function() {
        if (this.label === null) {
            this.label = this.prefix + this.formatter(this.formatString, this.value) + this.suffix
        }
        var ai = {
            position: "absolute"
        };
        if (Number(this.label)) {
            ai.whitSpace = "nowrap"
        }
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null
        }
        this._elem = L(document.createElement("div"));
        this._elem.addClass("jqplot-" + this.axis + "-tick");
        if (!this.escapeHTML) {
            this._elem.html(this.label)
        } else {
            this._elem.text(this.label)
        }
        this._elem.css(ai);
        for (var ah in this._styles) {
            this._elem.css(ah, this._styles[ah])
        }
        if (this.fontFamily) {
            this._elem.css("font-family", this.fontFamily)
        }
        if (this.fontSize) {
            this._elem.css("font-size", this.fontSize)
        }
        if (this.textColor) {
            this._elem.css("color", this.textColor)
        }
        if (this._breakTick) {
            this._elem.addClass("jqplot-breakTick")
        }
        return this._elem
    }
    ;
    L.jqplot.DefaultTickFormatter = function(ah, ai) {
        if (typeof ai == "number") {
            if (!ah) {
                ah = L.jqplot.config.defaultTickFormatString
            }
            return L.jqplot.sprintf(ah, ai)
        } else {
            return String(ai)
        }
    }
    ;
    L.jqplot.PercentTickFormatter = function(ah, ai) {
        if (typeof ai == "number") {
            ai = 100 * ai;
            if (!ah) {
                ah = L.jqplot.config.defaultTickFormatString
            }
            return L.jqplot.sprintf(ah, ai)
        } else {
            return String(ai)
        }
    }
    ;
    L.jqplot.AxisTickRenderer.prototype.pack = function() {}
    ;
    L.jqplot.CanvasGridRenderer = function() {
        this.shadowRenderer = new L.jqplot.ShadowRenderer()
    }
    ;
    L.jqplot.CanvasGridRenderer.prototype.init = function(ai) {
        this._ctx;
        L.extend(true, this, ai);
        var ah = {
            lineJoin: "miter",
            lineCap: "round",
            fill: false,
            isarc: false,
            angle: this.shadowAngle,
            offset: this.shadowOffset,
            alpha: this.shadowAlpha,
            depth: this.shadowDepth,
            lineWidth: this.shadowWidth,
            closePath: false,
            strokeStyle: this.shadowColor
        };
        this.renderer.shadowRenderer.init(ah)
    }
    ;
    L.jqplot.CanvasGridRenderer.prototype.createElement = function(ak) {
        var aj;
        if (this._elem) {
            if (L.jqplot.use_excanvas && window.G_vmlCanvasManager.uninitElement !== u) {
                aj = this._elem.get(0);
                window.G_vmlCanvasManager.uninitElement(aj);
                aj = null
            }
            this._elem.emptyForce();
            this._elem = null
        }
        aj = ak.canvasManager.getCanvas();
        var ah = this._plotDimensions.width;
        var ai = this._plotDimensions.height;
        aj.width = ah;
        aj.height = ai;
        this._elem = L(aj);
        this._elem.addClass("jqplot-grid-canvas");
        this._elem.css({
            position: "absolute",
            left: 0,
            top: 0
        });
        aj = ak.canvasManager.initCanvas(aj);
        this._top = this._offsets.top;
        this._bottom = ai - this._offsets.bottom;
        this._left = this._offsets.left;
        this._right = ah - this._offsets.right;
        this._width = this._right - this._left;
        this._height = this._bottom - this._top;
        aj = null;
        return this._elem
    }
    ;
    L.jqplot.CanvasGridRenderer.prototype.draw = function() {
        this._ctx = this._elem.get(0).getContext("2d");
        var at = this._ctx;
        var aw = this._axes;
        at.save();
        at.clearRect(0, 0, this._plotDimensions.width, this._plotDimensions.height);
        at.fillStyle = this.backgroundColor || this.background;
        at.fillRect(this._left, this._top, this._width, this._height);
        at.save();
        at.lineJoin = "miter";
        at.lineCap = "butt";
        at.lineWidth = this.gridLineWidth;
        at.strokeStyle = this.gridLineColor;
        var aA, az, ap, aq;
        var am = ["xaxis", "yaxis", "x2axis", "y2axis"];
        for (var ay = 4; ay > 0; ay--) {
            var aD = am[ay - 1];
            var ah = aw[aD];
            var aB = ah._ticks;
            var ar = aB.length;
            if (ah.show) {
                if (ah.drawBaseline) {
                    var aC = {};
                    if (ah.baselineWidth !== null) {
                        aC.lineWidth = ah.baselineWidth
                    }
                    if (ah.baselineColor !== null) {
                        aC.strokeStyle = ah.baselineColor
                    }
                    switch (aD) {
                    case "xaxis":
                        ao(this._left, this._bottom, this._right, this._bottom, aC);
                        break;
                    case "yaxis":
                        ao(this._left, this._bottom, this._left, this._top, aC);
                        break;
                    case "x2axis":
                        ao(this._left, this._bottom, this._right, this._bottom, aC);
                        break;
                    case "y2axis":
                        ao(this._right, this._bottom, this._right, this._top, aC);
                        break
                    }
                }
                for (var au = ar; au > 0; au--) {
                    var an = aB[au - 1];
                    if (an.show) {
                        var ak = Math.round(ah.u2p(an.value)) + 0.5;
                        switch (aD) {
                        case "xaxis":
                            if (an.showGridline && this.drawGridlines && ((!an.isMinorTick && ah.drawMajorGridlines) || (an.isMinorTick && ah.drawMinorGridlines))) {
                                ao(ak, this._top, ak, this._bottom)
                            }
                            if (an.showMark && an.mark && ((!an.isMinorTick && ah.drawMajorTickMarks) || (an.isMinorTick && ah.drawMinorTickMarks))) {
                                ap = an.markSize;
                                aq = an.mark;
                                var ak = Math.round(ah.u2p(an.value)) + 0.5;
                                switch (aq) {
                                case "outside":
                                    aA = this._bottom;
                                    az = this._bottom + ap;
                                    break;
                                case "inside":
                                    aA = this._bottom - ap;
                                    az = this._bottom;
                                    break;
                                case "cross":
                                    aA = this._bottom - ap;
                                    az = this._bottom + ap;
                                    break;
                                default:
                                    aA = this._bottom;
                                    az = this._bottom + ap;
                                    break
                                }
                                if (this.shadow) {
                                    this.renderer.shadowRenderer.draw(at, [[ak, aA], [ak, az]], {
                                        lineCap: "butt",
                                        lineWidth: this.gridLineWidth,
                                        offset: this.gridLineWidth * 0.75,
                                        depth: 2,
                                        fill: false,
                                        closePath: false
                                    })
                                }
                                ao(ak, aA, ak, az)
                            }
                            break;
                        case "yaxis":
                            if (an.showGridline && this.drawGridlines && ((!an.isMinorTick && ah.drawMajorGridlines) || (an.isMinorTick && ah.drawMinorGridlines))) {
                                ao(this._right, ak, this._left, ak)
                            }
                            if (an.showMark && an.mark && ((!an.isMinorTick && ah.drawMajorTickMarks) || (an.isMinorTick && ah.drawMinorTickMarks))) {
                                ap = an.markSize;
                                aq = an.mark;
                                var ak = Math.round(ah.u2p(an.value)) + 0.5;
                                switch (aq) {
                                case "outside":
                                    aA = this._left - ap;
                                    az = this._left;
                                    break;
                                case "inside":
                                    aA = this._left;
                                    az = this._left + ap;
                                    break;
                                case "cross":
                                    aA = this._left - ap;
                                    az = this._left + ap;
                                    break;
                                default:
                                    aA = this._left - ap;
                                    az = this._left;
                                    break
                                }
                                if (this.shadow) {
                                    this.renderer.shadowRenderer.draw(at, [[aA, ak], [az, ak]], {
                                        lineCap: "butt",
                                        lineWidth: this.gridLineWidth * 1.5,
                                        offset: this.gridLineWidth * 0.75,
                                        fill: false,
                                        closePath: false
                                    })
                                }
                                ao(aA, ak, az, ak, {
                                    strokeStyle: ah.borderColor
                                })
                            }
                            break;
                        case "x2axis":
                            if (an.showGridline && this.drawGridlines && ((!an.isMinorTick && ah.drawMajorGridlines) || (an.isMinorTick && ah.drawMinorGridlines))) {
                                ao(ak, this._bottom, ak, this._top)
                            }
                            if (an.showMark && an.mark && ((!an.isMinorTick && ah.drawMajorTickMarks) || (an.isMinorTick && ah.drawMinorTickMarks))) {
                                ap = an.markSize;
                                aq = an.mark;
                                var ak = Math.round(ah.u2p(an.value)) + 0.5;
                                switch (aq) {
                                case "outside":
                                    aA = this._top - ap;
                                    az = this._top;
                                    break;
                                case "inside":
                                    aA = this._top;
                                    az = this._top + ap;
                                    break;
                                case "cross":
                                    aA = this._top - ap;
                                    az = this._top + ap;
                                    break;
                                default:
                                    aA = this._top - ap;
                                    az = this._top;
                                    break
                                }
                                if (this.shadow) {
                                    this.renderer.shadowRenderer.draw(at, [[ak, aA], [ak, az]], {
                                        lineCap: "butt",
                                        lineWidth: this.gridLineWidth,
                                        offset: this.gridLineWidth * 0.75,
                                        depth: 2,
                                        fill: false,
                                        closePath: false
                                    })
                                }
                                ao(ak, aA, ak, az)
                            }
                            break;
                        case "y2axis":
                            if (an.showGridline && this.drawGridlines && ((!an.isMinorTick && ah.drawMajorGridlines) || (an.isMinorTick && ah.drawMinorGridlines))) {
                                ao(this._left, ak, this._right, ak)
                            }
                            if (an.showMark && an.mark && ((!an.isMinorTick && ah.drawMajorTickMarks) || (an.isMinorTick && ah.drawMinorTickMarks))) {
                                ap = an.markSize;
                                aq = an.mark;
                                var ak = Math.round(ah.u2p(an.value)) + 0.5;
                                switch (aq) {
                                case "outside":
                                    aA = this._right;
                                    az = this._right + ap;
                                    break;
                                case "inside":
                                    aA = this._right - ap;
                                    az = this._right;
                                    break;
                                case "cross":
                                    aA = this._right - ap;
                                    az = this._right + ap;
                                    break;
                                default:
                                    aA = this._right;
                                    az = this._right + ap;
                                    break
                                }
                                if (this.shadow) {
                                    this.renderer.shadowRenderer.draw(at, [[aA, ak], [az, ak]], {
                                        lineCap: "butt",
                                        lineWidth: this.gridLineWidth * 1.5,
                                        offset: this.gridLineWidth * 0.75,
                                        fill: false,
                                        closePath: false
                                    })
                                }
                                ao(aA, ak, az, ak, {
                                    strokeStyle: ah.borderColor
                                })
                            }
                            break;
                        default:
                            break
                        }
                    }
                }
                an = null
            }
            ah = null;
            aB = null
        }
        am = ["y3axis", "y4axis", "y5axis", "y6axis", "y7axis", "y8axis", "y9axis", "yMidAxis"];
        for (var ay = 7; ay > 0; ay--) {
            var ah = aw[am[ay - 1]];
            var aB = ah._ticks;
            if (ah.show) {
                var ai = aB[ah.numberTicks - 1];
                var al = aB[0];
                var aj = ah.getLeft();
                var av = [[aj, ai.getTop() + ai.getHeight() / 2], [aj, al.getTop() + al.getHeight() / 2 + 1]];
                if (this.shadow) {
                    this.renderer.shadowRenderer.draw(at, av, {
                        lineCap: "butt",
                        fill: false,
                        closePath: false
                    })
                }
                ao(av[0][0], av[0][1], av[1][0], av[1][1], {
                    lineCap: "butt",
                    strokeStyle: ah.borderColor,
                    lineWidth: ah.borderWidth
                });
                for (var au = aB.length; au > 0; au--) {
                    var an = aB[au - 1];
                    ap = an.markSize;
                    aq = an.mark;
                    var ak = Math.round(ah.u2p(an.value)) + 0.5;
                    if (an.showMark && an.mark) {
                        switch (aq) {
                        case "outside":
                            aA = aj;
                            az = aj + ap;
                            break;
                        case "inside":
                            aA = aj - ap;
                            az = aj;
                            break;
                        case "cross":
                            aA = aj - ap;
                            az = aj + ap;
                            break;
                        default:
                            aA = aj;
                            az = aj + ap;
                            break
                        }
                        av = [[aA, ak], [az, ak]];
                        if (this.shadow) {
                            this.renderer.shadowRenderer.draw(at, av, {
                                lineCap: "butt",
                                lineWidth: this.gridLineWidth * 1.5,
                                offset: this.gridLineWidth * 0.75,
                                fill: false,
                                closePath: false
                            })
                        }
                        ao(aA, ak, az, ak, {
                            strokeStyle: ah.borderColor
                        })
                    }
                    an = null
                }
                al = null
            }
            ah = null;
            aB = null
        }
        at.restore();
        function ao(aH, aG, aE, ax, aF) {
            at.save();
            aF = aF || {};
            if (aF.lineWidth == null || aF.lineWidth != 0) {
                L.extend(true, at, aF);
                at.beginPath();
                at.moveTo(aH, aG);
                at.lineTo(aE, ax);
                at.stroke();
                at.restore()
            }
        }
        if (this.shadow) {
            var av = [[this._left, this._bottom], [this._right, this._bottom], [this._right, this._top]];
            this.renderer.shadowRenderer.draw(at, av)
        }
        if (this.borderWidth != 0 && this.drawBorder) {
            ao(this._left, this._top, this._right, this._top, {
                lineCap: "round",
                strokeStyle: aw.x2axis.borderColor,
                lineWidth: aw.x2axis.borderWidth
            });
            ao(this._right, this._top, this._right, this._bottom, {
                lineCap: "round",
                strokeStyle: aw.y2axis.borderColor,
                lineWidth: aw.y2axis.borderWidth
            });
            ao(this._right, this._bottom, this._left, this._bottom, {
                lineCap: "round",
                strokeStyle: aw.xaxis.borderColor,
                lineWidth: aw.xaxis.borderWidth
            });
            ao(this._left, this._bottom, this._left, this._top, {
                lineCap: "round",
                strokeStyle: aw.yaxis.borderColor,
                lineWidth: aw.yaxis.borderWidth
            })
        }
        at.restore();
        at = null;
        aw = null
    }
    ;
    L.jqplot.DivTitleRenderer = function() {}
    ;
    L.jqplot.DivTitleRenderer.prototype.init = function(ah) {
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.DivTitleRenderer.prototype.draw = function() {
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null
        }
        var ak = this.renderer;
        var aj = document.createElement("div");
        this._elem = L(aj);
        this._elem.addClass("jqplot-title");
        if (!this.text) {
            this.show = false;
            this._elem.height(0);
            this._elem.width(0)
        } else {
            if (this.text) {
                var ah;
                if (this.color) {
                    ah = this.color
                } else {
                    if (this.textColor) {
                        ah = this.textColor
                    }
                }
                var ai = {
                    position: "absolute",
                    top: "0px",
                    left: "0px"
                };
                if (this._plotWidth) {
                    ai.width = this._plotWidth + "px"
                }
                if (this.fontSize) {
                    ai.fontSize = this.fontSize
                }
                if (typeof this.textAlign === "string") {
                    ai.textAlign = this.textAlign
                } else {
                    ai.textAlign = "center"
                }
                if (ah) {
                    ai.color = ah
                }
                if (this.paddingBottom) {
                    ai.paddingBottom = this.paddingBottom
                }
                if (this.fontFamily) {
                    ai.fontFamily = this.fontFamily
                }
                this._elem.css(ai);
                if (this.escapeHtml) {
                    this._elem.text(this.text)
                } else {
                    this._elem.html(this.text)
                }
            }
        }
        aj = null;
        return this._elem
    }
    ;
    L.jqplot.DivTitleRenderer.prototype.pack = function() {}
    ;
    var r = 0.1;
    L.jqplot.LinePattern = function(aw, aq) {
        var ap = {
            dotted: [r, L.jqplot.config.dotGapLength],
            dashed: [L.jqplot.config.dashLength, L.jqplot.config.gapLength],
            solid: null
        };
        if (typeof aq === "string") {
            if (aq[0] === "." || aq[0] === "-") {
                var ax = aq;
                aq = [];
                for (var ao = 0, al = ax.length; ao < al; ao++) {
                    if (ax[ao] === ".") {
                        aq.push(r)
                    } else {
                        if (ax[ao] === "-") {
                            aq.push(L.jqplot.config.dashLength)
                        } else {
                            continue
                        }
                    }
                    aq.push(L.jqplot.config.gapLength)
                }
            } else {
                aq = ap[aq]
            }
        }
        if (!(aq && aq.length)) {
            return aw
        }
        var ak = 0;
        var ar = aq[0];
        var au = 0;
        var at = 0;
        var an = 0;
        var ah = 0;
        var av = function(ay, az) {
            aw.moveTo(ay, az);
            au = ay;
            at = az;
            an = ay;
            ah = az
        };
        var aj = function(ay, aE) {
            var aC = aw.lineWidth;
            var aA = ay - au;
            var az = aE - at;
            var aB = Math.sqrt(aA * aA + az * az);
            if ((aB > 0) && (aC > 0)) {
                aA /= aB;
                az /= aB;
                while (true) {
                    var aD = aC * ar;
                    if (aD < aB) {
                        au += aD * aA;
                        at += aD * az;
                        if ((ak & 1) == 0) {
                            aw.lineTo(au, at)
                        } else {
                            aw.moveTo(au, at)
                        }
                        aB -= aD;
                        ak++;
                        if (ak >= aq.length) {
                            ak = 0
                        }
                        ar = aq[ak]
                    } else {
                        au = ay;
                        at = aE;
                        if ((ak & 1) == 0) {
                            aw.lineTo(au, at)
                        } else {
                            aw.moveTo(au, at)
                        }
                        ar -= aB / aC;
                        break
                    }
                }
            }
        };
        var ai = function() {
            aw.beginPath()
        };
        var am = function() {
            aj(an, ah)
        };
        return {
            moveTo: av,
            lineTo: aj,
            beginPath: ai,
            closePath: am
        }
    }
    ;
    L.jqplot.LineRenderer = function() {
        this.shapeRenderer = new L.jqplot.ShapeRenderer();
        this.shadowRenderer = new L.jqplot.ShadowRenderer()
    }
    ;
    L.jqplot.LineRenderer.prototype.init = function(ai, an) {
        ai = ai || {};
        this._type = "line";
        this.renderer.animation = {
            show: false,
            direction: "left",
            speed: 2500,
            _supported: true
        };
        this.renderer.smooth = false;
        this.renderer.tension = null;
        this.renderer.constrainSmoothing = true;
        this.renderer._smoothedData = [];
        this.renderer._smoothedPlotData = [];
        this.renderer._hiBandGridData = [];
        this.renderer._lowBandGridData = [];
        this.renderer._hiBandSmoothedData = [];
        this.renderer._lowBandSmoothedData = [];
        this.renderer.bandData = [];
        this.renderer.bands = {
            show: false,
            hiData: [],
            lowData: [],
            color: this.color,
            showLines: false,
            fill: true,
            fillColor: null,
            _min: null,
            _max: null,
            interval: "3%"
        };
        var al = {
            highlightMouseOver: ai.highlightMouseOver,
            highlightMouseDown: ai.highlightMouseDown,
            highlightColor: ai.highlightColor
        };
        delete (ai.highlightMouseOver);
        delete (ai.highlightMouseDown);
        delete (ai.highlightColor);
        L.extend(true, this.renderer, ai);
        this.renderer.options = ai;
        if (this.renderer.bandData.length > 1 && (!ai.bands || ai.bands.show == null)) {
            this.renderer.bands.show = true
        } else {
            if (ai.bands && ai.bands.show == null && ai.bands.interval != null) {
                this.renderer.bands.show = true
            }
        }
        if (this.fill) {
            this.renderer.bands.show = false
        }
        if (this.renderer.bands.show) {
            this.renderer.initBands.call(this, this.renderer.options, an)
        }
        if (this._stack) {
            this.renderer.smooth = false
        }
        var am = {
            lineJoin: this.lineJoin,
            lineCap: this.lineCap,
            fill: this.fill,
            isarc: false,
            strokeStyle: this.color,
            fillStyle: this.fillColor,
            lineWidth: this.lineWidth,
            linePattern: this.linePattern,
            closePath: this.fill
        };
        this.renderer.shapeRenderer.init(am);
        var aj = ai.shadowOffset;
        if (aj == null) {
            if (this.lineWidth > 2.5) {
                aj = 1.25 * (1 + (Math.atan((this.lineWidth / 2.5)) / 0.785398163 - 1) * 0.6)
            } else {
                aj = 1.25 * Math.atan((this.lineWidth / 2.5)) / 0.785398163
            }
        }
        var ah = {
            lineJoin: this.lineJoin,
            lineCap: this.lineCap,
            fill: this.fill,
            isarc: false,
            angle: this.shadowAngle,
            offset: aj,
            alpha: this.shadowAlpha,
            depth: this.shadowDepth,
            lineWidth: this.lineWidth,
            linePattern: this.linePattern,
            closePath: this.fill
        };
        this.renderer.shadowRenderer.init(ah);
        this._areaPoints = [];
        this._boundingBox = [[], []];
        if (!this.isTrendline && this.fill || this.renderer.bands.show) {
            this.highlightMouseOver = true;
            this.highlightMouseDown = false;
            this.highlightColor = null;
            if (al.highlightMouseDown && al.highlightMouseOver == null) {
                al.highlightMouseOver = false
            }
            L.extend(true, this, {
                highlightMouseOver: al.highlightMouseOver,
                highlightMouseDown: al.highlightMouseDown,
                highlightColor: al.highlightColor
            });
            if (!this.highlightColor) {
                var ak = (this.renderer.bands.show) ? this.renderer.bands.fillColor : this.fillColor;
                this.highlightColor = L.jqplot.computeHighlightColors(ak)
            }
            if (this.highlighter) {
                this.highlighter.show = false
            }
        }
        if (!this.isTrendline && an) {
            an.plugins.lineRenderer = {};
            an.postInitHooks.addOnce(z);
            an.postDrawHooks.addOnce(af);
            an.eventListenerHooks.addOnce("jqplotMouseMove", h);
            an.eventListenerHooks.addOnce("jqplotMouseDown", e);
            an.eventListenerHooks.addOnce("jqplotMouseUp", ad);
            an.eventListenerHooks.addOnce("jqplotClick", g);
            an.eventListenerHooks.addOnce("jqplotRightClick", s)
        }
    }
    ;
    L.jqplot.LineRenderer.prototype.initBands = function(ak, av) {
        var al = ak.bandData || [];
        var an = this.renderer.bands;
        an.hiData = [];
        an.lowData = [];
        var aB = this.data;
        an._max = null;
        an._min = null;
        if (al.length == 2) {
            if (L.isArray(al[0][0])) {
                var ao;
                var ah = 0
                  , ar = 0;
                for (var aw = 0, at = al[0].length; aw < at; aw++) {
                    ao = al[0][aw];
                    if ((ao[1] != null && ao[1] > an._max) || an._max == null) {
                        an._max = ao[1]
                    }
                    if ((ao[1] != null && ao[1] < an._min) || an._min == null) {
                        an._min = ao[1]
                    }
                }
                for (var aw = 0, at = al[1].length; aw < at; aw++) {
                    ao = al[1][aw];
                    if ((ao[1] != null && ao[1] > an._max) || an._max == null) {
                        an._max = ao[1];
                        ar = 1
                    }
                    if ((ao[1] != null && ao[1] < an._min) || an._min == null) {
                        an._min = ao[1];
                        ah = 1
                    }
                }
                if (ar === ah) {
                    an.show = false
                }
                an.hiData = al[ar];
                an.lowData = al[ah]
            } else {
                if (al[0].length === aB.length && al[1].length === aB.length) {
                    var aj = (al[0][0] > al[1][0]) ? 0 : 1;
                    var aC = (aj) ? 0 : 1;
                    for (var aw = 0, at = aB.length; aw < at; aw++) {
                        an.hiData.push([aB[aw][0], al[aj][aw]]);
                        an.lowData.push([aB[aw][0], al[aC][aw]])
                    }
                } else {
                    an.show = false
                }
            }
        } else {
            if (al.length > 2 && !L.isArray(al[0][0])) {
                var aj = (al[0][0] > al[0][1]) ? 0 : 1;
                var aC = (aj) ? 0 : 1;
                for (var aw = 0, at = al.length; aw < at; aw++) {
                    an.hiData.push([aB[aw][0], al[aw][aj]]);
                    an.lowData.push([aB[aw][0], al[aw][aC]])
                }
            } else {
                var aq = an.interval;
                var aA = null;
                var az = null;
                var ai = null;
                var au = null;
                if (L.isArray(aq)) {
                    aA = aq[0];
                    az = aq[1]
                } else {
                    aA = aq
                }
                if (isNaN(aA)) {
                    if (aA.charAt(aA.length - 1) === "%") {
                        ai = "multiply";
                        aA = parseFloat(aA) / 100 + 1
                    }
                } else {
                    aA = parseFloat(aA);
                    ai = "add"
                }
                if (az !== null && isNaN(az)) {
                    if (az.charAt(az.length - 1) === "%") {
                        au = "multiply";
                        az = parseFloat(az) / 100 + 1
                    }
                } else {
                    if (az !== null) {
                        az = parseFloat(az);
                        au = "add"
                    }
                }
                if (aA !== null) {
                    if (az === null) {
                        az = -aA;
                        au = ai;
                        if (au === "multiply") {
                            az += 2
                        }
                    }
                    if (aA < az) {
                        var ax = aA;
                        aA = az;
                        az = ax;
                        ax = ai;
                        ai = au;
                        au = ax
                    }
                    for (var aw = 0, at = aB.length; aw < at; aw++) {
                        switch (ai) {
                        case "add":
                            an.hiData.push([aB[aw][0], aB[aw][1] + aA]);
                            break;
                        case "multiply":
                            an.hiData.push([aB[aw][0], aB[aw][1] * aA]);
                            break
                        }
                        switch (au) {
                        case "add":
                            an.lowData.push([aB[aw][0], aB[aw][1] + az]);
                            break;
                        case "multiply":
                            an.lowData.push([aB[aw][0], aB[aw][1] * az]);
                            break
                        }
                    }
                } else {
                    an.show = false
                }
            }
        }
        var am = an.hiData;
        var ap = an.lowData;
        for (var aw = 0, at = am.length; aw < at; aw++) {
            if ((am[aw][1] != null && am[aw][1] > an._max) || an._max == null) {
                an._max = am[aw][1]
            }
        }
        for (var aw = 0, at = ap.length; aw < at; aw++) {
            if ((ap[aw][1] != null && ap[aw][1] < an._min) || an._min == null) {
                an._min = ap[aw][1]
            }
        }
        if (an.fillColor === null) {
            var ay = L.jqplot.getColorComponents(an.color);
            ay[3] = ay[3] * 0.5;
            an.fillColor = "rgba(" + ay[0] + ", " + ay[1] + ", " + ay[2] + ", " + ay[3] + ")"
        }
    }
    ;
    function K(ai, ah) {
        return (3.4182054 + ah) * Math.pow(ai, -0.3534992)
    }
    function n(aj, ai) {
        var ah = Math.sqrt(Math.pow((ai[0] - aj[0]), 2) + Math.pow((ai[1] - aj[1]), 2));
        return 5.7648 * Math.log(ah) + 7.4456
    }
    function A(ah) {
        var ai = (Math.exp(2 * ah) - 1) / (Math.exp(2 * ah) + 1);
        return ai
    }
    function J(aJ) {
        var at = this.renderer.smooth;
        var aD = this.canvas.getWidth();
        var an = this._xaxis.series_p2u;
        var aG = this._yaxis.series_p2u;
        var aF = null;
        var am = null;
        var az = aJ.length / aD;
        var aj = [];
        var ay = [];
        if (!isNaN(parseFloat(at))) {
            aF = parseFloat(at)
        } else {
            aF = K(az, 0.5)
        }
        var aw = [];
        var ak = [];
        for (var aE = 0, aA = aJ.length; aE < aA; aE++) {
            aw.push(aJ[aE][1]);
            ak.push(aJ[aE][0])
        }
        function av(aK, aL) {
            if (aK - aL == 0) {
                return Math.pow(10, 10)
            } else {
                return aK - aL
            }
        }
        var ax, ar, aq, ap;
        var ah = aJ.length - 1;
        for (var al = 1, aB = aJ.length; al < aB; al++) {
            var ai = [];
            var au = [];
            for (var aC = 0; aC < 2; aC++) {
                var aE = al - 1 + aC;
                if (aE == 0 || aE == ah) {
                    ai[aC] = Math.pow(10, 10)
                } else {
                    if (aw[aE + 1] - aw[aE] == 0 || aw[aE] - aw[aE - 1] == 0) {
                        ai[aC] = 0
                    } else {
                        if (((ak[aE + 1] - ak[aE]) / (aw[aE + 1] - aw[aE]) + (ak[aE] - ak[aE - 1]) / (aw[aE] - aw[aE - 1])) == 0) {
                            ai[aC] = 0
                        } else {
                            if ((aw[aE + 1] - aw[aE]) * (aw[aE] - aw[aE - 1]) < 0) {
                                ai[aC] = 0
                            } else {
                                ai[aC] = 2 / (av(ak[aE + 1], ak[aE]) / (aw[aE + 1] - aw[aE]) + av(ak[aE], ak[aE - 1]) / (aw[aE] - aw[aE - 1]))
                            }
                        }
                    }
                }
            }
            if (al == 1) {
                ai[0] = 3 / 2 * (aw[1] - aw[0]) / av(ak[1], ak[0]) - ai[1] / 2
            } else {
                if (al == ah) {
                    ai[1] = 3 / 2 * (aw[ah] - aw[ah - 1]) / av(ak[ah], ak[ah - 1]) - ai[0] / 2
                }
            }
            au[0] = -2 * (ai[1] + 2 * ai[0]) / av(ak[al], ak[al - 1]) + 6 * (aw[al] - aw[al - 1]) / Math.pow(av(ak[al], ak[al - 1]), 2);
            au[1] = 2 * (2 * ai[1] + ai[0]) / av(ak[al], ak[al - 1]) - 6 * (aw[al] - aw[al - 1]) / Math.pow(av(ak[al], ak[al - 1]), 2);
            ap = 1 / 6 * (au[1] - au[0]) / av(ak[al], ak[al - 1]);
            aq = 1 / 2 * (ak[al] * au[0] - ak[al - 1] * au[1]) / av(ak[al], ak[al - 1]);
            ar = (aw[al] - aw[al - 1] - aq * (Math.pow(ak[al], 2) - Math.pow(ak[al - 1], 2)) - ap * (Math.pow(ak[al], 3) - Math.pow(ak[al - 1], 3))) / av(ak[al], ak[al - 1]);
            ax = aw[al - 1] - ar * ak[al - 1] - aq * Math.pow(ak[al - 1], 2) - ap * Math.pow(ak[al - 1], 3);
            var aI = (ak[al] - ak[al - 1]) / aF;
            var aH, ao;
            for (var aC = 0, aA = aF; aC < aA; aC++) {
                aH = [];
                ao = ak[al - 1] + aC * aI;
                aH.push(ao);
                aH.push(ax + ar * ao + aq * Math.pow(ao, 2) + ap * Math.pow(ao, 3));
                aj.push(aH);
                ay.push([an(aH[0]), aG(aH[1])])
            }
        }
        aj.push(aJ[aE]);
        ay.push([an(aJ[aE][0]), aG(aJ[aE][1])]);
        return [aj, ay]
    }
    function F(ap) {
        var ao = this.renderer.smooth;
        var aU = this.renderer.tension;
        var ah = this.canvas.getWidth();
        var aH = this._xaxis.series_p2u;
        var aq = this._yaxis.series_p2u;
        var aI = null;
        var aJ = null;
        var aT = null;
        var aO = null;
        var aM = null;
        var at = null;
        var aR = null;
        var am = null;
        var aK, aL, aD, aC, aA, ay;
        var ak, ai, av, au;
        var aB, az, aN;
        var aw = [];
        var aj = [];
        var al = ap.length / ah;
        var aS, ax, aF, aG, aE;
        var ar = [];
        var an = [];
        if (!isNaN(parseFloat(ao))) {
            aI = parseFloat(ao)
        } else {
            aI = K(al, 0.5)
        }
        if (!isNaN(parseFloat(aU))) {
            aU = parseFloat(aU)
        }
        for (var aQ = 0, aP = ap.length - 1; aQ < aP; aQ++) {
            if (aU === null) {
                at = Math.abs((ap[aQ + 1][1] - ap[aQ][1]) / (ap[aQ + 1][0] - ap[aQ][0]));
                aS = 0.3;
                ax = 0.6;
                aF = (ax - aS) / 2;
                aG = 2.5;
                aE = -1.4;
                am = at / aG + aE;
                aO = aF * A(am) - aF * A(aE) + aS;
                if (aQ > 0) {
                    aR = Math.abs((ap[aQ][1] - ap[aQ - 1][1]) / (ap[aQ][0] - ap[aQ - 1][0]))
                }
                am = aR / aG + aE;
                aM = aF * A(am) - aF * A(aE) + aS;
                aT = (aO + aM) / 2
            } else {
                aT = aU
            }
            for (aK = 0; aK < aI; aK++) {
                aL = aK / aI;
                aD = (1 + 2 * aL) * Math.pow((1 - aL), 2);
                aC = aL * Math.pow((1 - aL), 2);
                aA = Math.pow(aL, 2) * (3 - 2 * aL);
                ay = Math.pow(aL, 2) * (aL - 1);
                if (ap[aQ - 1]) {
                    ak = aT * (ap[aQ + 1][0] - ap[aQ - 1][0]);
                    ai = aT * (ap[aQ + 1][1] - ap[aQ - 1][1])
                } else {
                    ak = aT * (ap[aQ + 1][0] - ap[aQ][0]);
                    ai = aT * (ap[aQ + 1][1] - ap[aQ][1])
                }
                if (ap[aQ + 2]) {
                    av = aT * (ap[aQ + 2][0] - ap[aQ][0]);
                    au = aT * (ap[aQ + 2][1] - ap[aQ][1])
                } else {
                    av = aT * (ap[aQ + 1][0] - ap[aQ][0]);
                    au = aT * (ap[aQ + 1][1] - ap[aQ][1])
                }
                aB = aD * ap[aQ][0] + aA * ap[aQ + 1][0] + aC * ak + ay * av;
                az = aD * ap[aQ][1] + aA * ap[aQ + 1][1] + aC * ai + ay * au;
                aN = [aB, az];
                ar.push(aN);
                an.push([aH(aB), aq(az)])
            }
        }
        ar.push(ap[aP]);
        an.push([aH(ap[aP][0]), aq(ap[aP][1])]);
        return [ar, an]
    }
    L.jqplot.LineRenderer.prototype.setGridData = function(ap) {
        var al = this._xaxis.series_u2p;
        var ah = this._yaxis.series_u2p;
        var am = this._plotData;
        var aq = this._prevPlotData;
        this.gridData = [];
        this._prevGridData = [];
        this.renderer._smoothedData = [];
        this.renderer._smoothedPlotData = [];
        this.renderer._hiBandGridData = [];
        this.renderer._lowBandGridData = [];
        this.renderer._hiBandSmoothedData = [];
        this.renderer._lowBandSmoothedData = [];
        var ak = this.renderer.bands;
        var ai = false;
        for (var an = 0, aj = am.length; an < aj; an++) {
            if (am[an][0] != null && am[an][1] != null) {
                this.gridData.push([al.call(this._xaxis, am[an][0]), ah.call(this._yaxis, am[an][1])])
            } else {
                if (am[an][0] == null) {
                    ai = true;
                    this.gridData.push([null, ah.call(this._yaxis, am[an][1])])
                } else {
                    if (am[an][1] == null) {
                        ai = true;
                        this.gridData.push([al.call(this._xaxis, am[an][0]), null])
                    }
                }
            }
            if (aq[an] != null && aq[an][0] != null && aq[an][1] != null) {
                this._prevGridData.push([al.call(this._xaxis, aq[an][0]), ah.call(this._yaxis, aq[an][1])])
            } else {
                if (aq[an] != null && aq[an][0] == null) {
                    this._prevGridData.push([null, ah.call(this._yaxis, aq[an][1])])
                } else {
                    if (aq[an] != null && aq[an][0] != null && aq[an][1] == null) {
                        this._prevGridData.push([al.call(this._xaxis, aq[an][0]), null])
                    }
                }
            }
        }
        if (ai) {
            this.renderer.smooth = false;
            if (this._type === "line") {
                ak.show = false
            }
        }
        if (this._type === "line" && ak.show) {
            for (var an = 0, aj = ak.hiData.length; an < aj; an++) {
                this.renderer._hiBandGridData.push([al.call(this._xaxis, ak.hiData[an][0]), ah.call(this._yaxis, ak.hiData[an][1])])
            }
            for (var an = 0, aj = ak.lowData.length; an < aj; an++) {
                this.renderer._lowBandGridData.push([al.call(this._xaxis, ak.lowData[an][0]), ah.call(this._yaxis, ak.lowData[an][1])])
            }
        }
        if (this._type === "line" && this.renderer.smooth && this.gridData.length > 2) {
            var ao;
            if (this.renderer.constrainSmoothing) {
                ao = J.call(this, this.gridData);
                this.renderer._smoothedData = ao[0];
                this.renderer._smoothedPlotData = ao[1];
                if (ak.show) {
                    ao = J.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ao[0];
                    ao = J.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ao[0]
                }
                ao = null
            } else {
                ao = F.call(this, this.gridData);
                this.renderer._smoothedData = ao[0];
                this.renderer._smoothedPlotData = ao[1];
                if (ak.show) {
                    ao = F.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ao[0];
                    ao = F.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ao[0]
                }
                ao = null
            }
        }
    }
    ;
    L.jqplot.LineRenderer.prototype.makeGridData = function(ao, aq) {
        var am = this._xaxis.series_u2p;
        var ah = this._yaxis.series_u2p;
        var ar = [];
        var aj = [];
        this.renderer._smoothedData = [];
        this.renderer._smoothedPlotData = [];
        this.renderer._hiBandGridData = [];
        this.renderer._lowBandGridData = [];
        this.renderer._hiBandSmoothedData = [];
        this.renderer._lowBandSmoothedData = [];
        var al = this.renderer.bands;
        var ai = false;
        for (var an = 0; an < ao.length; an++) {
            if (ao[an][0] != null && ao[an][1] != null) {
                ar.push([am.call(this._xaxis, ao[an][0]), ah.call(this._yaxis, ao[an][1])])
            } else {
                if (ao[an][0] == null) {
                    ai = true;
                    ar.push([null, ah.call(this._yaxis, ao[an][1])])
                } else {
                    if (ao[an][1] == null) {
                        ai = true;
                        ar.push([am.call(this._xaxis, ao[an][0]), null])
                    }
                }
            }
        }
        if (ai) {
            this.renderer.smooth = false;
            if (this._type === "line") {
                al.show = false
            }
        }
        if (this._type === "line" && al.show) {
            for (var an = 0, ak = al.hiData.length; an < ak; an++) {
                this.renderer._hiBandGridData.push([am.call(this._xaxis, al.hiData[an][0]), ah.call(this._yaxis, al.hiData[an][1])])
            }
            for (var an = 0, ak = al.lowData.length; an < ak; an++) {
                this.renderer._lowBandGridData.push([am.call(this._xaxis, al.lowData[an][0]), ah.call(this._yaxis, al.lowData[an][1])])
            }
        }
        if (this._type === "line" && this.renderer.smooth && ar.length > 2) {
            var ap;
            if (this.renderer.constrainSmoothing) {
                ap = J.call(this, ar);
                this.renderer._smoothedData = ap[0];
                this.renderer._smoothedPlotData = ap[1];
                if (al.show) {
                    ap = J.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ap[0];
                    ap = J.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ap[0]
                }
                ap = null
            } else {
                ap = F.call(this, ar);
                this.renderer._smoothedData = ap[0];
                this.renderer._smoothedPlotData = ap[1];
                if (al.show) {
                    ap = F.call(this, this.renderer._hiBandGridData);
                    this.renderer._hiBandSmoothedData = ap[0];
                    ap = F.call(this, this.renderer._lowBandGridData);
                    this.renderer._lowBandSmoothedData = ap[0]
                }
                ap = null
            }
        }
        return ar
    }
    ;
    L.jqplot.LineRenderer.prototype.draw = function(ax, aI, ai, aB) {
        var aC;
        var aq = L.extend(true, {}, ai);
        var ak = (aq.shadow != u) ? aq.shadow : this.shadow;
        var aJ = (aq.showLine != u) ? aq.showLine : this.showLine;
        var aA = (aq.fill != u) ? aq.fill : this.fill;
        var ah = (aq.fillAndStroke != u) ? aq.fillAndStroke : this.fillAndStroke;
        var ar, ay, av, aE;
        ax.save();
        if (aI.length) {
            if (aJ) {
                if (aA) {
                    if (this.fillToZero) {
                        var aF = this.negativeColor;
                        if (!this.useNegativeColors) {
                            aF = aq.fillStyle
                        }
                        var ao = false;
                        var ap = aq.fillStyle;
                        if (ah) {
                            var aH = aI.slice(0)
                        }
                        if (this.index == 0 || !this._stack) {
                            var aw = [];
                            var aL = (this.renderer.smooth) ? this.renderer._smoothedPlotData : this._plotData;
                            this._areaPoints = [];
                            var aG = this._yaxis.series_u2p(this.fillToValue);
                            var aj = this._xaxis.series_u2p(this.fillToValue);
                            aq.closePath = true;
                            if (this.fillAxis == "y") {
                                aw.push([aI[0][0], aG]);
                                this._areaPoints.push([aI[0][0], aG]);
                                for (var aC = 0; aC < aI.length - 1; aC++) {
                                    aw.push(aI[aC]);
                                    this._areaPoints.push(aI[aC]);
                                    if (aL[aC][1] * aL[aC + 1][1] <= 0) {
                                        if (aL[aC][1] < 0) {
                                            ao = true;
                                            aq.fillStyle = aF
                                        } else {
                                            ao = false;
                                            aq.fillStyle = ap
                                        }
                                        var an = aI[aC][0] + (aI[aC + 1][0] - aI[aC][0]) * (aG - aI[aC][1]) / (aI[aC + 1][1] - aI[aC][1]);
                                        aw.push([an, aG]);
                                        this._areaPoints.push([an, aG]);
                                        if (ak) {
                                            this.renderer.shadowRenderer.draw(ax, aw, aq)
                                        }
                                        this.renderer.shapeRenderer.draw(ax, aw, aq);
                                        aw = [[an, aG]]
                                    }
                                }
                                if (aL[aI.length - 1][1] < 0) {
                                    ao = true;
                                    aq.fillStyle = aF
                                } else {
                                    ao = false;
                                    aq.fillStyle = ap
                                }
                                aw.push(aI[aI.length - 1]);
                                this._areaPoints.push(aI[aI.length - 1]);
                                aw.push([aI[aI.length - 1][0], aG]);
                                this._areaPoints.push([aI[aI.length - 1][0], aG])
                            }
                            if (ak) {
                                this.renderer.shadowRenderer.draw(ax, aw, aq)
                            }
                            this.renderer.shapeRenderer.draw(ax, aw, aq)
                        } else {
                            var au = this._prevGridData;
                            for (var aC = au.length; aC > 0; aC--) {
                                aI.push(au[aC - 1])
                            }
                            if (ak) {
                                this.renderer.shadowRenderer.draw(ax, aI, aq)
                            }
                            this._areaPoints = aI;
                            this.renderer.shapeRenderer.draw(ax, aI, aq)
                        }
                    } else {
                        if (ah) {
                            var aH = aI.slice(0)
                        }
                        if (this.index == 0 || !this._stack) {
                            var al = ax.canvas.height;
                            aI.unshift([aI[0][0], al]);
                            var aD = aI.length;
                            aI.push([aI[aD - 1][0], al])
                        } else {
                            var au = this._prevGridData;
                            for (var aC = au.length; aC > 0; aC--) {
                                aI.push(au[aC - 1])
                            }
                        }
                        this._areaPoints = aI;
                        if (ak) {
                            this.renderer.shadowRenderer.draw(ax, aI, aq)
                        }
                        this.renderer.shapeRenderer.draw(ax, aI, aq)
                    }
                    if (ah) {
                        var az = L.extend(true, {}, aq, {
                            fill: false,
                            closePath: false
                        });
                        this.renderer.shapeRenderer.draw(ax, aH, az);
                        if (this.markerRenderer.show) {
                            if (this.renderer.smooth) {
                                aH = this.gridData
                            }
                            for (aC = 0; aC < aH.length; aC++) {
                                this.markerRenderer.draw(aH[aC][0], aH[aC][1], ax, aq.markerOptions)
                            }
                        }
                    }
                } else {
                    if (this.renderer.bands.show) {
                        var am;
                        var aK = L.extend(true, {}, aq);
                        if (this.renderer.bands.showLines) {
                            am = (this.renderer.smooth) ? this.renderer._hiBandSmoothedData : this.renderer._hiBandGridData;
                            this.renderer.shapeRenderer.draw(ax, am, aq);
                            am = (this.renderer.smooth) ? this.renderer._lowBandSmoothedData : this.renderer._lowBandGridData;
                            this.renderer.shapeRenderer.draw(ax, am, aK)
                        }
                        if (this.renderer.bands.fill) {
                            if (this.renderer.smooth) {
                                am = this.renderer._hiBandSmoothedData.concat(this.renderer._lowBandSmoothedData.reverse())
                            } else {
                                am = this.renderer._hiBandGridData.concat(this.renderer._lowBandGridData.reverse())
                            }
                            this._areaPoints = am;
                            aK.closePath = true;
                            aK.fill = true;
                            aK.fillStyle = this.renderer.bands.fillColor;
                            this.renderer.shapeRenderer.draw(ax, am, aK)
                        }
                    }
                    if (ak) {
                        this.renderer.shadowRenderer.draw(ax, aI, aq)
                    }
                    this.renderer.shapeRenderer.draw(ax, aI, aq)
                }
            }
            var ar = av = ay = aE = null;
            for (aC = 0; aC < this._areaPoints.length; aC++) {
                var at = this._areaPoints[aC];
                if (ar > at[0] || ar == null) {
                    ar = at[0]
                }
                if (aE < at[1] || aE == null) {
                    aE = at[1]
                }
                if (av < at[0] || av == null) {
                    av = at[0]
                }
                if (ay > at[1] || ay == null) {
                    ay = at[1]
                }
            }
            if (this.type === "line" && this.renderer.bands.show) {
                aE = this._yaxis.series_u2p(this.renderer.bands._min);
                ay = this._yaxis.series_u2p(this.renderer.bands._max)
            }
            this._boundingBox = [[ar, aE], [av, ay]];
            if (this.markerRenderer.show && !aA) {
                if (this.renderer.smooth) {
                    aI = this.gridData
                }
                for (aC = 0; aC < aI.length; aC++) {
                    if (aI[aC][0] != null && aI[aC][1] != null) {
                        this.markerRenderer.draw(aI[aC][0], aI[aC][1], ax, aq.markerOptions)
                    }
                }
            }
        }
        ax.restore()
    }
    ;
    L.jqplot.LineRenderer.prototype.drawShadow = function(ah, aj, ai) {}
    ;
    function z(ak, aj, ah) {
        for (var ai = 0; ai < this.series.length; ai++) {
            if (this.series[ai].renderer.constructor == L.jqplot.LineRenderer) {
                if (this.series[ai].highlightMouseOver) {
                    this.series[ai].highlightMouseDown = false
                }
            }
        }
    }
    function af() {
        if (this.plugins.lineRenderer && this.plugins.lineRenderer.highlightCanvas) {
            this.plugins.lineRenderer.highlightCanvas.resetCanvas();
            this.plugins.lineRenderer.highlightCanvas = null
        }
        this.plugins.lineRenderer.highlightedSeriesIndex = null;
        this.plugins.lineRenderer.highlightCanvas = new L.jqplot.GenericCanvas();
        this.eventCanvas._elem.before(this.plugins.lineRenderer.highlightCanvas.createElement(this._gridPadding, "jqplot-lineRenderer-highlight-canvas", this._plotDimensions, this));
        this.plugins.lineRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind("mouseleave", {
            plot: this
        }, function(ah) {
            aa(ah.data.plot)
        })
    }
    function ac(an, am, ak, aj) {
        var ai = an.series[am];
        var ah = an.plugins.lineRenderer.highlightCanvas;
        ah._ctx.clearRect(0, 0, ah._ctx.canvas.width, ah._ctx.canvas.height);
        ai._highlightedPoint = ak;
        an.plugins.lineRenderer.highlightedSeriesIndex = am;
        var al = {
            fillStyle: ai.highlightColor
        };
        if (ai.type === "line" && ai.renderer.bands.show) {
            al.fill = true;
            al.closePath = true
        }
        ai.renderer.shapeRenderer.draw(ah._ctx, aj, al);
        ah = null
    }
    function aa(aj) {
        var ah = aj.plugins.lineRenderer.highlightCanvas;
        ah._ctx.clearRect(0, 0, ah._ctx.canvas.width, ah._ctx.canvas.height);
        for (var ai = 0; ai < aj.series.length; ai++) {
            aj.series[ai]._highlightedPoint = null
        }
        aj.plugins.lineRenderer.highlightedSeriesIndex = null;
        aj.target.trigger("jqplotDataUnhighlight");
        ah = null
    }
    function h(al, ak, ao, an, am) {
        if (an) {
            var aj = [an.seriesIndex, an.pointIndex, an.data];
            var ai = jQuery.Event("jqplotDataMouseOver");
            ai.pageX = al.pageX;
            ai.pageY = al.pageY;
            am.target.trigger(ai, aj);
            if (am.series[aj[0]].highlightMouseOver && !(aj[0] == am.plugins.lineRenderer.highlightedSeriesIndex)) {
                var ah = jQuery.Event("jqplotDataHighlight");
                ah.which = al.which;
                ah.pageX = al.pageX;
                ah.pageY = al.pageY;
                am.target.trigger(ah, aj);
                ac(am, an.seriesIndex, an.pointIndex, an.points)
            }
        } else {
            if (an == null) {
                aa(am)
            }
        }
    }
    function e(ak, aj, an, am, al) {
        if (am) {
            var ai = [am.seriesIndex, am.pointIndex, am.data];
            if (al.series[ai[0]].highlightMouseDown && !(ai[0] == al.plugins.lineRenderer.highlightedSeriesIndex)) {
                var ah = jQuery.Event("jqplotDataHighlight");
                ah.which = ak.which;
                ah.pageX = ak.pageX;
                ah.pageY = ak.pageY;
                al.target.trigger(ah, ai);
                ac(al, am.seriesIndex, am.pointIndex, am.points)
            }
        } else {
            if (am == null) {
                aa(al)
            }
        }
    }
    function ad(aj, ai, am, al, ak) {
        var ah = ak.plugins.lineRenderer.highlightedSeriesIndex;
        if (ah != null && ak.series[ah].highlightMouseDown) {
            aa(ak)
        }
    }
    function g(ak, aj, an, am, al) {
        if (am) {
            var ai = [am.seriesIndex, am.pointIndex, am.data];
            var ah = jQuery.Event("jqplotDataClick");
            ah.which = ak.which;
            ah.pageX = ak.pageX;
            ah.pageY = ak.pageY;
            al.target.trigger(ah, ai)
        }
    }
    function s(al, ak, ao, an, am) {
        if (an) {
            var aj = [an.seriesIndex, an.pointIndex, an.data];
            var ah = am.plugins.lineRenderer.highlightedSeriesIndex;
            if (ah != null && am.series[ah].highlightMouseDown) {
                aa(am)
            }
            var ai = jQuery.Event("jqplotDataRightClick");
            ai.which = al.which;
            ai.pageX = al.pageX;
            ai.pageY = al.pageY;
            am.target.trigger(ai, aj)
        }
    }
    L.jqplot.LinearAxisRenderer = function() {}
    ;
    L.jqplot.LinearAxisRenderer.prototype.init = function(ah) {
        this.breakPoints = null;
        this.breakTickLabel = "&asymp;";
        this.drawBaseline = true;
        this.baselineWidth = null;
        this.baselineColor = null;
        this.forceTickAt0 = false;
        this.forceTickAt100 = false;
        this.tickInset = 0;
        this.minorTicks = 0;
        this.alignTicks = false;
        this._autoFormatString = "";
        this._overrideFormatString = false;
        this._scalefact = 1;
        L.extend(true, this, ah);
        if (this.breakPoints) {
            if (!L.isArray(this.breakPoints)) {
                this.breakPoints = null
            } else {
                if (this.breakPoints.length < 2 || this.breakPoints[1] <= this.breakPoints[0]) {
                    this.breakPoints = null
                }
            }
        }
        if (this.numberTicks != null && this.numberTicks < 2) {
            this.numberTicks = 2
        }
        this.resetDataBounds()
    }
    ;
    L.jqplot.LinearAxisRenderer.prototype.draw = function(ah, ao) {
        if (this.show) {
            this.renderer.createTicks.call(this, ao);
            var an = 0;
            var ai;
            if (this._elem) {
                this._elem.emptyForce();
                this._elem = null
            }
            this._elem = L(document.createElement("div"));
            this._elem.addClass("jqplot-axis jqplot-" + this.name);
            this._elem.css("position", "absolute");
            if (this.name == "xaxis" || this.name == "x2axis") {
                this._elem.width(this._plotDimensions.width)
            } else {
                this._elem.height(this._plotDimensions.height)
            }
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                var am = this._label.draw(ah, ao);
                am.appendTo(this._elem);
                am = null
            }
            var al = this._ticks;
            var ak;
            for (var aj = 0; aj < al.length; aj++) {
                ak = al[aj];
                if (ak.show && ak.showLabel && (!ak.isMinorTick || this.showMinorTicks)) {
                    this._elem.append(ak.draw(ah, ao))
                }
            }
            ak = null;
            al = null
        }
        return this._elem
    }
    ;
    L.jqplot.LinearAxisRenderer.prototype.reset = function() {
        this.min = this._options.min;
        this.max = this._options.max;
        this.tickInterval = this._options.tickInterval;
        this.numberTicks = this._options.numberTicks;
        this._autoFormatString = "";
        if (this._overrideFormatString && this.tickOptions && this.tickOptions.formatString) {
            this.tickOptions.formatString = ""
        }
    }
    ;
    L.jqplot.LinearAxisRenderer.prototype.set = function() {
        var ao = 0;
        var aj;
        var ai = 0;
        var an = 0;
        var ah = (this._label == null) ? false : this._label.show;
        if (this.show) {
            var am = this._ticks;
            var al;
            for (var ak = 0; ak < am.length; ak++) {
                al = am[ak];
                if (!al._breakTick && al.show && al.showLabel && (!al.isMinorTick || this.showMinorTicks)) {
                    if (this.name == "xaxis" || this.name == "x2axis") {
                        aj = al._elem.outerHeight(true)
                    } else {
                        aj = al._elem.outerWidth(true)
                    }
                    if (aj > ao) {
                        ao = aj
                    }
                }
            }
            al = null;
            am = null;
            if (ah) {
                ai = this._label._elem.outerWidth(true);
                an = this._label._elem.outerHeight(true)
            }
            if (this.name == "xaxis") {
                ao = ao + an;
                this._elem.css({
                    height: ao + "px",
                    left: "0px",
                    bottom: "0px"
                })
            } else {
                if (this.name == "x2axis") {
                    ao = ao + an;
                    this._elem.css({
                        height: ao + "px",
                        left: "0px",
                        top: "0px"
                    })
                } else {
                    if (this.name == "yaxis") {
                        ao = ao + ai;
                        this._elem.css({
                            width: ao + "px",
                            left: "0px",
                            top: "0px"
                        });
                        if (ah && this._label.constructor == L.jqplot.AxisLabelRenderer) {
                            this._label._elem.css("width", ai + "px")
                        }
                    } else {
                        ao = ao + ai;
                        this._elem.css({
                            width: ao + "px",
                            right: "0px",
                            top: "0px"
                        });
                        if (ah && this._label.constructor == L.jqplot.AxisLabelRenderer) {
                            this._label._elem.css("width", ai + "px")
                        }
                    }
                }
            }
        }
    }
    ;
    L.jqplot.LinearAxisRenderer.prototype.createTicks = function(aj) {
        var aT = this._ticks;
        var aK = this.ticks;
        var az = this.name;
        var aB = this._dataBounds;
        var ah = (this.name.charAt(0) === "x") ? this._plotDimensions.width : this._plotDimensions.height;
        var an;
        var a6, aI;
        var ap, ao;
        var a4, a0;
        var aH = this.min;
        var a5 = this.max;
        var aW = this.numberTicks;
        var ba = this.tickInterval;
        var am = 30;
        this._scalefact = (Math.max(ah, am + 1) - am) / 300;
        if (aK.length) {
            for (a0 = 0; a0 < aK.length; a0++) {
                var aO = aK[a0];
                var aU = new this.tickRenderer(this.tickOptions);
                if (L.isArray(aO)) {
                    aU.value = aO[0];
                    if (this.breakPoints) {
                        if (aO[0] == this.breakPoints[0]) {
                            aU.label = this.breakTickLabel;
                            aU._breakTick = true;
                            aU.showGridline = false;
                            aU.showMark = false
                        } else {
                            if (aO[0] > this.breakPoints[0] && aO[0] <= this.breakPoints[1]) {
                                aU.show = false;
                                aU.showGridline = false;
                                aU.label = aO[1]
                            } else {
                                aU.label = aO[1]
                            }
                        }
                    } else {
                        aU.label = aO[1]
                    }
                    aU.setTick(aO[0], this.name);
                    this._ticks.push(aU)
                } else {
                    if (L.isPlainObject(aO)) {
                        L.extend(true, aU, aO);
                        aU.axis = this.name;
                        this._ticks.push(aU)
                    } else {
                        aU.value = aO;
                        if (this.breakPoints) {
                            if (aO == this.breakPoints[0]) {
                                aU.label = this.breakTickLabel;
                                aU._breakTick = true;
                                aU.showGridline = false;
                                aU.showMark = false
                            } else {
                                if (aO > this.breakPoints[0] && aO <= this.breakPoints[1]) {
                                    aU.show = false;
                                    aU.showGridline = false
                                }
                            }
                        }
                        aU.setTick(aO, this.name);
                        this._ticks.push(aU)
                    }
                }
            }
            this.numberTicks = aK.length;
            this.min = this._ticks[0].value;
            this.max = this._ticks[this.numberTicks - 1].value;
            this.tickInterval = (this.max - this.min) / (this.numberTicks - 1)
        } else {
            if (az == "xaxis" || az == "x2axis") {
                ah = this._plotDimensions.width
            } else {
                ah = this._plotDimensions.height
            }
            var ax = this.numberTicks;
            if (this.alignTicks) {
                if (this.name === "x2axis" && aj.axes.xaxis.show) {
                    ax = aj.axes.xaxis.numberTicks
                } else {
                    if (this.name.charAt(0) === "y" && this.name !== "yaxis" && this.name !== "yMidAxis" && aj.axes.yaxis.show) {
                        ax = aj.axes.yaxis.numberTicks
                    }
                }
            }
            a6 = ((this.min != null) ? this.min : aB.min);
            aI = ((this.max != null) ? this.max : aB.max);
            var av = aI - a6;
            var aS, ay;
            var at;
            if (this.tickOptions == null || !this.tickOptions.formatString) {
                this._overrideFormatString = true
            }
            if (this.min == null || this.max == null && this.tickInterval == null && !this.autoscale) {
                if (this.forceTickAt0) {
                    if (a6 > 0) {
                        a6 = 0
                    }
                    if (aI < 0) {
                        aI = 0
                    }
                }
                if (this.forceTickAt100) {
                    if (a6 > 100) {
                        a6 = 100
                    }
                    if (aI < 100) {
                        aI = 100
                    }
                }
                var aE = false
                  , a1 = false;
                if (this.min != null) {
                    aE = true
                } else {
                    if (this.max != null) {
                        a1 = true
                    }
                }
                var aP = L.jqplot.LinearTickGenerator(a6, aI, this._scalefact, ax, aE, a1);
                var aw = (this.min != null) ? a6 : a6 + av * (this.padMin - 1);
                var aQ = (this.max != null) ? aI : aI - av * (this.padMax - 1);
                if (a6 < aw || aI > aQ) {
                    aw = (this.min != null) ? a6 : a6 - av * (this.padMin - 1);
                    aQ = (this.max != null) ? aI : aI + av * (this.padMax - 1);
                    aP = L.jqplot.LinearTickGenerator(aw, aQ, this._scalefact, ax, aE, a1)
                }
                this.min = aP[0];
                this.max = aP[1];
                this.numberTicks = aP[2];
                this._autoFormatString = aP[3];
                this.tickInterval = aP[4]
            } else {
                if (a6 == aI) {
                    var ai = 0.05;
                    if (a6 > 0) {
                        ai = Math.max(Math.log(a6) / Math.LN10, 0.05)
                    }
                    a6 -= ai;
                    aI += ai
                }
                if (this.autoscale && this.min == null && this.max == null) {
                    var ak, al, ar;
                    var aC = false;
                    var aN = false;
                    var aA = {
                        min: null,
                        max: null,
                        average: null,
                        stddev: null
                    };
                    for (var a0 = 0; a0 < this._series.length; a0++) {
                        var aV = this._series[a0];
                        var aD = (aV.fillAxis == "x") ? aV._xaxis.name : aV._yaxis.name;
                        if (this.name == aD) {
                            var aR = aV._plotValues[aV.fillAxis];
                            var aG = aR[0];
                            var a2 = aR[0];
                            for (var aZ = 1; aZ < aR.length; aZ++) {
                                if (aR[aZ] < aG) {
                                    aG = aR[aZ]
                                } else {
                                    if (aR[aZ] > a2) {
                                        a2 = aR[aZ]
                                    }
                                }
                            }
                            var au = (a2 - aG) / a2;
                            if (aV.renderer.constructor == L.jqplot.BarRenderer) {
                                if (aG >= 0 && (aV.fillToZero || au > 0.1)) {
                                    aC = true
                                } else {
                                    aC = false;
                                    if (aV.fill && aV.fillToZero && aG < 0 && a2 > 0) {
                                        aN = true
                                    } else {
                                        aN = false
                                    }
                                }
                            } else {
                                if (aV.fill) {
                                    if (aG >= 0 && (aV.fillToZero || au > 0.1)) {
                                        aC = true
                                    } else {
                                        if (aG < 0 && a2 > 0 && aV.fillToZero) {
                                            aC = false;
                                            aN = true
                                        } else {
                                            aC = false;
                                            aN = false
                                        }
                                    }
                                } else {
                                    if (aG < 0) {
                                        aC = false
                                    }
                                }
                            }
                        }
                    }
                    if (aC) {
                        this.numberTicks = 2 + Math.ceil((ah - (this.tickSpacing - 1)) / this.tickSpacing);
                        this.min = 0;
                        aH = 0;
                        al = aI / (this.numberTicks - 1);
                        at = Math.pow(10, Math.abs(Math.floor(Math.log(al) / Math.LN10)));
                        if (al / at == parseInt(al / at, 10)) {
                            al += at
                        }
                        this.tickInterval = Math.ceil(al / at) * at;
                        this.max = this.tickInterval * (this.numberTicks - 1)
                    } else {
                        if (aN) {
                            this.numberTicks = 2 + Math.ceil((ah - (this.tickSpacing - 1)) / this.tickSpacing);
                            var aJ = Math.ceil(Math.abs(a6) / av * (this.numberTicks - 1));
                            var a9 = this.numberTicks - 1 - aJ;
                            al = Math.max(Math.abs(a6 / aJ), Math.abs(aI / a9));
                            at = Math.pow(10, Math.abs(Math.floor(Math.log(al) / Math.LN10)));
                            this.tickInterval = Math.ceil(al / at) * at;
                            this.max = this.tickInterval * a9;
                            this.min = -this.tickInterval * aJ
                        } else {
                            if (this.numberTicks == null) {
                                if (this.tickInterval) {
                                    this.numberTicks = 3 + Math.ceil(av / this.tickInterval)
                                } else {
                                    this.numberTicks = 2 + Math.ceil((ah - (this.tickSpacing - 1)) / this.tickSpacing)
                                }
                            }
                            if (this.tickInterval == null) {
                                al = av / (this.numberTicks - 1);
                                if (al < 1) {
                                    at = Math.pow(10, Math.abs(Math.floor(Math.log(al) / Math.LN10)))
                                } else {
                                    at = 1
                                }
                                this.tickInterval = Math.ceil(al * at * this.pad) / at
                            } else {
                                at = 1 / this.tickInterval
                            }
                            ak = this.tickInterval * (this.numberTicks - 1);
                            ar = (ak - av) / 2;
                            if (this.min == null) {
                                this.min = Math.floor(at * (a6 - ar)) / at
                            }
                            if (this.max == null) {
                                this.max = this.min + ak
                            }
                        }
                    }
                    var aF = L.jqplot.getSignificantFigures(this.tickInterval);
                    var aM;
                    if (aF.digitsLeft >= aF.significantDigits) {
                        aM = "%d"
                    } else {
                        var at = Math.max(0, 5 - aF.digitsLeft);
                        at = Math.min(at, aF.digitsRight);
                        aM = "%." + at + "f"
                    }
                    this._autoFormatString = aM
                } else {
                    aS = (this.min != null) ? this.min : a6 - av * (this.padMin - 1);
                    ay = (this.max != null) ? this.max : aI + av * (this.padMax - 1);
                    av = ay - aS;
                    if (this.numberTicks == null) {
                        if (this.tickInterval != null) {
                            this.numberTicks = Math.ceil((ay - aS) / this.tickInterval) + 1
                        } else {
                            if (ah > 100) {
                                this.numberTicks = parseInt(3 + (ah - 100) / 75, 10)
                            } else {
                                this.numberTicks = 2
                            }
                        }
                    }
                    if (this.tickInterval == null) {
                        this.tickInterval = av / (this.numberTicks - 1)
                    }
                    if (this.max == null) {
                        ay = aS + this.tickInterval * (this.numberTicks - 1)
                    }
                    if (this.min == null) {
                        aS = ay - this.tickInterval * (this.numberTicks - 1)
                    }
                    var aF = L.jqplot.getSignificantFigures(this.tickInterval);
                    var aM;
                    if (aF.digitsLeft >= aF.significantDigits) {
                        aM = "%d"
                    } else {
                        var at = Math.max(0, 5 - aF.digitsLeft);
                        at = Math.min(at, aF.digitsRight);
                        aM = "%." + at + "f"
                    }
                    this._autoFormatString = aM;
                    this.min = aS;
                    this.max = ay
                }
                if (this.renderer.constructor == L.jqplot.LinearAxisRenderer && this._autoFormatString == "") {
                    av = this.max - this.min;
                    var a7 = new this.tickRenderer(this.tickOptions);
                    var aL = a7.formatString || L.jqplot.config.defaultTickFormatString;
                    var aL = aL.match(L.jqplot.sprintf.regex)[0];
                    var a3 = 0;
                    if (aL) {
                        if (aL.search(/[fFeEgGpP]/) > -1) {
                            var aY = aL.match(/\%\.(\d{0,})?[eEfFgGpP]/);
                            if (aY) {
                                a3 = parseInt(aY[1], 10)
                            } else {
                                a3 = 6
                            }
                        } else {
                            if (aL.search(/[di]/) > -1) {
                                a3 = 0
                            }
                        }
                        var aq = Math.pow(10, -a3);
                        if (this.tickInterval < aq) {
                            if (aW == null && ba == null) {
                                this.tickInterval = aq;
                                if (a5 == null && aH == null) {
                                    this.min = Math.floor(this._dataBounds.min / aq) * aq;
                                    if (this.min == this._dataBounds.min) {
                                        this.min = this._dataBounds.min - this.tickInterval
                                    }
                                    this.max = Math.ceil(this._dataBounds.max / aq) * aq;
                                    if (this.max == this._dataBounds.max) {
                                        this.max = this._dataBounds.max + this.tickInterval
                                    }
                                    var aX = (this.max - this.min) / this.tickInterval;
                                    aX = aX.toFixed(11);
                                    aX = Math.ceil(aX);
                                    this.numberTicks = aX + 1
                                } else {
                                    if (a5 == null) {
                                        var aX = (this._dataBounds.max - this.min) / this.tickInterval;
                                        aX = aX.toFixed(11);
                                        this.numberTicks = Math.ceil(aX) + 2;
                                        this.max = this.min + this.tickInterval * (this.numberTicks - 1)
                                    } else {
                                        if (aH == null) {
                                            var aX = (this.max - this._dataBounds.min) / this.tickInterval;
                                            aX = aX.toFixed(11);
                                            this.numberTicks = Math.ceil(aX) + 2;
                                            this.min = this.max - this.tickInterval * (this.numberTicks - 1)
                                        } else {
                                            this.numberTicks = Math.ceil((a5 - aH) / this.tickInterval) + 1;
                                            this.min = Math.floor(aH * Math.pow(10, a3)) / Math.pow(10, a3);
                                            this.max = Math.ceil(a5 * Math.pow(10, a3)) / Math.pow(10, a3);
                                            this.numberTicks = Math.ceil((this.max - this.min) / this.tickInterval) + 1
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (this._overrideFormatString && this._autoFormatString != "") {
                this.tickOptions = this.tickOptions || {};
                this.tickOptions.formatString = this._autoFormatString
            }
            var aU, a8;
            for (var a0 = 0; a0 < this.numberTicks; a0++) {
                a4 = this.min + a0 * this.tickInterval;
                aU = new this.tickRenderer(this.tickOptions);
                aU.setTick(a4, this.name);
                this._ticks.push(aU);
                if (a0 < this.numberTicks - 1) {
                    for (var aZ = 0; aZ < this.minorTicks; aZ++) {
                        a4 += this.tickInterval / (this.minorTicks + 1);
                        a8 = L.extend(true, {}, this.tickOptions, {
                            name: this.name,
                            value: a4,
                            label: "",
                            isMinorTick: true
                        });
                        aU = new this.tickRenderer(a8);
                        this._ticks.push(aU)
                    }
                }
                aU = null
            }
        }
        if (this.tickInset) {
            this.min = this.min - this.tickInset * this.tickInterval;
            this.max = this.max + this.tickInset * this.tickInterval
        }
        aT = null
    }
    ;
    L.jqplot.LinearAxisRenderer.prototype.resetTickValues = function(aj) {
        if (L.isArray(aj) && aj.length == this._ticks.length) {
            var ai;
            for (var ah = 0; ah < aj.length; ah++) {
                ai = this._ticks[ah];
                ai.value = aj[ah];
                ai.label = ai.formatter(ai.formatString, aj[ah]);
                ai.label = ai.prefix + ai.label;
                ai._elem.html(ai.label)
            }
            ai = null;
            this.min = L.jqplot.arrayMin(aj);
            this.max = L.jqplot.arrayMax(aj);
            this.pack()
        }
    }
    ;
    L.jqplot.LinearAxisRenderer.prototype.pack = function(aj, ai) {
        aj = aj || {};
        ai = ai || this._offsets;
        var ay = this._ticks;
        var au = this.max;
        var at = this.min;
        var ao = ai.max;
        var am = ai.min;
        var aq = (this._label == null) ? false : this._label.show;
        for (var ar in aj) {
            this._elem.css(ar, aj[ar])
        }
        this._offsets = ai;
        var ak = ao - am;
        var al = au - at;
        if (this.breakPoints) {
            al = al - this.breakPoints[1] + this.breakPoints[0];
            this.p2u = function(aA) {
                return (aA - am) * al / ak + at
            }
            ;
            this.u2p = function(aA) {
                if (aA > this.breakPoints[0] && aA < this.breakPoints[1]) {
                    aA = this.breakPoints[0]
                }
                if (aA <= this.breakPoints[0]) {
                    return (aA - at) * ak / al + am
                } else {
                    return (aA - this.breakPoints[1] + this.breakPoints[0] - at) * ak / al + am
                }
            }
            ;
            if (this.name.charAt(0) == "x") {
                this.series_u2p = function(aA) {
                    if (aA > this.breakPoints[0] && aA < this.breakPoints[1]) {
                        aA = this.breakPoints[0]
                    }
                    if (aA <= this.breakPoints[0]) {
                        return (aA - at) * ak / al
                    } else {
                        return (aA - this.breakPoints[1] + this.breakPoints[0] - at) * ak / al
                    }
                }
                ;
                this.series_p2u = function(aA) {
                    return aA * al / ak + at
                }
            } else {
                this.series_u2p = function(aA) {
                    if (aA > this.breakPoints[0] && aA < this.breakPoints[1]) {
                        aA = this.breakPoints[0]
                    }
                    if (aA >= this.breakPoints[1]) {
                        return (aA - au) * ak / al
                    } else {
                        return (aA + this.breakPoints[1] - this.breakPoints[0] - au) * ak / al
                    }
                }
                ;
                this.series_p2u = function(aA) {
                    return aA * al / ak + au
                }
            }
        } else {
            this.p2u = function(aA) {
                return (aA - am) * al / ak + at
            }
            ;
            this.u2p = function(aA) {
                return (aA - at) * ak / al + am
            }
            ;
            if (this.name == "xaxis" || this.name == "x2axis") {
                this.series_u2p = function(aA) {
                    return (aA - at) * ak / al
                }
                ;
                this.series_p2u = function(aA) {
                    return aA * al / ak + at
                }
            } else {
                this.series_u2p = function(aA) {
                    return (aA - au) * ak / al
                }
                ;
                this.series_p2u = function(aA) {
                    return aA * al / ak + au
                }
            }
        }
        if (this.show) {
            if (this.name == "xaxis" || this.name == "x2axis") {
                for (var av = 0; av < ay.length; av++) {
                    var ap = ay[av];
                    if (ap.show && ap.showLabel) {
                        var ah;
                        if (ap.constructor == L.jqplot.CanvasAxisTickRenderer && ap.angle) {
                            var ax = (this.name == "xaxis") ? 1 : -1;
                            switch (ap.labelPosition) {
                            case "auto":
                                if (ax * ap.angle < 0) {
                                    ah = -ap.getWidth() + ap._textRenderer.height * Math.sin(-ap._textRenderer.angle) / 2
                                } else {
                                    ah = -ap._textRenderer.height * Math.sin(ap._textRenderer.angle) / 2
                                }
                                break;
                            case "end":
                                ah = -ap.getWidth() + ap._textRenderer.height * Math.sin(-ap._textRenderer.angle) / 2;
                                break;
                            case "start":
                                ah = -ap._textRenderer.height * Math.sin(ap._textRenderer.angle) / 2;
                                break;
                            case "middle":
                                ah = -ap.getWidth() / 2 + ap._textRenderer.height * Math.sin(-ap._textRenderer.angle) / 2;
                                break;
                            default:
                                ah = -ap.getWidth() / 2 + ap._textRenderer.height * Math.sin(-ap._textRenderer.angle) / 2;
                                break
                            }
                        } else {
                            ah = -ap.getWidth() / 2
                        }
                        var az = this.u2p(ap.value) + ah + "px";
                        ap._elem.css("left", az);
                        ap.pack()
                    }
                }
                if (aq) {
                    var an = this._label._elem.outerWidth(true);
                    this._label._elem.css("left", am + ak / 2 - an / 2 + "px");
                    if (this.name == "xaxis") {
                        this._label._elem.css("bottom", "0px")
                    } else {
                        this._label._elem.css("top", "0px")
                    }
                    this._label.pack()
                }
            } else {
                for (var av = 0; av < ay.length; av++) {
                    var ap = ay[av];
                    if (ap.show && ap.showLabel) {
                        var ah;
                        if (ap.constructor == L.jqplot.CanvasAxisTickRenderer && ap.angle) {
                            var ax = (this.name == "yaxis") ? 1 : -1;
                            switch (ap.labelPosition) {
                            case "auto":
                            case "end":
                                if (ax * ap.angle < 0) {
                                    ah = -ap._textRenderer.height * Math.cos(-ap._textRenderer.angle) / 2
                                } else {
                                    ah = -ap.getHeight() + ap._textRenderer.height * Math.cos(ap._textRenderer.angle) / 2
                                }
                                break;
                            case "start":
                                if (ap.angle > 0) {
                                    ah = -ap._textRenderer.height * Math.cos(-ap._textRenderer.angle) / 2
                                } else {
                                    ah = -ap.getHeight() + ap._textRenderer.height * Math.cos(ap._textRenderer.angle) / 2
                                }
                                break;
                            case "middle":
                                ah = -ap.getHeight() / 2;
                                break;
                            default:
                                ah = -ap.getHeight() / 2;
                                break
                            }
                        } else {
                            ah = -ap.getHeight() / 2
                        }
                        var az = this.u2p(ap.value) + ah + "px";
                        ap._elem.css("top", az);
                        ap.pack()
                    }
                }
                if (aq) {
                    var aw = this._label._elem.outerHeight(true);
                    this._label._elem.css("top", ao - ak / 2 - aw / 2 + "px");
                    if (this.name == "yaxis") {
                        this._label._elem.css("left", "0px")
                    } else {
                        this._label._elem.css("right", "0px")
                    }
                    this._label.pack()
                }
            }
        }
        ay = null
    }
    ;
    function i(ai) {
        var ah;
        ai = Math.abs(ai);
        if (ai >= 10) {
            ah = "%d"
        } else {
            if (ai > 1) {
                if (ai === parseInt(ai, 10)) {
                    ah = "%d"
                } else {
                    ah = "%.1f"
                }
            } else {
                var aj = -Math.floor(Math.log(ai) / Math.LN10);
                ah = "%." + aj + "f"
            }
        }
        return ah
    }
    var b = [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1, 2, 3, 4, 5];
    var c = function(ai) {
        var ah = b.indexOf(ai);
        if (ah > 0) {
            return b[ah - 1]
        } else {
            return b[b.length - 1] / 100
        }
    };
    var k = function(ai) {
        var ah = b.indexOf(ai);
        if (ah < b.length - 1) {
            return b[ah + 1]
        } else {
            return b[0] * 100
        }
    };
    function d(al, au, at) {
        var aq = Math.floor(at / 2);
        var ai = Math.ceil(at * 1.5);
        var ak = Number.MAX_VALUE;
        var ah = (au - al);
        var ax;
        var ap;
        var ar;
        var ay = L.jqplot.getSignificantFigures;
        var aw;
        var an;
        var ao;
        var av;
        for (var am = 0, aj = ai - aq + 1; am < aj; am++) {
            ao = aq + am;
            ax = ah / (ao - 1);
            ap = ay(ax);
            ax = Math.abs(at - ao) + ap.digitsRight;
            if (ax < ak) {
                ak = ax;
                ar = ao;
                av = ap.digitsRight
            } else {
                if (ax === ak) {
                    if (ap.digitsRight < av) {
                        ar = ao;
                        av = ap.digitsRight
                    }
                }
            }
        }
        aw = Math.max(av, Math.max(ay(al).digitsRight, ay(au).digitsRight));
        if (aw === 0) {
            an = "%d"
        } else {
            an = "%." + aw + "f"
        }
        ax = ah / (ar - 1);
        return [al, au, ar, an, ax]
    }
    function W(ai, al) {
        al = al || 7;
        var ak = ai / (al - 1);
        var aj = Math.pow(10, Math.floor(Math.log(ak) / Math.LN10));
        var am = ak / aj;
        var ah;
        if (aj < 1) {
            if (am > 5) {
                ah = 10 * aj
            } else {
                if (am > 2) {
                    ah = 5 * aj
                } else {
                    if (am > 1) {
                        ah = 2 * aj
                    } else {
                        ah = aj
                    }
                }
            }
        } else {
            if (am > 5) {
                ah = 10 * aj
            } else {
                if (am > 4) {
                    ah = 5 * aj
                } else {
                    if (am > 3) {
                        ah = 4 * aj
                    } else {
                        if (am > 2) {
                            ah = 3 * aj
                        } else {
                            if (am > 1) {
                                ah = 2 * aj
                            } else {
                                ah = aj
                            }
                        }
                    }
                }
            }
        }
        return ah
    }
    function Q(ai, ah) {
        ah = ah || 1;
        var ak = Math.floor(Math.log(ai) / Math.LN10);
        var am = Math.pow(10, ak);
        var al = ai / am;
        var aj;
        al = al / ah;
        if (al <= 0.38) {
            aj = 0.1
        } else {
            if (al <= 1.6) {
                aj = 0.2
            } else {
                if (al <= 4) {
                    aj = 0.5
                } else {
                    if (al <= 8) {
                        aj = 1
                    } else {
                        if (al <= 16) {
                            aj = 2
                        } else {
                            aj = 5
                        }
                    }
                }
            }
        }
        return aj * am
    }
    function x(aj, ai) {
        var al = Math.floor(Math.log(aj) / Math.LN10);
        var an = Math.pow(10, al);
        var am = aj / an;
        var ah;
        var ak;
        am = am / ai;
        if (am <= 0.38) {
            ak = 0.1
        } else {
            if (am <= 1.6) {
                ak = 0.2
            } else {
                if (am <= 4) {
                    ak = 0.5
                } else {
                    if (am <= 8) {
                        ak = 1
                    } else {
                        if (am <= 16) {
                            ak = 2
                        } else {
                            ak = 5
                        }
                    }
                }
            }
        }
        ah = ak * an;
        return [ah, ak, an]
    }
    L.jqplot.LinearTickGenerator = function(an, aq, aj, ak, ao, ar) {
        ao = (ao === null) ? false : ao;
        ar = (ar === null || ao) ? false : ar;
        if (an === aq) {
            aq = (aq) ? 0 : 1
        }
        aj = aj || 1;
        if (aq < an) {
            var at = aq;
            aq = an;
            an = at
        }
        var ai = [];
        var aw = Q(aq - an, aj);
        var av = L.jqplot.getSignificantFigures;
        if (ak == null) {
            if (!ao && !ar) {
                ai[0] = Math.floor(an / aw) * aw;
                ai[1] = Math.ceil(aq / aw) * aw;
                ai[2] = Math.round((ai[1] - ai[0]) / aw + 1);
                ai[3] = i(aw);
                ai[4] = aw
            } else {
                if (ao) {
                    ai[0] = an;
                    ai[2] = Math.ceil((aq - an) / aw + 1);
                    ai[1] = an + (ai[2] - 1) * aw;
                    var au = av(an).digitsRight;
                    var ap = av(aw).digitsRight;
                    if (au < ap) {
                        ai[3] = i(aw)
                    } else {
                        ai[3] = "%." + au + "f"
                    }
                    ai[4] = aw
                } else {
                    if (ar) {
                        ai[1] = aq;
                        ai[2] = Math.ceil((aq - an) / aw + 1);
                        ai[0] = aq - (ai[2] - 1) * aw;
                        var al = av(aq).digitsRight;
                        var ap = av(aw).digitsRight;
                        if (al < ap) {
                            ai[3] = i(aw)
                        } else {
                            ai[3] = "%." + al + "f"
                        }
                        ai[4] = aw
                    }
                }
            }
        } else {
            var am = [];
            am[0] = Math.floor(an / aw) * aw;
            am[1] = Math.ceil(aq / aw) * aw;
            am[2] = Math.round((am[1] - am[0]) / aw + 1);
            am[3] = i(aw);
            am[4] = aw;
            if (am[2] === ak) {
                ai = am
            } else {
                var ah = W(am[1] - am[0], ak);
                ai[0] = am[0];
                ai[2] = ak;
                ai[4] = ah;
                ai[3] = i(ah);
                ai[1] = ai[0] + (ai[2] - 1) * ai[4]
            }
        }
        return ai
    }
    ;
    L.jqplot.LinearTickGenerator.bestLinearInterval = Q;
    L.jqplot.LinearTickGenerator.bestInterval = W;
    L.jqplot.LinearTickGenerator.bestLinearComponents = x;
    L.jqplot.LinearTickGenerator.bestConstrainedInterval = d;
    L.jqplot.MarkerRenderer = function(ah) {
        this.show = true;
        this.style = "filledCircle";
        this.lineWidth = 2;
        this.size = 9;
        this.color = "#666666";
        this.shadow = true;
        this.shadowAngle = 45;
        this.shadowOffset = 1;
        this.shadowDepth = 3;
        this.shadowAlpha = "0.07";
        this.shadowRenderer = new L.jqplot.ShadowRenderer();
        this.shapeRenderer = new L.jqplot.ShapeRenderer();
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.init = function(ah) {
        L.extend(true, this, ah);
        var aj = {
            angle: this.shadowAngle,
            offset: this.shadowOffset,
            alpha: this.shadowAlpha,
            lineWidth: this.lineWidth,
            depth: this.shadowDepth,
            closePath: true
        };
        if (this.style.indexOf("filled") != -1) {
            aj.fill = true
        }
        if (this.style.indexOf("ircle") != -1) {
            aj.isarc = true;
            aj.closePath = false
        }
        this.shadowRenderer.init(aj);
        var ai = {
            fill: false,
            isarc: false,
            strokeStyle: this.color,
            fillStyle: this.color,
            lineWidth: this.lineWidth,
            closePath: true
        };
        if (this.style.indexOf("filled") != -1) {
            ai.fill = true
        }
        if (this.style.indexOf("ircle") != -1) {
            ai.isarc = true;
            ai.closePath = false
        }
        this.shapeRenderer.init(ai)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.drawDiamond = function(aj, ai, am, al, ao) {
        var ah = 1.2;
        var ap = this.size / 2 / ah;
        var an = this.size / 2 * ah;
        var ak = [[aj - ap, ai], [aj, ai + an], [aj + ap, ai], [aj, ai - an]];
        if (this.shadow) {
            this.shadowRenderer.draw(am, ak)
        }
        this.shapeRenderer.draw(am, ak, ao)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.drawPlus = function(ak, aj, an, am, aq) {
        var ai = 1;
        var ar = this.size / 2 * ai;
        var ao = this.size / 2 * ai;
        var ap = [[ak, aj - ao], [ak, aj + ao]];
        var al = [[ak + ar, aj], [ak - ar, aj]];
        var ah = L.extend(true, {}, this.options, {
            closePath: false
        });
        if (this.shadow) {
            this.shadowRenderer.draw(an, ap, {
                closePath: false
            });
            this.shadowRenderer.draw(an, al, {
                closePath: false
            })
        }
        this.shapeRenderer.draw(an, ap, ah);
        this.shapeRenderer.draw(an, al, ah)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.drawX = function(ak, aj, an, am, aq) {
        var ai = 1;
        var ar = this.size / 2 * ai;
        var ao = this.size / 2 * ai;
        var ah = L.extend(true, {}, this.options, {
            closePath: false
        });
        var ap = [[ak - ar, aj - ao], [ak + ar, aj + ao]];
        var al = [[ak - ar, aj + ao], [ak + ar, aj - ao]];
        if (this.shadow) {
            this.shadowRenderer.draw(an, ap, {
                closePath: false
            });
            this.shadowRenderer.draw(an, al, {
                closePath: false
            })
        }
        this.shapeRenderer.draw(an, ap, ah);
        this.shapeRenderer.draw(an, al, ah)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.drawDash = function(aj, ai, am, al, ao) {
        var ah = 1;
        var ap = this.size / 2 * ah;
        var an = this.size / 2 * ah;
        var ak = [[aj - ap, ai], [aj + ap, ai]];
        if (this.shadow) {
            this.shadowRenderer.draw(am, ak)
        }
        this.shapeRenderer.draw(am, ak, ao)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.drawLine = function(am, al, ah, ak, ai) {
        var aj = [am, al];
        if (this.shadow) {
            this.shadowRenderer.draw(ah, aj)
        }
        this.shapeRenderer.draw(ah, aj, ai)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.drawSquare = function(aj, ai, am, al, ao) {
        var ah = 1;
        var ap = this.size / 2 / ah;
        var an = this.size / 2 * ah;
        var ak = [[aj - ap, ai - an], [aj - ap, ai + an], [aj + ap, ai + an], [aj + ap, ai - an]];
        if (this.shadow) {
            this.shadowRenderer.draw(am, ak)
        }
        this.shapeRenderer.draw(am, ak, ao)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.drawCircle = function(ai, ao, ak, an, al) {
        var ah = this.size / 2;
        var aj = 2 * Math.PI;
        var am = [ai, ao, ah, 0, aj, true];
        if (this.shadow) {
            this.shadowRenderer.draw(ak, am)
        }
        this.shapeRenderer.draw(ak, am, al)
    }
    ;
    L.jqplot.MarkerRenderer.prototype.draw = function(ah, ak, ai, aj) {
        aj = aj || {};
        if (aj.show == null || aj.show != false) {
            if (aj.color && !aj.fillStyle) {
                aj.fillStyle = aj.color
            }
            if (aj.color && !aj.strokeStyle) {
                aj.strokeStyle = aj.color
            }
            switch (this.style) {
            case "diamond":
                this.drawDiamond(ah, ak, ai, false, aj);
                break;
            case "filledDiamond":
                this.drawDiamond(ah, ak, ai, true, aj);
                break;
            case "circle":
                this.drawCircle(ah, ak, ai, false, aj);
                break;
            case "filledCircle":
                this.drawCircle(ah, ak, ai, true, aj);
                break;
            case "square":
                this.drawSquare(ah, ak, ai, false, aj);
                break;
            case "filledSquare":
                this.drawSquare(ah, ak, ai, true, aj);
                break;
            case "x":
                this.drawX(ah, ak, ai, true, aj);
                break;
            case "plus":
                this.drawPlus(ah, ak, ai, true, aj);
                break;
            case "dash":
                this.drawDash(ah, ak, ai, true, aj);
                break;
            case "line":
                this.drawLine(ah, ak, ai, false, aj);
                break;
            default:
                this.drawDiamond(ah, ak, ai, false, aj);
                break
            }
        }
    }
    ;
    L.jqplot.ShadowRenderer = function(ah) {
        this.angle = 45;
        this.offset = 1;
        this.alpha = 0.07;
        this.lineWidth = 1.5;
        this.lineJoin = "miter";
        this.lineCap = "round";
        this.closePath = false;
        this.fill = false;
        this.depth = 3;
        this.strokeStyle = "rgba(0,0,0,0.1)";
        this.isarc = false;
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.ShadowRenderer.prototype.init = function(ah) {
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.ShadowRenderer.prototype.draw = function(av, at, ax) {
        av.save();
        var ah = (ax != null) ? ax : {};
        var au = (ah.fill != null) ? ah.fill : this.fill;
        var ap = (ah.fillRect != null) ? ah.fillRect : this.fillRect;
        var ao = (ah.closePath != null) ? ah.closePath : this.closePath;
        var al = (ah.offset != null) ? ah.offset : this.offset;
        var aj = (ah.alpha != null) ? ah.alpha : this.alpha;
        var an = (ah.depth != null) ? ah.depth : this.depth;
        var aw = (ah.isarc != null) ? ah.isarc : this.isarc;
        var aq = (ah.linePattern != null) ? ah.linePattern : this.linePattern;
        av.lineWidth = (ah.lineWidth != null) ? ah.lineWidth : this.lineWidth;
        av.lineJoin = (ah.lineJoin != null) ? ah.lineJoin : this.lineJoin;
        av.lineCap = (ah.lineCap != null) ? ah.lineCap : this.lineCap;
        av.strokeStyle = ah.strokeStyle || this.strokeStyle || "rgba(0,0,0," + aj + ")";
        av.fillStyle = ah.fillStyle || this.fillStyle || "rgba(0,0,0," + aj + ")";
        for (var ak = 0; ak < an; ak++) {
            var ar = L.jqplot.LinePattern(av, aq);
            av.translate(Math.cos(this.angle * Math.PI / 180) * al, Math.sin(this.angle * Math.PI / 180) * al);
            ar.beginPath();
            if (aw) {
                av.arc(at[0], at[1], at[2], at[3], at[4], true)
            } else {
                if (ap) {
                    if (ap) {
                        av.fillRect(at[0], at[1], at[2], at[3])
                    }
                } else {
                    if (at && at.length) {
                        var ai = true;
                        for (var am = 0; am < at.length; am++) {
                            if (at[am][0] != null && at[am][1] != null) {
                                if (ai) {
                                    ar.moveTo(at[am][0], at[am][1]);
                                    ai = false
                                } else {
                                    ar.lineTo(at[am][0], at[am][1])
                                }
                            } else {
                                ai = true
                            }
                        }
                    }
                }
            }
            if (ao) {
                ar.closePath()
            }
            if (au) {
                av.fill()
            } else {
                av.stroke()
            }
        }
        av.restore()
    }
    ;
    L.jqplot.ShapeRenderer = function(ah) {
        this.lineWidth = 1.5;
        this.linePattern = "solid";
        this.lineJoin = "miter";
        this.lineCap = "round";
        this.closePath = false;
        this.fill = false;
        this.isarc = false;
        this.fillRect = false;
        this.strokeRect = false;
        this.clearRect = false;
        this.strokeStyle = "#999999";
        this.fillStyle = "#999999";
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.ShapeRenderer.prototype.init = function(ah) {
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.ShapeRenderer.prototype.draw = function(at, aq, av) {
        at.save();
        var ah = (av != null) ? av : {};
        var ar = (ah.fill != null) ? ah.fill : this.fill;
        var am = (ah.closePath != null) ? ah.closePath : this.closePath;
        var an = (ah.fillRect != null) ? ah.fillRect : this.fillRect;
        var ak = (ah.strokeRect != null) ? ah.strokeRect : this.strokeRect;
        var ai = (ah.clearRect != null) ? ah.clearRect : this.clearRect;
        var au = (ah.isarc != null) ? ah.isarc : this.isarc;
        var ao = (ah.linePattern != null) ? ah.linePattern : this.linePattern;
        var ap = L.jqplot.LinePattern(at, ao);
        at.lineWidth = ah.lineWidth || this.lineWidth;
        at.lineJoin = ah.lineJoin || this.lineJoin;
        at.lineCap = ah.lineCap || this.lineCap;
        at.strokeStyle = (ah.strokeStyle || ah.color) || this.strokeStyle;
        at.fillStyle = ah.fillStyle || this.fillStyle;
        at.beginPath();
        if (au) {
            at.arc(aq[0], aq[1], aq[2], aq[3], aq[4], true);
            if (am) {
                at.closePath()
            }
            if (ar) {
                at.fill()
            } else {
                at.stroke()
            }
            at.restore();
            return
        } else {
            if (ai) {
                at.clearRect(aq[0], aq[1], aq[2], aq[3]);
                at.restore();
                return
            } else {
                if (an || ak) {
                    if (an) {
                        at.fillRect(aq[0], aq[1], aq[2], aq[3])
                    }
                    if (ak) {
                        at.strokeRect(aq[0], aq[1], aq[2], aq[3]);
                        at.restore();
                        return
                    }
                } else {
                    if (aq && aq.length) {
                        var aj = true;
                        for (var al = 0; al < aq.length; al++) {
                            if (aq[al][0] != null && aq[al][1] != null) {
                                if (aj) {
                                    ap.moveTo(aq[al][0], aq[al][1]);
                                    aj = false
                                } else {
                                    ap.lineTo(aq[al][0], aq[al][1])
                                }
                            } else {
                                aj = true
                            }
                        }
                        if (am) {
                            ap.closePath()
                        }
                        if (ar) {
                            at.fill()
                        } else {
                            at.stroke()
                        }
                    }
                }
            }
        }
        at.restore()
    }
    ;
    L.jqplot.TableLegendRenderer = function() {}
    ;
    L.jqplot.TableLegendRenderer.prototype.init = function(ah) {
        L.extend(true, this, ah)
    }
    ;
    L.jqplot.TableLegendRenderer.prototype.addrow = function(aq, ak, ah, ao) {
        var al = (ah) ? this.rowSpacing + "px" : "0px";
        var ap;
        var aj;
        var ai;
        var an;
        var am;
        ai = document.createElement("tr");
        ap = L(ai);
        ap.addClass("jqplot-table-legend");
        ai = null;
        if (ao) {
            ap.prependTo(this._elem)
        } else {
            ap.appendTo(this._elem)
        }
        if (this.showSwatches) {
            aj = L(document.createElement("td"));
            aj.addClass("jqplot-table-legend jqplot-table-legend-swatch");
            aj.css({
                textAlign: "center",
                paddingTop: al
            });
            an = L(document.createElement("div"));
            an.addClass("jqplot-table-legend-swatch-outline");
            am = L(document.createElement("div"));
            am.addClass("jqplot-table-legend-swatch");
            am.css({
                backgroundColor: ak,
                borderColor: ak
            });
            ap.append(aj.append(an.append(am)))
        }
        if (this.showLabels) {
            aj = L(document.createElement("td"));
            aj.addClass("jqplot-table-legend jqplot-table-legend-label");
            aj.css("paddingTop", al);
            ap.append(aj);
            if (this.escapeHtml) {
                aj.text(aq)
            } else {
                aj.html(aq)
            }
        }
        aj = null;
        an = null;
        am = null;
        ap = null;
        ai = null
    }
    ;
    L.jqplot.TableLegendRenderer.prototype.draw = function() {
        if (this._elem) {
            this._elem.emptyForce();
            this._elem = null
        }
        if (this.show) {
            var am = this._series;
            var ai = document.createElement("table");
            this._elem = L(ai);
            this._elem.addClass("jqplot-table-legend");
            var ar = {
                position: "absolute"
            };
            if (this.background) {
                ar.background = this.background
            }
            if (this.border) {
                ar.border = this.border
            }
            if (this.fontSize) {
                ar.fontSize = this.fontSize
            }
            if (this.fontFamily) {
                ar.fontFamily = this.fontFamily
            }
            if (this.textColor) {
                ar.textColor = this.textColor
            }
            if (this.marginTop != null) {
                ar.marginTop = this.marginTop
            }
            if (this.marginBottom != null) {
                ar.marginBottom = this.marginBottom
            }
            if (this.marginLeft != null) {
                ar.marginLeft = this.marginLeft
            }
            if (this.marginRight != null) {
                ar.marginRight = this.marginRight
            }
            var ah = false, ao = false, aq;
            for (var an = 0; an < am.length; an++) {
                aq = am[an];
                if (aq._stack || aq.renderer.constructor == L.jqplot.BezierCurveRenderer) {
                    ao = true
                }
                if (aq.show && aq.showLabel) {
                    var al = this.labels[an] || aq.label.toString();
                    if (al) {
                        var aj = aq.color;
                        if (ao && an < am.length - 1) {
                            ah = true
                        } else {
                            if (ao && an == am.length - 1) {
                                ah = false
                            }
                        }
                        this.renderer.addrow.call(this, al, aj, ah, ao);
                        ah = true
                    }
                    for (var ak = 0; ak < L.jqplot.addLegendRowHooks.length; ak++) {
                        var ap = L.jqplot.addLegendRowHooks[ak].call(this, aq);
                        if (ap) {
                            this.renderer.addrow.call(this, ap.label, ap.color, ah);
                            ah = true
                        }
                    }
                    al = null
                }
            }
        }
        return this._elem
    }
    ;
    L.jqplot.TableLegendRenderer.prototype.pack = function(aj) {
        if (this.show) {
            if (this.placement == "insideGrid") {
                switch (this.location) {
                case "nw":
                    var ai = aj.left;
                    var ah = aj.top;
                    this._elem.css("left", ai);
                    this._elem.css("top", ah);
                    break;
                case "n":
                    var ai = (aj.left + (this._plotDimensions.width - aj.right)) / 2 - this.getWidth() / 2;
                    var ah = aj.top;
                    this._elem.css("left", ai);
                    this._elem.css("top", ah);
                    break;
                case "ne":
                    var ai = aj.right;
                    var ah = aj.top;
                    this._elem.css({
                        right: ai,
                        top: ah
                    });
                    break;
                case "e":
                    var ai = aj.right;
                    var ah = (aj.top + (this._plotDimensions.height - aj.bottom)) / 2 - this.getHeight() / 2;
                    this._elem.css({
                        right: ai,
                        top: ah
                    });
                    break;
                case "se":
                    var ai = aj.right;
                    var ah = aj.bottom;
                    this._elem.css({
                        right: ai,
                        bottom: ah
                    });
                    break;
                case "s":
                    var ai = (aj.left + (this._plotDimensions.width - aj.right)) / 2 - this.getWidth() / 2;
                    var ah = aj.bottom;
                    this._elem.css({
                        left: ai,
                        bottom: ah
                    });
                    break;
                case "sw":
                    var ai = aj.left;
                    var ah = aj.bottom;
                    this._elem.css({
                        left: ai,
                        bottom: ah
                    });
                    break;
                case "w":
                    var ai = aj.left;
                    var ah = (aj.top + (this._plotDimensions.height - aj.bottom)) / 2 - this.getHeight() / 2;
                    this._elem.css({
                        left: ai,
                        top: ah
                    });
                    break;
                default:
                    var ai = aj.right;
                    var ah = aj.bottom;
                    this._elem.css({
                        right: ai,
                        bottom: ah
                    });
                    break
                }
            } else {
                if (this.placement == "outside") {
                    switch (this.location) {
                    case "nw":
                        var ai = this._plotDimensions.width - aj.left;
                        var ah = aj.top;
                        this._elem.css("right", ai);
                        this._elem.css("top", ah);
                        break;
                    case "n":
                        var ai = (aj.left + (this._plotDimensions.width - aj.right)) / 2 - this.getWidth() / 2;
                        var ah = this._plotDimensions.height - aj.top;
                        this._elem.css("left", ai);
                        this._elem.css("bottom", ah);
                        break;
                    case "ne":
                        var ai = this._plotDimensions.width - aj.right;
                        var ah = aj.top;
                        this._elem.css({
                            left: ai,
                            top: ah
                        });
                        break;
                    case "e":
                        var ai = this._plotDimensions.width - aj.right;
                        var ah = (aj.top + (this._plotDimensions.height - aj.bottom)) / 2 - this.getHeight() / 2;
                        this._elem.css({
                            left: ai,
                            top: ah
                        });
                        break;
                    case "se":
                        var ai = this._plotDimensions.width - aj.right;
                        var ah = aj.bottom;
                        this._elem.css({
                            left: ai,
                            bottom: ah
                        });
                        break;
                    case "s":
                        var ai = (aj.left + (this._plotDimensions.width - aj.right)) / 2 - this.getWidth() / 2;
                        var ah = this._plotDimensions.height - aj.bottom;
                        this._elem.css({
                            left: ai,
                            top: ah
                        });
                        break;
                    case "sw":
                        var ai = this._plotDimensions.width - aj.left;
                        var ah = aj.bottom;
                        this._elem.css({
                            right: ai,
                            bottom: ah
                        });
                        break;
                    case "w":
                        var ai = this._plotDimensions.width - aj.left;
                        var ah = (aj.top + (this._plotDimensions.height - aj.bottom)) / 2 - this.getHeight() / 2;
                        this._elem.css({
                            right: ai,
                            top: ah
                        });
                        break;
                    default:
                        var ai = aj.right;
                        var ah = aj.bottom;
                        this._elem.css({
                            right: ai,
                            bottom: ah
                        });
                        break
                    }
                } else {
                    switch (this.location) {
                    case "nw":
                        this._elem.css({
                            left: 0,
                            top: aj.top
                        });
                        break;
                    case "n":
                        var ai = (aj.left + (this._plotDimensions.width - aj.right)) / 2 - this.getWidth() / 2;
                        this._elem.css({
                            left: ai,
                            top: aj.top
                        });
                        break;
                    case "ne":
                        this._elem.css({
                            right: 0,
                            top: aj.top
                        });
                        break;
                    case "e":
                        var ah = (aj.top + (this._plotDimensions.height - aj.bottom)) / 2 - this.getHeight() / 2;
                        this._elem.css({
                            right: aj.right,
                            top: ah
                        });
                        break;
                    case "se":
                        this._elem.css({
                            right: aj.right,
                            bottom: aj.bottom
                        });
                        break;
                    case "s":
                        var ai = (aj.left + (this._plotDimensions.width - aj.right)) / 2 - this.getWidth() / 2;
                        this._elem.css({
                            left: ai,
                            bottom: aj.bottom
                        });
                        break;
                    case "sw":
                        this._elem.css({
                            left: aj.left,
                            bottom: aj.bottom
                        });
                        break;
                    case "w":
                        var ah = (aj.top + (this._plotDimensions.height - aj.bottom)) / 2 - this.getHeight() / 2;
                        this._elem.css({
                            left: aj.left,
                            top: ah
                        });
                        break;
                    default:
                        this._elem.css({
                            right: aj.right,
                            bottom: aj.bottom
                        });
                        break
                    }
                }
            }
        }
    }
    ;
    L.jqplot.ThemeEngine = function() {
        this.themes = {};
        this.activeTheme = null
    }
    ;
    L.jqplot.ThemeEngine.prototype.init = function() {
        var ak = new L.jqplot.Theme({
            _name: "Default"
        });
        var an, ai, am;
        for (an in ak.target) {
            if (an == "textColor") {
                ak.target[an] = this.target.css("color")
            } else {
                ak.target[an] = this.target.css(an)
            }
        }
        if (this.title.show && this.title._elem) {
            for (an in ak.title) {
                if (an == "textColor") {
                    ak.title[an] = this.title._elem.css("color")
                } else {
                    ak.title[an] = this.title._elem.css(an)
                }
            }
        }
        for (an in ak.grid) {
            ak.grid[an] = this.grid[an]
        }
        if (ak.grid.backgroundColor == null && this.grid.background != null) {
            ak.grid.backgroundColor = this.grid.background
        }
        if (this.legend.show && this.legend._elem) {
            for (an in ak.legend) {
                if (an == "textColor") {
                    ak.legend[an] = this.legend._elem.css("color")
                } else {
                    ak.legend[an] = this.legend._elem.css(an)
                }
            }
        }
        var aj;
        for (ai = 0; ai < this.series.length; ai++) {
            aj = this.series[ai];
            if (aj.renderer.constructor == L.jqplot.LineRenderer) {
                ak.series.push(new p())
            } else {
                if (aj.renderer.constructor == L.jqplot.BarRenderer) {
                    ak.series.push(new T())
                } else {
                    if (aj.renderer.constructor == L.jqplot.PieRenderer) {
                        ak.series.push(new f())
                    } else {
                        if (aj.renderer.constructor == L.jqplot.DonutRenderer) {
                            ak.series.push(new G())
                        } else {
                            if (aj.renderer.constructor == L.jqplot.FunnelRenderer) {
                                ak.series.push(new Z())
                            } else {
                                if (aj.renderer.constructor == L.jqplot.MeterGaugeRenderer) {
                                    ak.series.push(new D())
                                } else {
                                    ak.series.push({})
                                }
                            }
                        }
                    }
                }
            }
            for (an in ak.series[ai]) {
                ak.series[ai][an] = aj[an]
            }
        }
        var ah, al;
        for (an in this.axes) {
            al = this.axes[an];
            ah = ak.axes[an] = new P();
            ah.borderColor = al.borderColor;
            ah.borderWidth = al.borderWidth;
            if (al._ticks && al._ticks[0]) {
                for (am in ah.ticks) {
                    if (al._ticks[0].hasOwnProperty(am)) {
                        ah.ticks[am] = al._ticks[0][am]
                    } else {
                        if (al._ticks[0]._elem) {
                            ah.ticks[am] = al._ticks[0]._elem.css(am)
                        }
                    }
                }
            }
            if (al._label && al._label.show) {
                for (am in ah.label) {
                    if (al._label[am]) {
                        ah.label[am] = al._label[am]
                    } else {
                        if (al._label._elem) {
                            if (am == "textColor") {
                                ah.label[am] = al._label._elem.css("color")
                            } else {
                                ah.label[am] = al._label._elem.css(am)
                            }
                        }
                    }
                }
            }
        }
        this.themeEngine._add(ak);
        this.themeEngine.activeTheme = this.themeEngine.themes[ak._name]
    }
    ;
    L.jqplot.ThemeEngine.prototype.get = function(ah) {
        if (!ah) {
            return this.activeTheme
        } else {
            return this.themes[ah]
        }
    }
    ;
    function O(ai, ah) {
        return ai - ah
    }
    L.jqplot.ThemeEngine.prototype.getThemeNames = function() {
        var ah = [];
        for (var ai in this.themes) {
            ah.push(ai)
        }
        return ah.sort(O)
    }
    ;
    L.jqplot.ThemeEngine.prototype.getThemes = function() {
        var ai = [];
        var ah = [];
        for (var ak in this.themes) {
            ai.push(ak)
        }
        ai.sort(O);
        for (var aj = 0; aj < ai.length; aj++) {
            ah.push(this.themes[ai[aj]])
        }
        return ah
    }
    ;
    L.jqplot.ThemeEngine.prototype.activate = function(av, aB) {
        var ah = false;
        if (!aB && this.activeTheme && this.activeTheme._name) {
            aB = this.activeTheme._name
        }
        if (!this.themes.hasOwnProperty(aB)) {
            throw new Error("No theme of that name")
        } else {
            var am = this.themes[aB];
            this.activeTheme = am;
            var aA, at = false, ar = false;
            var ai = ["xaxis", "x2axis", "yaxis", "y2axis"];
            for (aw = 0; aw < ai.length; aw++) {
                var an = ai[aw];
                if (am.axesStyles.borderColor != null) {
                    av.axes[an].borderColor = am.axesStyles.borderColor
                }
                if (am.axesStyles.borderWidth != null) {
                    av.axes[an].borderWidth = am.axesStyles.borderWidth
                }
            }
            for (var az in av.axes) {
                var ak = av.axes[az];
                if (ak.show) {
                    var aq = am.axes[az] || {};
                    var ao = am.axesStyles;
                    var al = L.jqplot.extend(true, {}, aq, ao);
                    aA = (am.axesStyles.borderColor != null) ? am.axesStyles.borderColor : al.borderColor;
                    if (al.borderColor != null) {
                        ak.borderColor = al.borderColor;
                        ah = true
                    }
                    aA = (am.axesStyles.borderWidth != null) ? am.axesStyles.borderWidth : al.borderWidth;
                    if (al.borderWidth != null) {
                        ak.borderWidth = al.borderWidth;
                        ah = true
                    }
                    if (ak._ticks && ak._ticks[0]) {
                        for (var aj in al.ticks) {
                            aA = al.ticks[aj];
                            if (aA != null) {
                                ak.tickOptions[aj] = aA;
                                ak._ticks = [];
                                ah = true
                            }
                        }
                    }
                    if (ak._label && ak._label.show) {
                        for (var aj in al.label) {
                            aA = al.label[aj];
                            if (aA != null) {
                                ak.labelOptions[aj] = aA;
                                ah = true
                            }
                        }
                    }
                }
            }
            for (var au in am.grid) {
                if (am.grid[au] != null) {
                    av.grid[au] = am.grid[au]
                }
            }
            if (!ah) {
                av.grid.draw()
            }
            if (av.legend.show) {
                for (au in am.legend) {
                    if (am.legend[au] != null) {
                        av.legend[au] = am.legend[au]
                    }
                }
            }
            if (av.title.show) {
                for (au in am.title) {
                    if (am.title[au] != null) {
                        av.title[au] = am.title[au]
                    }
                }
            }
            var aw;
            for (aw = 0; aw < am.series.length; aw++) {
                var ap = {};
                var ay = false;
                for (au in am.series[aw]) {
                    aA = (am.seriesStyles[au] != null) ? am.seriesStyles[au] : am.series[aw][au];
                    if (aA != null) {
                        ap[au] = aA;
                        if (au == "color") {
                            av.series[aw].renderer.shapeRenderer.fillStyle = aA;
                            av.series[aw].renderer.shapeRenderer.strokeStyle = aA;
                            av.series[aw][au] = aA
                        } else {
                            if ((au == "lineWidth") || (au == "linePattern")) {
                                av.series[aw].renderer.shapeRenderer[au] = aA;
                                av.series[aw][au] = aA
                            } else {
                                if (au == "markerOptions") {
                                    V(av.series[aw].markerOptions, aA);
                                    V(av.series[aw].markerRenderer, aA)
                                } else {
                                    av.series[aw][au] = aA
                                }
                            }
                        }
                        ah = true
                    }
                }
            }
            if (ah) {
                av.target.empty();
                av.draw()
            }
            for (au in am.target) {
                if (am.target[au] != null) {
                    av.target.css(au, am.target[au])
                }
            }
        }
    }
    ;
    L.jqplot.ThemeEngine.prototype._add = function(ai, ah) {
        if (ah) {
            ai._name = ah
        }
        if (!ai._name) {
            ai._name = Date.parse(new Date())
        }
        if (!this.themes.hasOwnProperty(ai._name)) {
            this.themes[ai._name] = ai
        } else {
            throw new Error("jqplot.ThemeEngine Error: Theme already in use")
        }
    }
    ;
    L.jqplot.ThemeEngine.prototype.remove = function(ah) {
        if (ah == "Default") {
            return false
        }
        return delete this.themes[ah]
    }
    ;
    L.jqplot.ThemeEngine.prototype.newTheme = function(ah, aj) {
        if (typeof (ah) == "object") {
            aj = aj || ah;
            ah = null
        }
        if (aj && aj._name) {
            ah = aj._name
        } else {
            ah = ah || Date.parse(new Date())
        }
        var ai = this.copy(this.themes.Default._name, ah);
        L.jqplot.extend(ai, aj);
        return ai
    }
    ;
    function B(aj) {
        if (aj == null || typeof (aj) != "object") {
            return aj
        }
        var ah = new aj.constructor();
        for (var ai in aj) {
            ah[ai] = B(aj[ai])
        }
        return ah
    }
    L.jqplot.clone = B;
    function V(aj, ai) {
        if (ai == null || typeof (ai) != "object") {
            return
        }
        for (var ah in ai) {
            if (ah == "highlightColors") {
                aj[ah] = B(ai[ah])
            }
            if (ai[ah] != null && typeof (ai[ah]) == "object") {
                if (!aj.hasOwnProperty(ah)) {
                    aj[ah] = {}
                }
                V(aj[ah], ai[ah])
            } else {
                aj[ah] = ai[ah]
            }
        }
    }
    L.jqplot.merge = V;
    L.jqplot.extend = function() {
        var am = arguments[0] || {}, ak = 1, al = arguments.length, ah = false, aj;
        if (typeof am === "boolean") {
            ah = am;
            am = arguments[1] || {};
            ak = 2
        }
        if (typeof am !== "object" && !toString.call(am) === "[object Function]") {
            am = {}
        }
        for (; ak < al; ak++) {
            if ((aj = arguments[ak]) != null) {
                for (var ai in aj) {
                    if (ai === "__proto__" || ai === "constructor") {
                        continue;
                    }
                    var an = am[ai]
                      , ao = aj[ai];
                    if (am === ao) {
                        continue
                    }
                    if (ah && ao && typeof ao === "object" && !ao.nodeType) {
                        am[ai] = L.jqplot.extend(ah, an || (ao.length != null ? [] : {}), ao)
                    } else {
                        if (ao !== u) {
                            am[ai] = ao
                        }
                    }
                }
            }
        }
        return am
    }
    ;
    L.jqplot.ThemeEngine.prototype.rename = function(ai, ah) {
        if (ai == "Default" || ah == "Default") {
            throw new Error("jqplot.ThemeEngine Error: Cannot rename from/to Default")
        }
        if (this.themes.hasOwnProperty(ah)) {
            throw new Error("jqplot.ThemeEngine Error: New name already in use.")
        } else {
            if (this.themes.hasOwnProperty(ai)) {
                var aj = this.copy(ai, ah);
                this.remove(ai);
                return aj
            }
        }
        throw new Error("jqplot.ThemeEngine Error: Old name or new name invalid")
    }
    ;
    L.jqplot.ThemeEngine.prototype.copy = function(ah, aj, al) {
        if (aj == "Default") {
            throw new Error("jqplot.ThemeEngine Error: Cannot copy over Default theme")
        }
        if (!this.themes.hasOwnProperty(ah)) {
            var ai = "jqplot.ThemeEngine Error: Source name invalid";
            throw new Error(ai)
        }
        if (this.themes.hasOwnProperty(aj)) {
            var ai = "jqplot.ThemeEngine Error: Target name invalid";
            throw new Error(ai)
        } else {
            var ak = B(this.themes[ah]);
            ak._name = aj;
            L.jqplot.extend(true, ak, al);
            this._add(ak);
            return ak
        }
    }
    ;
    L.jqplot.Theme = function(ah, ai) {
        if (typeof (ah) == "object") {
            ai = ai || ah;
            ah = null
        }
        ah = ah || Date.parse(new Date());
        this._name = ah;
        this.target = {
            backgroundColor: null
        };
        this.legend = {
            textColor: null,
            fontFamily: null,
            fontSize: null,
            border: null,
            background: null
        };
        this.title = {
            textColor: null,
            fontFamily: null,
            fontSize: null,
            textAlign: null
        };
        this.seriesStyles = {};
        this.series = [];
        this.grid = {
            drawGridlines: null,
            gridLineColor: null,
            gridLineWidth: null,
            backgroundColor: null,
            borderColor: null,
            borderWidth: null,
            shadow: null
        };
        this.axesStyles = {
            label: {},
            ticks: {}
        };
        this.axes = {};
        if (typeof (ai) == "string") {
            this._name = ai
        } else {
            if (typeof (ai) == "object") {
                L.jqplot.extend(true, this, ai)
            }
        }
    }
    ;
    var P = function() {
        this.borderColor = null;
        this.borderWidth = null;
        this.ticks = new o();
        this.label = new t()
    };
    var o = function() {
        this.show = null;
        this.showGridline = null;
        this.showLabel = null;
        this.showMark = null;
        this.size = null;
        this.textColor = null;
        this.whiteSpace = null;
        this.fontSize = null;
        this.fontFamily = null
    };
    var t = function() {
        this.textColor = null;
        this.whiteSpace = null;
        this.fontSize = null;
        this.fontFamily = null;
        this.fontWeight = null
    };
    var p = function() {
        this.color = null;
        this.lineWidth = null;
        this.linePattern = null;
        this.shadow = null;
        this.fillColor = null;
        this.showMarker = null;
        this.markerOptions = new I()
    };
    var I = function() {
        this.show = null;
        this.style = null;
        this.lineWidth = null;
        this.size = null;
        this.color = null;
        this.shadow = null
    };
    var T = function() {
        this.color = null;
        this.seriesColors = null;
        this.lineWidth = null;
        this.shadow = null;
        this.barPadding = null;
        this.barMargin = null;
        this.barWidth = null;
        this.highlightColors = null
    };
    var f = function() {
        this.seriesColors = null;
        this.padding = null;
        this.sliceMargin = null;
        this.fill = null;
        this.shadow = null;
        this.startAngle = null;
        this.lineWidth = null;
        this.highlightColors = null
    };
    var G = function() {
        this.seriesColors = null;
        this.padding = null;
        this.sliceMargin = null;
        this.fill = null;
        this.shadow = null;
        this.startAngle = null;
        this.lineWidth = null;
        this.innerDiameter = null;
        this.thickness = null;
        this.ringMargin = null;
        this.highlightColors = null
    };
    var Z = function() {
        this.color = null;
        this.lineWidth = null;
        this.shadow = null;
        this.padding = null;
        this.sectionMargin = null;
        this.seriesColors = null;
        this.highlightColors = null
    };
    var D = function() {
        this.padding = null;
        this.backgroundColor = null;
        this.ringColor = null;
        this.tickColor = null;
        this.ringWidth = null;
        this.intervalColors = null;
        this.intervalInnerRadius = null;
        this.intervalOuterRadius = null;
        this.hubRadius = null;
        this.needleThickness = null;
        this.needlePad = null
    };
    L.fn.jqplotChildText = function() {
        return L(this).contents().filter(function() {
            return this.nodeType == 3
        }).text()
    }
    ;
    L.fn.jqplotGetComputedFontStyle = function() {
        var ak = window.getComputedStyle ? window.getComputedStyle(this[0], "") : this[0].currentStyle;
        var ai = ak["font-style"] ? ["font-style", "font-weight", "font-size", "font-family"] : ["fontStyle", "fontWeight", "fontSize", "fontFamily"];
        var al = [];
        for (var aj = 0; aj < ai.length; ++aj) {
            var ah = String(ak[ai[aj]]);
            if (ah && ah != "normal") {
                al.push(ah)
            }
        }
        return al.join(" ")
    }
    ;
    L.fn.jqplotToImageCanvas = function(aj) {
        aj = aj || {};
        var av = (aj.x_offset == null) ? 0 : aj.x_offset;
        var ax = (aj.y_offset == null) ? 0 : aj.y_offset;
        var al = (aj.backgroundColor == null) ? "rgb(255,255,255)" : aj.backgroundColor;
        if (L(this).width() == 0 || L(this).height() == 0) {
            return null
        }
        if (L.jqplot.use_excanvas) {
            return null
        }
        var an = document.createElement("canvas");
        var aA = L(this).outerHeight(true);
        var at = L(this).outerWidth(true);
        var am = L(this).offset();
        var ao = am.left;
        var aq = am.top;
        var au = 0
          , ar = 0;
        var ay = ["jqplot-table-legend", "jqplot-xaxis-tick", "jqplot-x2axis-tick", "jqplot-yaxis-tick", "jqplot-y2axis-tick", "jqplot-y3axis-tick", "jqplot-y4axis-tick", "jqplot-y5axis-tick", "jqplot-y6axis-tick", "jqplot-y7axis-tick", "jqplot-y8axis-tick", "jqplot-y9axis-tick", "jqplot-xaxis-label", "jqplot-x2axis-label", "jqplot-yaxis-label", "jqplot-y2axis-label", "jqplot-y3axis-label", "jqplot-y4axis-label", "jqplot-y5axis-label", "jqplot-y6axis-label", "jqplot-y7axis-label", "jqplot-y8axis-label", "jqplot-y9axis-label"];
        var ap, ah, ai, aB;
        for (var az = 0; az < ay.length; az++) {
            L(this).find("." + ay[az]).each(function() {
                ap = L(this).offset().top - aq;
                ah = L(this).offset().left - ao;
                aB = ah + L(this).outerWidth(true) + au;
                ai = ap + L(this).outerHeight(true) + ar;
                if (ah < -au) {
                    at = at - au - ah;
                    au = -ah
                }
                if (ap < -ar) {
                    aA = aA - ar - ap;
                    ar = -ap
                }
                if (aB > at) {
                    at = aB
                }
                if (ai > aA) {
                    aA = ai
                }
            })
        }
        an.width = at + Number(av);
        an.height = aA + Number(ax);
        var ak = an.getContext("2d");
        ak.save();
        ak.fillStyle = al;
        ak.fillRect(0, 0, an.width, an.height);
        ak.restore();
        ak.translate(au, ar);
        ak.textAlign = "left";
        ak.textBaseline = "top";
        function aC(aE) {
            var aF = parseInt(L(aE).css("line-height"), 10);
            if (isNaN(aF)) {
                aF = parseInt(L(aE).css("font-size"), 10) * 1.2
            }
            return aF
        }
        function aD(aF, aE, aS, aG, aO, aH) {
            var aQ = aC(aF);
            var aK = L(aF).innerWidth();
            var aL = L(aF).innerHeight();
            var aN = aS.split(/\s+/);
            var aR = aN.length;
            var aP = "";
            var aM = [];
            var aU = aO;
            var aT = aG;
            for (var aJ = 0; aJ < aR; aJ++) {
                aP += aN[aJ];
                if (aE.measureText(aP).width > aK) {
                    aM.push(aJ);
                    aP = "";
                    aJ--
                }
            }
            if (aM.length === 0) {
                if (L(aF).css("textAlign") === "center") {
                    aT = aG + (aH - aE.measureText(aP).width) / 2 - au
                }
                aE.fillText(aS, aT, aO)
            } else {
                aP = aN.slice(0, aM[0]).join(" ");
                if (L(aF).css("textAlign") === "center") {
                    aT = aG + (aH - aE.measureText(aP).width) / 2 - au
                }
                aE.fillText(aP, aT, aU);
                aU += aQ;
                for (var aJ = 1, aI = aM.length; aJ < aI; aJ++) {
                    aP = aN.slice(aM[aJ - 1], aM[aJ]).join(" ");
                    if (L(aF).css("textAlign") === "center") {
                        aT = aG + (aH - aE.measureText(aP).width) / 2 - au
                    }
                    aE.fillText(aP, aT, aU);
                    aU += aQ
                }
                aP = aN.slice(aM[aJ - 1], aN.length).join(" ");
                if (L(aF).css("textAlign") === "center") {
                    aT = aG + (aH - aE.measureText(aP).width) / 2 - au
                }
                aE.fillText(aP, aT, aU)
            }
        }
        function aw(aG, aJ, aE) {
            var aN = aG.tagName.toLowerCase();
            var aF = L(aG).position();
            var aK = window.getComputedStyle ? window.getComputedStyle(aG, "") : aG.currentStyle;
            var aI = aJ + aF.left + parseInt(aK.marginLeft, 10) + parseInt(aK.borderLeftWidth, 10) + parseInt(aK.paddingLeft, 10);
            var aL = aE + aF.top + parseInt(aK.marginTop, 10) + parseInt(aK.borderTopWidth, 10) + parseInt(aK.paddingTop, 10);
            var aM = an.width;
            if ((aN == "div" || aN == "span") && !L(aG).hasClass("jqplot-highlighter-tooltip")) {
                L(aG).children().each(function() {
                    aw(this, aI, aL)
                });
                var aO = L(aG).jqplotChildText();
                if (aO) {
                    ak.font = L(aG).jqplotGetComputedFontStyle();
                    ak.fillStyle = L(aG).css("color");
                    aD(aG, ak, aO, aI, aL, aM)
                }
            } else {
                if (aN === "table" && L(aG).hasClass("jqplot-table-legend")) {
                    ak.strokeStyle = L(aG).css("border-top-color");
                    ak.fillStyle = L(aG).css("background-color");
                    ak.fillRect(aI, aL, L(aG).innerWidth(), L(aG).innerHeight());
                    if (parseInt(L(aG).css("border-top-width"), 10) > 0) {
                        ak.strokeRect(aI, aL, L(aG).innerWidth(), L(aG).innerHeight())
                    }
                    L(aG).find("div.jqplot-table-legend-swatch-outline").each(function() {
                        var aU = L(this);
                        ak.strokeStyle = aU.css("border-top-color");
                        var aQ = aI + aU.position().left;
                        var aR = aL + aU.position().top;
                        ak.strokeRect(aQ, aR, aU.innerWidth(), aU.innerHeight());
                        aQ += parseInt(aU.css("padding-left"), 10);
                        aR += parseInt(aU.css("padding-top"), 10);
                        var aT = aU.innerHeight() - 2 * parseInt(aU.css("padding-top"), 10);
                        var aP = aU.innerWidth() - 2 * parseInt(aU.css("padding-left"), 10);
                        var aS = aU.children("div.jqplot-table-legend-swatch");
                        ak.fillStyle = aS.css("background-color");
                        ak.fillRect(aQ, aR, aP, aT)
                    });
                    L(aG).find("td.jqplot-table-legend-label").each(function() {
                        var aR = L(this);
                        var aP = aI + aR.position().left;
                        var aQ = aL + aR.position().top + parseInt(aR.css("padding-top"), 10);
                        ak.font = aR.jqplotGetComputedFontStyle();
                        ak.fillStyle = aR.css("color");
                        aD(aR, ak, aR.text(), aP, aQ, aM)
                    });
                    var aH = null
                } else {
                    if (aN == "canvas") {
                        ak.drawImage(aG, aI, aL)
                    }
                }
            }
        }
        L(this).children().each(function() {
            aw(this, av, ax)
        });
        return an
    }
    ;
    L.fn.jqplotToImageStr = function(ai) {
        var ah = L(this).jqplotToImageCanvas(ai);
        if (ah) {
            return ah.toDataURL("image/png")
        } else {
            return null
        }
    }
    ;
    L.fn.jqplotToImageElem = function(ah) {
        var ai = document.createElement("img");
        var aj = L(this).jqplotToImageStr(ah);
        ai.src = aj;
        return ai
    }
    ;
    L.fn.jqplotToImageElemStr = function(ah) {
        var ai = "<img src=" + L(this).jqplotToImageStr(ah) + " />";
        return ai
    }
    ;
    L.fn.jqplotSaveImage = function() {
        var ah = L(this).jqplotToImageStr({});
        if (ah) {
            window.location.href = ah.replace("image/png", "image/octet-stream")
        }
    }
    ;
    L.fn.jqplotViewImage = function() {
        var ai = L(this).jqplotToImageElemStr({});
        var aj = L(this).jqplotToImageStr({});
        if (ai) {
            var ah = window.open("");
            ah.document.open("image/png");
            ah.document.write(ai);
            ah.document.close();
            ah = null
        }
    }
    ;
    var ag = function() {
        this.syntax = ag.config.syntax;
        this._type = "jsDate";
        this.proxy = new Date();
        this.options = {};
        this.locale = ag.regional.getLocale();
        this.formatString = "";
        this.defaultCentury = ag.config.defaultCentury;
        switch (arguments.length) {
        case 0:
            break;
        case 1:
            if (l(arguments[0]) == "[object Object]" && arguments[0]._type != "jsDate") {
                var aj = this.options = arguments[0];
                this.syntax = aj.syntax || this.syntax;
                this.defaultCentury = aj.defaultCentury || this.defaultCentury;
                this.proxy = ag.createDate(aj.date)
            } else {
                this.proxy = ag.createDate(arguments[0])
            }
            break;
        default:
            var ah = [];
            for (var ai = 0; ai < arguments.length; ai++) {
                ah.push(arguments[ai])
            }
            this.proxy = new Date();
            this.proxy.setFullYear.apply(this.proxy, ah.slice(0, 3));
            if (ah.slice(3).length) {
                this.proxy.setHours.apply(this.proxy, ah.slice(3))
            }
            break
        }
    };
    ag.config = {
        defaultLocale: "en",
        syntax: "perl",
        defaultCentury: 1900
    };
    ag.prototype.add = function(aj, ai) {
        var ah = E[ai] || E.day;
        if (typeof ah == "number") {
            this.proxy.setTime(this.proxy.getTime() + (ah * aj))
        } else {
            ah.add(this, aj)
        }
        return this
    }
    ;
    ag.prototype.clone = function() {
        return new ag(this.proxy.getTime())
    }
    ;
    ag.prototype.getUtcOffset = function() {
        return this.proxy.getTimezoneOffset() * 60000
    }
    ;
    ag.prototype.diff = function(ai, al, ah) {
        ai = new ag(ai);
        if (ai === null) {
            return null
        }
        var aj = E[al] || E.day;
        if (typeof aj == "number") {
            var ak = (this.proxy.getTime() - ai.proxy.getTime()) / aj
        } else {
            var ak = aj.diff(this.proxy, ai.proxy)
        }
        return (ah ? ak : Math[ak > 0 ? "floor" : "ceil"](ak))
    }
    ;
    ag.prototype.getAbbrDayName = function() {
        return ag.regional[this.locale]["dayNamesShort"][this.proxy.getDay()]
    }
    ;
    ag.prototype.getAbbrMonthName = function() {
        return ag.regional[this.locale]["monthNamesShort"][this.proxy.getMonth()]
    }
    ;
    ag.prototype.getAMPM = function() {
        return this.proxy.getHours() >= 12 ? "PM" : "AM"
    }
    ;
    ag.prototype.getAmPm = function() {
        return this.proxy.getHours() >= 12 ? "pm" : "am"
    }
    ;
    ag.prototype.getCentury = function() {
        return parseInt(this.proxy.getFullYear() / 100, 10)
    }
    ;
    ag.prototype.getDate = function() {
        return this.proxy.getDate()
    }
    ;
    ag.prototype.getDay = function() {
        return this.proxy.getDay()
    }
    ;
    ag.prototype.getDayOfWeek = function() {
        var ah = this.proxy.getDay();
        return ah === 0 ? 7 : ah
    }
    ;
    ag.prototype.getDayOfYear = function() {
        var ai = this.proxy;
        var ah = ai - new Date("" + ai.getFullYear() + "/1/1 GMT");
        ah += ai.getTimezoneOffset() * 60000;
        ai = null;
        return parseInt(ah / 60000 / 60 / 24, 10) + 1
    }
    ;
    ag.prototype.getDayName = function() {
        return ag.regional[this.locale]["dayNames"][this.proxy.getDay()]
    }
    ;
    ag.prototype.getFullWeekOfYear = function() {
        var ak = this.proxy;
        var ah = this.getDayOfYear();
        var aj = 6 - ak.getDay();
        var ai = parseInt((ah + aj) / 7, 10);
        return ai
    }
    ;
    ag.prototype.getFullYear = function() {
        return this.proxy.getFullYear()
    }
    ;
    ag.prototype.getGmtOffset = function() {
        var ah = this.proxy.getTimezoneOffset() / 60;
        var ai = ah < 0 ? "+" : "-";
        ah = Math.abs(ah);
        return ai + N(Math.floor(ah), 2) + ":" + N((ah % 1) * 60, 2)
    }
    ;
    ag.prototype.getHours = function() {
        return this.proxy.getHours()
    }
    ;
    ag.prototype.getHours12 = function() {
        var ah = this.proxy.getHours();
        return ah > 12 ? ah - 12 : (ah == 0 ? 12 : ah)
    }
    ;
    ag.prototype.getIsoWeek = function() {
        var ak = this.proxy;
        var aj = this.getWeekOfYear();
        var ah = (new Date("" + ak.getFullYear() + "/1/1")).getDay();
        var ai = aj + (ah > 4 || ah <= 1 ? 0 : 1);
        if (ai == 53 && (new Date("" + ak.getFullYear() + "/12/31")).getDay() < 4) {
            ai = 1
        } else {
            if (ai === 0) {
                ak = new ag(new Date("" + (ak.getFullYear() - 1) + "/12/31"));
                ai = ak.getIsoWeek()
            }
        }
        ak = null;
        return ai
    }
    ;
    ag.prototype.getMilliseconds = function() {
        return this.proxy.getMilliseconds()
    }
    ;
    ag.prototype.getMinutes = function() {
        return this.proxy.getMinutes()
    }
    ;
    ag.prototype.getMonth = function() {
        return this.proxy.getMonth()
    }
    ;
    ag.prototype.getMonthName = function() {
        return ag.regional[this.locale]["monthNames"][this.proxy.getMonth()]
    }
    ;
    ag.prototype.getMonthNumber = function() {
        return this.proxy.getMonth() + 1
    }
    ;
    ag.prototype.getSeconds = function() {
        return this.proxy.getSeconds()
    }
    ;
    ag.prototype.getShortYear = function() {
        return this.proxy.getYear() % 100
    }
    ;
    ag.prototype.getTime = function() {
        return this.proxy.getTime()
    }
    ;
    ag.prototype.getTimezoneAbbr = function() {
        return this.proxy.toString().replace(/^.*\(([^)]+)\)$/, "$1")
    }
    ;
    ag.prototype.getTimezoneName = function() {
        var ah = /(?:\((.+)\)$| ([A-Z]{3}) )/.exec(this.toString());
        return ah[1] || ah[2] || "GMT" + this.getGmtOffset()
    }
    ;
    ag.prototype.getTimezoneOffset = function() {
        return this.proxy.getTimezoneOffset()
    }
    ;
    ag.prototype.getWeekOfYear = function() {
        var ah = this.getDayOfYear();
        var aj = 7 - this.getDayOfWeek();
        var ai = parseInt((ah + aj) / 7, 10);
        return ai
    }
    ;
    ag.prototype.getUnix = function() {
        return Math.round(this.proxy.getTime() / 1000, 0)
    }
    ;
    ag.prototype.getYear = function() {
        return this.proxy.getYear()
    }
    ;
    ag.prototype.next = function(ah) {
        ah = ah || "day";
        return this.clone().add(1, ah)
    }
    ;
    ag.prototype.set = function() {
        switch (arguments.length) {
        case 0:
            this.proxy = new Date();
            break;
        case 1:
            if (l(arguments[0]) == "[object Object]" && arguments[0]._type != "jsDate") {
                var aj = this.options = arguments[0];
                this.syntax = aj.syntax || this.syntax;
                this.defaultCentury = aj.defaultCentury || this.defaultCentury;
                this.proxy = ag.createDate(aj.date)
            } else {
                this.proxy = ag.createDate(arguments[0])
            }
            break;
        default:
            var ah = [];
            for (var ai = 0; ai < arguments.length; ai++) {
                ah.push(arguments[ai])
            }
            this.proxy = new Date();
            this.proxy.setFullYear.apply(this.proxy, ah.slice(0, 3));
            if (ah.slice(3).length) {
                this.proxy.setHours.apply(this.proxy, ah.slice(3))
            }
            break
        }
        return this
    }
    ;
    ag.prototype.setDate = function(ah) {
        this.proxy.setDate(ah);
        return this
    }
    ;
    ag.prototype.setFullYear = function() {
        this.proxy.setFullYear.apply(this.proxy, arguments);
        return this
    }
    ;
    ag.prototype.setHours = function() {
        this.proxy.setHours.apply(this.proxy, arguments);
        return this
    }
    ;
    ag.prototype.setMilliseconds = function(ah) {
        this.proxy.setMilliseconds(ah);
        return this
    }
    ;
    ag.prototype.setMinutes = function() {
        this.proxy.setMinutes.apply(this.proxy, arguments);
        return this
    }
    ;
    ag.prototype.setMonth = function() {
        this.proxy.setMonth.apply(this.proxy, arguments);
        return this
    }
    ;
    ag.prototype.setSeconds = function() {
        this.proxy.setSeconds.apply(this.proxy, arguments);
        return this
    }
    ;
    ag.prototype.setTime = function(ah) {
        this.proxy.setTime(ah);
        return this
    }
    ;
    ag.prototype.setYear = function() {
        this.proxy.setYear.apply(this.proxy, arguments);
        return this
    }
    ;
    ag.prototype.strftime = function(ah) {
        ah = ah || this.formatString || ag.regional[this.locale]["formatString"];
        return ag.strftime(this, ah, this.syntax)
    }
    ;
    ag.prototype.toString = function() {
        return this.proxy.toString()
    }
    ;
    ag.prototype.toYmdInt = function() {
        return (this.proxy.getFullYear() * 10000) + (this.getMonthNumber() * 100) + this.proxy.getDate()
    }
    ;
    ag.regional = {
        en: {
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        fr: {
            monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
            dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        de: {
            monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            monthNamesShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
            dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
            dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        es: {
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            dayNames: ["Domingo", "Lunes", "Martes", "Mi&eacute;rcoles", "Jueves", "Viernes", "S&aacute;bado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mi&eacute;", "Juv", "Vie", "S&aacute;b"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        ru: {
            monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
            dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        ar: {
            monthNames: ["كانون الثاني", "شباط", "آذار", "نيسان", "آذار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"],
            monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            dayNames: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
            dayNamesShort: ["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        pt: {
            monthNames: ["Janeiro", "Fevereiro", "Mar&ccedil;o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            dayNames: ["Domingo", "Segunda-feira", "Ter&ccedil;a-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "S&aacute;bado"],
            dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "S&aacute;b"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        "pt-BR": {
            monthNames: ["Janeiro", "Fevereiro", "Mar&ccedil;o", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            dayNames: ["Domingo", "Segunda-feira", "Ter&ccedil;a-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "S&aacute;bado"],
            dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "S&aacute;b"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        pl: {
            monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
            monthNamesShort: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
            dayNames: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
            dayNamesShort: ["Ni", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        nl: {
            monthNames: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
            dayNames: ","["Zondag",
            "Maandag",
            "Dinsdag",
            "Woensdag",
            "Donderdag",
            "Vrijdag",
            "Zaterdag"],
            dayNamesShort: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
            formatString: "%Y-%m-%d %H:%M:%S"
        },
        sv: {
            monthNames: ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"],
            monthNamesShort: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
            dayNames: ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"],
            dayNamesShort: ["sön", "mån", "tis", "ons", "tor", "fre", "lör"],
            formatString: "%Y-%m-%d %H:%M:%S"
        }
    };
    ag.regional["en-US"] = ag.regional["en-GB"] = ag.regional.en;
    ag.regional.getLocale = function() {
        var ah = ag.config.defaultLocale;
        if (document && document.getElementsByTagName("html") && document.getElementsByTagName("html")[0].lang) {
            ah = document.getElementsByTagName("html")[0].lang;
            if (!ag.regional.hasOwnProperty(ah)) {
                ah = ag.config.defaultLocale
            }
        }
        return ah
    }
    ;
    var C = 24 * 60 * 60 * 1000;
    var N = function(ah, ak) {
        ah = String(ah);
        var ai = ak - ah.length;
        var aj = String(Math.pow(10, ai)).slice(1);
        return aj.concat(ah)
    };
    var E = {
        millisecond: 1,
        second: 1000,
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: C,
        week: 7 * C,
        month: {
            add: function(aj, ah) {
                E.year.add(aj, Math[ah > 0 ? "floor" : "ceil"](ah / 12));
                var ai = aj.getMonth() + (ah % 12);
                if (ai == 12) {
                    ai = 0;
                    aj.setYear(aj.getFullYear() + 1)
                } else {
                    if (ai == -1) {
                        ai = 11;
                        aj.setYear(aj.getFullYear() - 1)
                    }
                }
                aj.setMonth(ai)
            },
            diff: function(al, aj) {
                var ah = al.getFullYear() - aj.getFullYear();
                var ai = al.getMonth() - aj.getMonth() + (ah * 12);
                var ak = al.getDate() - aj.getDate();
                return ai + (ak / 30)
            }
        },
        year: {
            add: function(ai, ah) {
                ai.setYear(ai.getFullYear() + Math[ah > 0 ? "floor" : "ceil"](ah))
            },
            diff: function(ai, ah) {
                return E.month.diff(ai, ah) / 12
            }
        }
    };
    for (var Y in E) {
        if (Y.substring(Y.length - 1) != "s") {
            E[Y + "s"] = E[Y]
        }
    }
    var H = function(al, ak, ai) {
        if (ag.formats[ai]["shortcuts"][ak]) {
            return ag.strftime(al, ag.formats[ai]["shortcuts"][ak], ai)
        } else {
            var ah = (ag.formats[ai]["codes"][ak] || "").split(".");
            var aj = al["get" + ah[0]] ? al["get" + ah[0]]() : "";
            if (ah[1]) {
                aj = N(aj, ah[1])
            }
            return aj
        }
    };
    ag.strftime = function(an, ak, aj, ao) {
        var ai = "perl";
        var am = ag.regional.getLocale();
        if (aj && ag.formats.hasOwnProperty(aj)) {
            ai = aj
        } else {
            if (aj && ag.regional.hasOwnProperty(aj)) {
                am = aj
            }
        }
        if (ao && ag.formats.hasOwnProperty(ao)) {
            ai = ao
        } else {
            if (ao && ag.regional.hasOwnProperty(ao)) {
                am = ao
            }
        }
        if (l(an) != "[object Object]" || an._type != "jsDate") {
            an = new ag(an);
            an.locale = am
        }
        if (!ak) {
            ak = an.formatString || ag.regional[am]["formatString"]
        }
        var ah = ak || "%Y-%m-%d", ap = "", al;
        while (ah.length > 0) {
            if (al = ah.match(ag.formats[ai].codes.matcher)) {
                ap += ah.slice(0, al.index);
                ap += (al[1] || "") + H(an, al[2], ai);
                ah = ah.slice(al.index + al[0].length)
            } else {
                ap += ah;
                ah = ""
            }
        }
        return ap
    }
    ;
    ag.formats = {
        ISO: "%Y-%m-%dT%H:%M:%S.%N%G",
        SQL: "%Y-%m-%d %H:%M:%S"
    };
    ag.formats.perl = {
        codes: {
            matcher: /()%(#?(%|[a-z]))/i,
            Y: "FullYear",
            y: "ShortYear.2",
            m: "MonthNumber.2",
            "#m": "MonthNumber",
            B: "MonthName",
            b: "AbbrMonthName",
            d: "Date.2",
            "#d": "Date",
            e: "Date",
            A: "DayName",
            a: "AbbrDayName",
            w: "Day",
            H: "Hours.2",
            "#H": "Hours",
            I: "Hours12.2",
            "#I": "Hours12",
            p: "AMPM",
            M: "Minutes.2",
            "#M": "Minutes",
            S: "Seconds.2",
            "#S": "Seconds",
            s: "Unix",
            N: "Milliseconds.3",
            "#N": "Milliseconds",
            O: "TimezoneOffset",
            Z: "TimezoneName",
            G: "GmtOffset"
        },
        shortcuts: {
            F: "%Y-%m-%d",
            T: "%H:%M:%S",
            X: "%H:%M:%S",
            x: "%m/%d/%y",
            D: "%m/%d/%y",
            "#c": "%a %b %e %H:%M:%S %Y",
            v: "%e-%b-%Y",
            R: "%H:%M",
            r: "%I:%M:%S %p",
            t: "\t",
            n: "\n",
            "%": "%"
        }
    };
    ag.formats.php = {
        codes: {
            matcher: /()%((%|[a-z]))/i,
            a: "AbbrDayName",
            A: "DayName",
            d: "Date.2",
            e: "Date",
            j: "DayOfYear.3",
            u: "DayOfWeek",
            w: "Day",
            U: "FullWeekOfYear.2",
            V: "IsoWeek.2",
            W: "WeekOfYear.2",
            b: "AbbrMonthName",
            B: "MonthName",
            m: "MonthNumber.2",
            h: "AbbrMonthName",
            C: "Century.2",
            y: "ShortYear.2",
            Y: "FullYear",
            H: "Hours.2",
            I: "Hours12.2",
            l: "Hours12",
            p: "AMPM",
            P: "AmPm",
            M: "Minutes.2",
            S: "Seconds.2",
            s: "Unix",
            O: "TimezoneOffset",
            z: "GmtOffset",
            Z: "TimezoneAbbr"
        },
        shortcuts: {
            D: "%m/%d/%y",
            F: "%Y-%m-%d",
            T: "%H:%M:%S",
            X: "%H:%M:%S",
            x: "%m/%d/%y",
            R: "%H:%M",
            r: "%I:%M:%S %p",
            t: "\t",
            n: "\n",
            "%": "%"
        }
    };
    ag.createDate = function(aj) {
        if (aj == null) {
            return new Date()
        }
        if (aj instanceof Date) {
            return aj
        }
        if (typeof aj == "number") {
            return new Date(aj)
        }
        var ao = String(aj).replace(/^\s*(.+)\s*$/g, "$1");
        ao = ao.replace(/^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,4})/, "$1/$2/$3");
        ao = ao.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{4})/i, "$1 $2 $3");
        var an = ao.match(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i);
        if (an && an.length > 3) {
            var at = parseFloat(an[3]);
            var am = ag.config.defaultCentury + at;
            am = String(am);
            ao = ao.replace(/^(3[01]|[0-2]?\d)[-\/]([a-z]{3,})[-\/](\d{2})\D*/i, an[1] + " " + an[2] + " " + am)
        }
        an = ao.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})[^0-9]/);
        function ar(ax, aw) {
            var aC = parseFloat(aw[1]);
            var aB = parseFloat(aw[2]);
            var aA = parseFloat(aw[3]);
            var az = ag.config.defaultCentury;
            var av, au, aD, ay;
            if (aC > 31) {
                au = aA;
                aD = aB;
                av = az + aC
            } else {
                au = aB;
                aD = aC;
                av = az + aA
            }
            ay = aD + "/" + au + "/" + av;
            return ax.replace(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})/, ay)
        }
        if (an && an.length > 3) {
            ao = ar(ao, an)
        }
        var an = ao.match(/^([0-9]{1,2})[-\/]([0-9]{1,2})[-\/]([0-9]{1,2})$/);
        if (an && an.length > 3) {
            ao = ar(ao, an)
        }
        var al = 0;
        var ai = ag.matchers.length;
        var aq, ah, ap = ao, ak;
        while (al < ai) {
            ah = Date.parse(ap);
            if (!isNaN(ah)) {
                return new Date(ah)
            }
            aq = ag.matchers[al];
            if (typeof aq == "function") {
                ak = aq.call(ag, ap);
                if (ak instanceof Date) {
                    return ak
                }
            } else {
                ap = ao.replace(aq[0], aq[1])
            }
            al++
        }
        return NaN
    }
    ;
    ag.daysInMonth = function(ah, ai) {
        if (ai == 2) {
            return new Date(ah,1,29).getDate() == 29 ? 29 : 28
        }
        return [u, 31, u, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][ai]
    }
    ;
    ag.matchers = [[/(3[01]|[0-2]\d)\s*\.\s*(1[0-2]|0\d)\s*\.\s*([1-9]\d{3})/, "$2/$1/$3"], [/([1-9]\d{3})\s*-\s*(1[0-2]|0\d)\s*-\s*(3[01]|[0-2]\d)/, "$2/$3/$1"], function(ak) {
        var ai = ak.match(/^(?:(.+)\s+)?([012]?\d)(?:\s*\:\s*(\d\d))?(?:\s*\:\s*(\d\d(\.\d*)?))?\s*(am|pm)?\s*$/i);
        if (ai) {
            if (ai[1]) {
                var aj = this.createDate(ai[1]);
                if (isNaN(aj)) {
                    return
                }
            } else {
                var aj = new Date();
                aj.setMilliseconds(0)
            }
            var ah = parseFloat(ai[2]);
            if (ai[6]) {
                ah = ai[6].toLowerCase() == "am" ? (ah == 12 ? 0 : ah) : (ah == 12 ? 12 : ah + 12)
            }
            aj.setHours(ah, parseInt(ai[3] || 0, 10), parseInt(ai[4] || 0, 10), ((parseFloat(ai[5] || 0)) || 0) * 1000);
            return aj
        } else {
            return ak
        }
    }
    , function(ak) {
        var ai = ak.match(/^(?:(.+))[T|\s+]([012]\d)(?:\:(\d\d))(?:\:(\d\d))(?:\.\d+)([\+\-]\d\d\:\d\d)$/i);
        if (ai) {
            if (ai[1]) {
                var aj = this.createDate(ai[1]);
                if (isNaN(aj)) {
                    return
                }
            } else {
                var aj = new Date();
                aj.setMilliseconds(0)
            }
            var ah = parseFloat(ai[2]);
            aj.setHours(ah, parseInt(ai[3], 10), parseInt(ai[4], 10), parseFloat(ai[5]) * 1000);
            return aj
        } else {
            return ak
        }
    }
    , function(al) {
        var aj = al.match(/^([0-3]?\d)\s*[-\/.\s]{1}\s*([a-zA-Z]{3,9})\s*[-\/.\s]{1}\s*([0-3]?\d)$/);
        if (aj) {
            var ak = new Date();
            var am = ag.config.defaultCentury;
            var ao = parseFloat(aj[1]);
            var an = parseFloat(aj[3]);
            var ai, ah, ap;
            if (ao > 31) {
                ah = an;
                ai = am + ao
            } else {
                ah = ao;
                ai = am + an
            }
            var ap = ab(aj[2], ag.regional[ag.regional.getLocale()]["monthNamesShort"]);
            if (ap == -1) {
                ap = ab(aj[2], ag.regional[ag.regional.getLocale()]["monthNames"])
            }
            ak.setFullYear(ai, ap, ah);
            ak.setHours(0, 0, 0, 0);
            return ak
        } else {
            return al
        }
    }
    ];
    function ab(aj, ak) {
        if (ak.indexOf) {
            return ak.indexOf(aj)
        }
        for (var ah = 0, ai = ak.length; ah < ai; ah++) {
            if (ak[ah] === aj) {
                return ah
            }
        }
        return -1
    }
    function l(ah) {
        if (ah === null) {
            return "[object Null]"
        }
        return Object.prototype.toString.call(ah)
    }
    L.jsDate = ag;
    L.jqplot.sprintf = function() {
        function an(au, ap, aq, at) {
            var ar = (au.length >= ap) ? "" : Array(1 + ap - au.length >>> 0).join(aq);
            return at ? au + ar : ar + au
        }
        function ak(ar) {
            var aq = new String(ar);
            for (var ap = 10; ap > 0; ap--) {
                if (aq == (aq = aq.replace(/^(\d+)(\d{3})/, "$1" + L.jqplot.sprintf.thousandsSeparator + "$2"))) {
                    break
                }
            }
            return aq
        }
        function aj(av, au, ax, ar, at, aq) {
            var aw = ar - av.length;
            if (aw > 0) {
                var ap = " ";
                if (aq) {
                    ap = "&nbsp;"
                }
                if (ax || !at) {
                    av = an(av, ar, ap, ax)
                } else {
                    av = av.slice(0, au.length) + an("", aw, "0", true) + av.slice(au.length)
                }
            }
            return av
        }
        function ao(ay, aq, aw, ar, ap, av, ax, au) {
            var at = ay >>> 0;
            aw = aw && at && {
                "2": "0b",
                "8": "0",
                "16": "0x"
            }[aq] || "";
            ay = aw + an(at.toString(aq), av || 0, "0", false);
            return aj(ay, aw, ar, ap, ax, au)
        }
        function ah(au, av, ar, ap, at, aq) {
            if (ap != null) {
                au = au.slice(0, ap)
            }
            return aj(au, "", av, ar, at, aq)
        }
        var ai = arguments
          , al = 0
          , am = ai[al++];
        return am.replace(L.jqplot.sprintf.regex, function(aM, ax, ay, aB, aO, aJ, av) {
            if (aM == "%%") {
                return "%"
            }
            var aD = false
              , az = ""
              , aA = false
              , aL = false
              , aw = false
              , au = false;
            for (var aI = 0; ay && aI < ay.length; aI++) {
                switch (ay.charAt(aI)) {
                case " ":
                    az = " ";
                    break;
                case "+":
                    az = "+";
                    break;
                case "-":
                    aD = true;
                    break;
                case "0":
                    aA = true;
                    break;
                case "#":
                    aL = true;
                    break;
                case "&":
                    aw = true;
                    break;
                case "'":
                    au = true;
                    break
                }
            }
            if (!aB) {
                aB = 0
            } else {
                if (aB == "*") {
                    aB = +ai[al++]
                } else {
                    if (aB.charAt(0) == "*") {
                        aB = +ai[aB.slice(1, -1)]
                    } else {
                        aB = +aB
                    }
                }
            }
            if (aB < 0) {
                aB = -aB;
                aD = true
            }
            if (!isFinite(aB)) {
                throw new Error("$.jqplot.sprintf: (minimum-)width must be finite")
            }
            if (!aJ) {
                aJ = "fFeE".indexOf(av) > -1 ? 6 : (av == "d") ? 0 : void (0)
            } else {
                if (aJ == "*") {
                    aJ = +ai[al++]
                } else {
                    if (aJ.charAt(0) == "*") {
                        aJ = +ai[aJ.slice(1, -1)]
                    } else {
                        aJ = +aJ
                    }
                }
            }
            var aF = ax ? ai[ax.slice(0, -1)] : ai[al++];
            switch (av) {
            case "s":
                if (aF == null) {
                    return ""
                }
                return ah(String(aF), aD, aB, aJ, aA, aw);
            case "c":
                return ah(String.fromCharCode(+aF), aD, aB, aJ, aA, aw);
            case "b":
                return ao(aF, 2, aL, aD, aB, aJ, aA, aw);
            case "o":
                return ao(aF, 8, aL, aD, aB, aJ, aA, aw);
            case "x":
                return ao(aF, 16, aL, aD, aB, aJ, aA, aw);
            case "X":
                return ao(aF, 16, aL, aD, aB, aJ, aA, aw).toUpperCase();
            case "u":
                return ao(aF, 10, aL, aD, aB, aJ, aA, aw);
            case "i":
                var ar = parseInt(+aF, 10);
                if (isNaN(ar)) {
                    return ""
                }
                var aH = ar < 0 ? "-" : az;
                var aK = au ? ak(String(Math.abs(ar))) : String(Math.abs(ar));
                aF = aH + an(aK, aJ, "0", false);
                return aj(aF, aH, aD, aB, aA, aw);
            case "d":
                var ar = Math.round(+aF);
                if (isNaN(ar)) {
                    return ""
                }
                var aH = ar < 0 ? "-" : az;
                var aK = au ? ak(String(Math.abs(ar))) : String(Math.abs(ar));
                aF = aH + an(aK, aJ, "0", false);
                return aj(aF, aH, aD, aB, aA, aw);
            case "e":
            case "E":
            case "f":
            case "F":
            case "g":
            case "G":
                var ar = +aF;
                if (isNaN(ar)) {
                    return ""
                }
                var aH = ar < 0 ? "-" : az;
                var at = ["toExponential", "toFixed", "toPrecision"]["efg".indexOf(av.toLowerCase())];
                var aN = ["toString", "toUpperCase"]["eEfFgG".indexOf(av) % 2];
                var aK = Math.abs(ar)[at](aJ);
                var aE = aK.toString().split(".");
                aE[0] = au ? ak(aE[0]) : aE[0];
                aK = aE.join(L.jqplot.sprintf.decimalMark);
                aF = aH + aK;
                var aC = aj(aF, aH, aD, aB, aA, aw)[aN]();
                return aC;
            case "p":
            case "P":
                var ar = +aF;
                if (isNaN(ar)) {
                    return ""
                }
                var aH = ar < 0 ? "-" : az;
                var aE = String(Number(Math.abs(ar)).toExponential()).split(/e|E/);
                var aq = (aE[0].indexOf(".") != -1) ? aE[0].length - 1 : String(ar).length;
                var aG = (aE[1] < 0) ? -aE[1] - 1 : 0;
                if (Math.abs(ar) < 1) {
                    if (aq + aG <= aJ) {
                        aF = aH + Math.abs(ar).toPrecision(aq)
                    } else {
                        if (aq <= aJ - 1) {
                            aF = aH + Math.abs(ar).toExponential(aq - 1)
                        } else {
                            aF = aH + Math.abs(ar).toExponential(aJ - 1)
                        }
                    }
                } else {
                    var ap = (aq <= aJ) ? aq : aJ;
                    aF = aH + Math.abs(ar).toPrecision(ap)
                }
                var aN = ["toString", "toUpperCase"]["pP".indexOf(av) % 2];
                return aj(aF, aH, aD, aB, aA, aw)[aN]();
            case "n":
                return "";
            default:
                return aM
            }
        })
    }
    ;
    L.jqplot.sprintf.thousandsSeparator = ",";
    L.jqplot.sprintf.decimalMark = ".";
    L.jqplot.sprintf.regex = /%%|%(\d+\$)?([-+#0&\' ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([nAscboxXuidfegpEGP])/g;
    L.jqplot.getSignificantFigures = function(al) {
        var an = String(Number(Math.abs(al)).toExponential()).split(/e|E/);
        var am = (an[0].indexOf(".") != -1) ? an[0].length - 1 : an[0].length;
        var ai = (an[1] < 0) ? -an[1] - 1 : 0;
        var ah = parseInt(an[1], 10);
        var aj = (ah + 1 > 0) ? ah + 1 : 0;
        var ak = (am <= aj) ? 0 : am - ah - 1;
        return {
            significantDigits: am,
            digitsLeft: aj,
            digitsRight: ak,
            zeros: ai,
            exponent: ah
        }
    }
    ;
    L.jqplot.getPrecision = function(ah) {
        return L.jqplot.getSignificantFigures(ah).digitsRight
    }
    ;
    var X = L.uiBackCompat !== false;
    L.jqplot.effects = {
        effect: {}
    };
    var m = "jqplot.storage.";
    L.extend(L.jqplot.effects, {
        version: "1.9pre",
        save: function(ai, aj) {
            for (var ah = 0; ah < aj.length; ah++) {
                if (aj[ah] !== null) {
                    ai.data(m + aj[ah], ai[0].style[aj[ah]])
                }
            }
        },
        restore: function(ai, aj) {
            for (var ah = 0; ah < aj.length; ah++) {
                if (aj[ah] !== null) {
                    ai.css(aj[ah], ai.data(m + aj[ah]))
                }
            }
        },
        setMode: function(ah, ai) {
            if (ai === "toggle") {
                ai = ah.is(":hidden") ? "show" : "hide"
            }
            return ai
        },
        createWrapper: function(ai) {
            if (ai.parent().is(".ui-effects-wrapper")) {
                return ai.parent()
            }
            var aj = {
                width: ai.outerWidth(true),
                height: ai.outerHeight(true),
                "float": ai.css("float")
            }
              , al = L("<div></div>").addClass("ui-effects-wrapper").css({
                fontSize: "100%",
                background: "transparent",
                border: "none",
                margin: 0,
                padding: 0
            })
              , ah = {
                width: ai.width(),
                height: ai.height()
            }
              , ak = document.activeElement;
            ai.wrap(al);
            if (ai[0] === ak || L.contains(ai[0], ak)) {
                L(ak).focus()
            }
            al = ai.parent();
            if (ai.css("position") === "static") {
                al.css({
                    position: "relative"
                });
                ai.css({
                    position: "relative"
                })
            } else {
                L.extend(aj, {
                    position: ai.css("position"),
                    zIndex: ai.css("z-index")
                });
                L.each(["top", "left", "bottom", "right"], function(am, an) {
                    aj[an] = ai.css(an);
                    if (isNaN(parseInt(aj[an], 10))) {
                        aj[an] = "auto"
                    }
                });
                ai.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })
            }
            ai.css(ah);
            return al.css(aj).show()
        },
        removeWrapper: function(ah) {
            var ai = document.activeElement;
            if (ah.parent().is(".ui-effects-wrapper")) {
                ah.parent().replaceWith(ah);
                if (ah[0] === ai || L.contains(ah[0], ai)) {
                    L(ai).focus()
                }
            }
            return ah
        }
    });
    function j(ai, ah, aj, ak) {
        if (L.isPlainObject(ai)) {
            return ai
        }
        ai = {
            effect: ai
        };
        if (ah === u) {
            ah = {}
        }
        if (L.isFunction(ah)) {
            ak = ah;
            aj = null;
            ah = {}
        }
        if (L.type(ah) === "number" || L.fx.speeds[ah]) {
            ak = aj;
            aj = ah;
            ah = {}
        }
        if (L.isFunction(aj)) {
            ak = aj;
            aj = null
        }
        if (ah) {
            L.extend(ai, ah)
        }
        aj = aj || ah.duration;
        ai.duration = L.fx.off ? 0 : typeof aj === "number" ? aj : aj in L.fx.speeds ? L.fx.speeds[aj] : L.fx.speeds._default;
        ai.complete = ak || ah.complete;
        return ai
    }
    function ae(ah) {
        if (!ah || typeof ah === "number" || L.fx.speeds[ah]) {
            return true
        }
        if (typeof ah === "string" && !L.jqplot.effects.effect[ah]) {
            if (X && L.jqplot.effects[ah]) {
                return false
            }
            return true
        }
        return false
    }
    L.fn.extend({
        jqplotEffect: function(ap, aq, ai, ao) {
            var an = j.apply(this, arguments)
              , ak = an.mode
              , al = an.queue
              , am = L.jqplot.effects.effect[an.effect]
              , ah = !am && X && L.jqplot.effects[an.effect];
            if (L.fx.off || !(am || ah)) {
                if (ak) {
                    return this[ak](an.duration, an.complete)
                } else {
                    return this.each(function() {
                        if (an.complete) {
                            an.complete.call(this)
                        }
                    })
                }
            }
            function aj(au) {
                var av = L(this)
                  , at = an.complete
                  , aw = an.mode;
                function ar() {
                    if (L.isFunction(at)) {
                        at.call(av[0])
                    }
                    if (L.isFunction(au)) {
                        au()
                    }
                }
                if (av.is(":hidden") ? aw === "hide" : aw === "show") {
                    ar()
                } else {
                    am.call(av[0], an, ar)
                }
            }
            if (am) {
                return al === false ? this.each(aj) : this.queue(al || "fx", aj)
            } else {
                return ah.call(this, {
                    options: an,
                    duration: an.duration,
                    callback: an.complete,
                    mode: an.mode
                })
            }
        }
    });
    var a = /up|down|vertical/
      , v = /up|left|vertical|horizontal/;
    L.jqplot.effects.effect.blind = function(aj, ao) {
        var ak = L(this), ar = ["position", "top", "bottom", "left", "right", "height", "width"], ap = L.jqplot.effects.setMode(ak, aj.mode || "hide"), au = aj.direction || "up", am = a.test(au), al = am ? "height" : "width", aq = am ? "top" : "left", aw = v.test(au), an = {}, av = ap === "show", ai, ah, at;
        if (ak.parent().is(".ui-effects-wrapper")) {
            L.jqplot.effects.save(ak.parent(), ar)
        } else {
            L.jqplot.effects.save(ak, ar)
        }
        ak.show();
        at = parseInt(ak.css("top"), 10);
        ai = L.jqplot.effects.createWrapper(ak).css({
            overflow: "hidden"
        });
        ah = am ? ai[al]() + at : ai[al]();
        an[al] = av ? String(ah) : "0";
        if (!aw) {
            ak.css(am ? "bottom" : "right", 0).css(am ? "top" : "left", "").css({
                position: "absolute"
            });
            an[aq] = av ? "0" : String(ah)
        }
        if (av) {
            ai.css(al, 0);
            if (!aw) {
                ai.css(aq, ah)
            }
        }
        ai.animate(an, {
            duration: aj.duration,
            easing: aj.easing,
            queue: false,
            complete: function() {
                if (ap === "hide") {
                    ak.hide()
                }
                L.jqplot.effects.restore(ak, ar);
                L.jqplot.effects.removeWrapper(ak);
                ao()
            }
        })
    }
}
)(jQuery);
