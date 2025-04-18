/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(a) {
    a.jqplot.CategoryAxisRenderer = function(b) {
        a.jqplot.LinearAxisRenderer.call(this);
        this.sortMergedLabels = false
    }
    ;
    a.jqplot.CategoryAxisRenderer.prototype = new a.jqplot.LinearAxisRenderer();
    a.jqplot.CategoryAxisRenderer.prototype.constructor = a.jqplot.CategoryAxisRenderer;
    a.jqplot.CategoryAxisRenderer.prototype.init = function(e) {
        this.groups = 1;
        this.groupLabels = [];
        this._groupLabels = [];
        this._grouped = false;
        this._barsPerGroup = null;
        this.reverse = false;
        a.extend(true, this, {
            tickOptions: {
                formatString: "%d"
            }
        }, e);
        var b = this._dataBounds;
        for (var f = 0; f < this._series.length; f++) {
            var g = this._series[f];
            if (g.groups) {
                this.groups = g.groups
            }
            var h = g.data;
            for (var c = 0; c < h.length; c++) {
                if (this.name == "xaxis" || this.name == "x2axis") {
                    if (h[c][0] < b.min || b.min == null) {
                        b.min = h[c][0]
                    }
                    if (h[c][0] > b.max || b.max == null) {
                        b.max = h[c][0]
                    }
                } else {
                    if (h[c][1] < b.min || b.min == null) {
                        b.min = h[c][1]
                    }
                    if (h[c][1] > b.max || b.max == null) {
                        b.max = h[c][1]
                    }
                }
            }
        }
        if (this.groupLabels.length) {
            this.groups = this.groupLabels.length
        }
    }
    ;
    a.jqplot.CategoryAxisRenderer.prototype.createTicks = function() {
        var D = this._ticks;
        var z = this.ticks;
        var F = this.name;
        var C = this._dataBounds;
        var v, A;
        var q, w;
        var d, c;
        var b, x;
        if (z.length) {
            if (this.groups > 1 && !this._grouped) {
                var r = z.length;
                var p = parseInt(r / this.groups, 10);
                var e = 0;
                for (var x = p; x < r; x += p) {
                    z.splice(x + e, 0, " ");
                    e++
                }
                this._grouped = true
            }
            this.min = 0.5;
            this.max = z.length + 0.5;
            var m = this.max - this.min;
            this.numberTicks = 2 * z.length + 1;
            for (x = 0; x < z.length; x++) {
                b = this.min + 2 * x * m / (this.numberTicks - 1);
                var h = new this.tickRenderer(this.tickOptions);
                h.showLabel = false;
                h.setTick(b, this.name);
                this._ticks.push(h);
                var h = new this.tickRenderer(this.tickOptions);
                h.label = z[x];
                h.showMark = false;
                h.showGridline = false;
                h.setTick(b + 0.5, this.name);
                this._ticks.push(h)
            }
            var h = new this.tickRenderer(this.tickOptions);
            h.showLabel = false;
            h.setTick(b + 1, this.name);
            this._ticks.push(h)
        } else {
            if (F == "xaxis" || F == "x2axis") {
                v = this._plotDimensions.width
            } else {
                v = this._plotDimensions.height
            }
            if (this.min != null && this.max != null && this.numberTicks != null) {
                this.tickInterval = null
            }
            if (this.min != null && this.max != null && this.tickInterval != null) {
                if (parseInt((this.max - this.min) / this.tickInterval, 10) != (this.max - this.min) / this.tickInterval) {
                    this.tickInterval = null
                }
            }
            var y = [];
            var B = 0;
            var q = 0.5;
            var w, E;
            var f = false;
            for (var x = 0; x < this._series.length; x++) {
                var k = this._series[x];
                for (var u = 0; u < k.data.length; u++) {
                    if (this.name == "xaxis" || this.name == "x2axis") {
                        E = k.data[u][0]
                    } else {
                        E = k.data[u][1]
                    }
                    if (a.inArray(E, y) == -1) {
                        f = true;
                        B += 1;
                        y.push(E)
                    }
                }
            }
            if (f && this.sortMergedLabels) {
                if (typeof y[0] == "string") {
                    y.sort()
                } else {
                    y.sort(function(j, i) {
                        return j - i
                    })
                }
            }
            this.ticks = y;
            for (var x = 0; x < this._series.length; x++) {
                var k = this._series[x];
                for (var u = 0; u < k.data.length; u++) {
                    if (this.name == "xaxis" || this.name == "x2axis") {
                        E = k.data[u][0]
                    } else {
                        E = k.data[u][1]
                    }
                    var n = a.inArray(E, y) + 1;
                    if (this.name == "xaxis" || this.name == "x2axis") {
                        k.data[u][0] = n
                    } else {
                        k.data[u][1] = n
                    }
                }
            }
            if (this.groups > 1 && !this._grouped) {
                var r = y.length;
                var p = parseInt(r / this.groups, 10);
                var e = 0;
                for (var x = p; x < r; x += p + 1) {
                    y[x] = " "
                }
                this._grouped = true
            }
            w = B + 0.5;
            if (this.numberTicks == null) {
                this.numberTicks = 2 * B + 1
            }
            var m = w - q;
            this.min = q;
            this.max = w;
            var o = 0;
            var g = parseInt(3 + v / 10, 10);
            var p = parseInt(B / g, 10);
            if (this.tickInterval == null) {
                this.tickInterval = m / (this.numberTicks - 1)
            }
            for (var x = 0; x < this.numberTicks; x++) {
                b = this.min + x * this.tickInterval;
                var h = new this.tickRenderer(this.tickOptions);
                if (x / 2 == parseInt(x / 2, 10)) {
                    h.showLabel = false;
                    h.showMark = true
                } else {
                    if (p > 0 && o < p) {
                        h.showLabel = false;
                        o += 1
                    } else {
                        h.showLabel = true;
                        o = 0
                    }
                    h.label = h.formatter(h.formatString, y[(x - 1) / 2]);
                    h.showMark = false;
                    h.showGridline = false
                }
                h.setTick(b, this.name);
                this._ticks.push(h)
            }
        }
    }
    ;
    a.jqplot.CategoryAxisRenderer.prototype.draw = function(b, j) {
        if (this.show) {
            this.renderer.createTicks.call(this);
            var h = 0;
            var c;
            if (this._elem) {
                this._elem.emptyForce()
            }
            this._elem = this._elem || a('<div class="jqplot-axis jqplot-' + this.name + '" style="position:absolute;"></div>');
            if (this.name == "xaxis" || this.name == "x2axis") {
                this._elem.width(this._plotDimensions.width)
            } else {
                this._elem.height(this._plotDimensions.height)
            }
            this.labelOptions.axis = this.name;
            this._label = new this.labelRenderer(this.labelOptions);
            if (this._label.show) {
                var g = this._label.draw(b, j);
                g.appendTo(this._elem)
            }
            var f = this._ticks;
            for (var e = 0; e < f.length; e++) {
                var d = f[e];
                if (d.showLabel && (!d.isMinorTick || this.showMinorTicks)) {
                    var g = d.draw(b, j);
                    g.appendTo(this._elem)
                }
            }
            this._groupLabels = [];
            for (var e = 0; e < this.groupLabels.length; e++) {
                var g = a('<div style="position:absolute;" class="jqplot-' + this.name + '-groupLabel"></div>');
                g.html(this.groupLabels[e]);
                this._groupLabels.push(g);
                g.appendTo(this._elem)
            }
        }
        return this._elem
    }
    ;
    a.jqplot.CategoryAxisRenderer.prototype.set = function() {
        var e = 0;
        var m;
        var k = 0;
        var f = 0;
        var d = (this._label == null) ? false : this._label.show;
        if (this.show) {
            var n = this._ticks;
            for (var c = 0; c < n.length; c++) {
                var g = n[c];
                if (g.showLabel && (!g.isMinorTick || this.showMinorTicks)) {
                    if (this.name == "xaxis" || this.name == "x2axis") {
                        m = g._elem.outerHeight(true)
                    } else {
                        m = g._elem.outerWidth(true)
                    }
                    if (m > e) {
                        e = m
                    }
                }
            }
            var j = 0;
            for (var c = 0; c < this._groupLabels.length; c++) {
                var b = this._groupLabels[c];
                if (this.name == "xaxis" || this.name == "x2axis") {
                    m = b.outerHeight(true)
                } else {
                    m = b.outerWidth(true)
                }
                if (m > j) {
                    j = m
                }
            }
            if (d) {
                k = this._label._elem.outerWidth(true);
                f = this._label._elem.outerHeight(true)
            }
            if (this.name == "xaxis") {
                e += j + f;
                this._elem.css({
                    height: e + "px",
                    left: "0px",
                    bottom: "0px"
                })
            } else {
                if (this.name == "x2axis") {
                    e += j + f;
                    this._elem.css({
                        height: e + "px",
                        left: "0px",
                        top: "0px"
                    })
                } else {
                    if (this.name == "yaxis") {
                        e += j + k;
                        this._elem.css({
                            width: e + "px",
                            left: "0px",
                            top: "0px"
                        });
                        if (d && this._label.constructor == a.jqplot.AxisLabelRenderer) {
                            this._label._elem.css("width", k + "px")
                        }
                    } else {
                        e += j + k;
                        this._elem.css({
                            width: e + "px",
                            right: "0px",
                            top: "0px"
                        });
                        if (d && this._label.constructor == a.jqplot.AxisLabelRenderer) {
                            this._label._elem.css("width", k + "px")
                        }
                    }
                }
            }
        }
    }
    ;
    a.jqplot.CategoryAxisRenderer.prototype.pack = function(e, c) {
        var C = this._ticks;
        var v = this.max;
        var s = this.min;
        var n = c.max;
        var l = c.min;
        var q = (this._label == null) ? false : this._label.show;
        var x;
        for (var r in e) {
            this._elem.css(r, e[r])
        }
        this._offsets = c;
        var g = n - l;
        var k = v - s;
        if (!this.reverse) {
            this.u2p = function(h) {
                return (h - s) * g / k + l
            }
            ;
            this.p2u = function(h) {
                return (h - l) * k / g + s
            }
            ;
            if (this.name == "xaxis" || this.name == "x2axis") {
                this.series_u2p = function(h) {
                    return (h - s) * g / k
                }
                ;
                this.series_p2u = function(h) {
                    return h * k / g + s
                }
            } else {
                this.series_u2p = function(h) {
                    return (h - v) * g / k
                }
                ;
                this.series_p2u = function(h) {
                    return h * k / g + v
                }
            }
        } else {
            this.u2p = function(h) {
                return l + (v - h) * g / k
            }
            ;
            this.p2u = function(h) {
                return s + (h - l) * k / g
            }
            ;
            if (this.name == "xaxis" || this.name == "x2axis") {
                this.series_u2p = function(h) {
                    return (v - h) * g / k
                }
                ;
                this.series_p2u = function(h) {
                    return h * k / g + v
                }
            } else {
                this.series_u2p = function(h) {
                    return (s - h) * g / k
                }
                ;
                this.series_p2u = function(h) {
                    return h * k / g + s
                }
            }
        }
        if (this.show) {
            if (this.name == "xaxis" || this.name == "x2axis") {
                for (x = 0; x < C.length; x++) {
                    var o = C[x];
                    if (o.show && o.showLabel) {
                        var b;
                        if (o.constructor == a.jqplot.CanvasAxisTickRenderer && o.angle) {
                            var A = (this.name == "xaxis") ? 1 : -1;
                            switch (o.labelPosition) {
                            case "auto":
                                if (A * o.angle < 0) {
                                    b = -o.getWidth() + o._textRenderer.height * Math.sin(-o._textRenderer.angle) / 2
                                } else {
                                    b = -o._textRenderer.height * Math.sin(o._textRenderer.angle) / 2
                                }
                                break;
                            case "end":
                                b = -o.getWidth() + o._textRenderer.height * Math.sin(-o._textRenderer.angle) / 2;
                                break;
                            case "start":
                                b = -o._textRenderer.height * Math.sin(o._textRenderer.angle) / 2;
                                break;
                            case "middle":
                                b = -o.getWidth() / 2 + o._textRenderer.height * Math.sin(-o._textRenderer.angle) / 2;
                                break;
                            default:
                                b = -o.getWidth() / 2 + o._textRenderer.height * Math.sin(-o._textRenderer.angle) / 2;
                                break
                            }
                        } else {
                            b = -o.getWidth() / 2
                        }
                        var D = this.u2p(o.value) + b + "px";
                        o._elem.css("left", D);
                        o.pack()
                    }
                }
                var z = ["bottom", 0];
                if (q) {
                    var m = this._label._elem.outerWidth(true);
                    this._label._elem.css("left", l + g / 2 - m / 2 + "px");
                    if (this.name == "xaxis") {
                        this._label._elem.css("bottom", "0px");
                        z = ["bottom", this._label._elem.outerHeight(true)]
                    } else {
                        this._label._elem.css("top", "0px");
                        z = ["top", this._label._elem.outerHeight(true)]
                    }
                    this._label.pack()
                }
                var d = parseInt(this._ticks.length / this.groups, 10) + 1;
                for (x = 0; x < this._groupLabels.length; x++) {
                    var B = 0;
                    var f = 0;
                    for (var u = x * d; u < (x + 1) * d; u++) {
                        if (u >= this._ticks.length - 1) {
                            continue
                        }
                        if (this._ticks[u]._elem && this._ticks[u].label != " ") {
                            var o = this._ticks[u]._elem;
                            var r = o.position();
                            B += r.left + o.outerWidth(true) / 2;
                            f++
                        }
                    }
                    B = B / f;
                    this._groupLabels[x].css({
                        left: (B - this._groupLabels[x].outerWidth(true) / 2)
                    });
                    this._groupLabels[x].css(z[0], z[1])
                }
            } else {
                for (x = 0; x < C.length; x++) {
                    var o = C[x];
                    if (o.show && o.showLabel) {
                        var b;
                        if (o.constructor == a.jqplot.CanvasAxisTickRenderer && o.angle) {
                            var A = (this.name == "yaxis") ? 1 : -1;
                            switch (o.labelPosition) {
                            case "auto":
                            case "end":
                                if (A * o.angle < 0) {
                                    b = -o._textRenderer.height * Math.cos(-o._textRenderer.angle) / 2
                                } else {
                                    b = -o.getHeight() + o._textRenderer.height * Math.cos(o._textRenderer.angle) / 2
                                }
                                break;
                            case "start":
                                if (o.angle > 0) {
                                    b = -o._textRenderer.height * Math.cos(-o._textRenderer.angle) / 2
                                } else {
                                    b = -o.getHeight() + o._textRenderer.height * Math.cos(o._textRenderer.angle) / 2
                                }
                                break;
                            case "middle":
                                b = -o.getHeight() / 2;
                                break;
                            default:
                                b = -o.getHeight() / 2;
                                break
                            }
                        } else {
                            b = -o.getHeight() / 2
                        }
                        var D = this.u2p(o.value) + b + "px";
                        o._elem.css("top", D);
                        o.pack()
                    }
                }
                var z = ["left", 0];
                if (q) {
                    var y = this._label._elem.outerHeight(true);
                    this._label._elem.css("top", n - g / 2 - y / 2 + "px");
                    if (this.name == "yaxis") {
                        this._label._elem.css("left", "0px");
                        z = ["left", this._label._elem.outerWidth(true)]
                    } else {
                        this._label._elem.css("right", "0px");
                        z = ["right", this._label._elem.outerWidth(true)]
                    }
                    this._label.pack()
                }
                var d = parseInt(this._ticks.length / this.groups, 10) + 1;
                for (x = 0; x < this._groupLabels.length; x++) {
                    var B = 0;
                    var f = 0;
                    for (var u = x * d; u < (x + 1) * d; u++) {
                        if (u >= this._ticks.length - 1) {
                            continue
                        }
                        if (this._ticks[u]._elem && this._ticks[u].label != " ") {
                            var o = this._ticks[u]._elem;
                            var r = o.position();
                            B += r.top + o.outerHeight() / 2;
                            f++
                        }
                    }
                    B = B / f;
                    this._groupLabels[x].css({
                        top: B - this._groupLabels[x].outerHeight() / 2
                    });
                    this._groupLabels[x].css(z[0], z[1])
                }
            }
        }
    }
}
)(jQuery);
