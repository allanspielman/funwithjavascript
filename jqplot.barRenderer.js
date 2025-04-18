/* jqPlot 1.0.8r1250 | (c) 2009-2013 Chris Leonello | jplot.com
   jsDate | (c) 2010-2013 Chris Leonello
 */
(function(d) {
    d.jqplot.BarRenderer = function() {
        d.jqplot.LineRenderer.call(this)
    }
    ;
    d.jqplot.BarRenderer.prototype = new d.jqplot.LineRenderer();
    d.jqplot.BarRenderer.prototype.constructor = d.jqplot.BarRenderer;
    d.jqplot.BarRenderer.prototype.init = function(o, q) {
        this.barPadding = 8;
        this.barMargin = 10;
        this.barDirection = "vertical";
        this.barWidth = null;
        this.shadowOffset = 2;
        this.shadowDepth = 5;
        this.shadowAlpha = 0.08;
        this.waterfall = false;
        this.groups = 1;
        this.varyBarColor = false;
        this.highlightMouseOver = true;
        this.highlightMouseDown = false;
        this.highlightColors = [];
        this.transposedData = true;
        this.renderer.animation = {
            show: false,
            direction: "down",
            speed: 3000,
            _supported: true
        };
        this._type = "bar";
        if (o.highlightMouseDown && o.highlightMouseOver == null) {
            o.highlightMouseOver = false
        }
        d.extend(true, this, o);
        d.extend(true, this.renderer, o);
        this.fill = true;
        if (this.barDirection === "horizontal" && this.rendererOptions.animation && this.rendererOptions.animation.direction == null) {
            this.renderer.animation.direction = "left"
        }
        if (this.waterfall) {
            this.fillToZero = false;
            this.disableStack = true
        }
        if (this.barDirection == "vertical") {
            this._primaryAxis = "_xaxis";
            this._stackAxis = "y";
            this.fillAxis = "y"
        } else {
            this._primaryAxis = "_yaxis";
            this._stackAxis = "x";
            this.fillAxis = "x"
        }
        this._highlightedPoint = null;
        this._plotSeriesInfo = null;
        this._dataColors = [];
        this._barPoints = [];
        var p = {
            lineJoin: "miter",
            lineCap: "round",
            fill: true,
            isarc: false,
            strokeStyle: this.color,
            fillStyle: this.color,
            closePath: this.fill
        };
        this.renderer.shapeRenderer.init(p);
        var n = {
            lineJoin: "miter",
            lineCap: "round",
            fill: true,
            isarc: false,
            angle: this.shadowAngle,
            offset: this.shadowOffset,
            alpha: this.shadowAlpha,
            depth: this.shadowDepth,
            closePath: this.fill
        };
        this.renderer.shadowRenderer.init(n);
        q.postInitHooks.addOnce(h);
        q.postDrawHooks.addOnce(j);
        q.eventListenerHooks.addOnce("jqplotMouseMove", b);
        q.eventListenerHooks.addOnce("jqplotMouseDown", a);
        q.eventListenerHooks.addOnce("jqplotMouseUp", l);
        q.eventListenerHooks.addOnce("jqplotClick", e);
        q.eventListenerHooks.addOnce("jqplotRightClick", m)
    }
    ;
    function g(t, p, o, w) {
        if (this.rendererOptions.barDirection == "horizontal") {
            this._stackAxis = "x";
            this._primaryAxis = "_yaxis"
        }
        if (this.rendererOptions.waterfall == true) {
            this._data = d.extend(true, [], this.data);
            var s = 0;
            var u = (!this.rendererOptions.barDirection || this.rendererOptions.barDirection === "vertical" || this.transposedData === false) ? 1 : 0;
            for (var q = 0; q < this.data.length; q++) {
                s += this.data[q][u];
                if (q > 0) {
                    this.data[q][u] += this.data[q - 1][u]
                }
            }
            this.data[this.data.length] = (u == 1) ? [this.data.length + 1, s] : [s, this.data.length + 1];
            this._data[this._data.length] = (u == 1) ? [this._data.length + 1, s] : [s, this._data.length + 1]
        }
        if (this.rendererOptions.groups > 1) {
            this.breakOnNull = true;
            var n = this.data.length;
            var v = parseInt(n / this.rendererOptions.groups, 10);
            var r = 0;
            for (var q = v; q < n; q += v) {
                this.data.splice(q + r, 0, [null, null]);
                this._plotData.splice(q + r, 0, [null, null]);
                this._stackData.splice(q + r, 0, [null, null]);
                r++
            }
            for (q = 0; q < this.data.length; q++) {
                if (this._primaryAxis == "_xaxis") {
                    this.data[q][0] = q + 1;
                    this._plotData[q][0] = q + 1;
                    this._stackData[q][0] = q + 1
                } else {
                    this.data[q][1] = q + 1;
                    this._plotData[q][1] = q + 1;
                    this._stackData[q][1] = q + 1
                }
            }
        }
    }
    d.jqplot.preSeriesInitHooks.push(g);
    d.jqplot.BarRenderer.prototype.calcSeriesNumbers = function() {
        var r = 0;
        var t = 0;
        var q = this[this._primaryAxis];
        var p, o, u;
        for (var n = 0; n < q._series.length; n++) {
            o = q._series[n];
            if (o === this) {
                u = n
            }
            if (o.renderer.constructor == d.jqplot.BarRenderer) {
                r += o.data.length;
                t += 1
            }
        }
        return [r, t, u]
    }
    ;
    d.jqplot.BarRenderer.prototype.setBarWidth = function() {
        var q;
        var n = 0;
        var o = 0;
        var t = this[this._primaryAxis];
        var x, r, v;
        var w = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        n = w[0];
        o = w[1];
        var u = t.numberTicks;
        var p = (u - 1) / 2;
        if (t.name == "xaxis" || t.name == "x2axis") {
            if (this._stack) {
                this.barWidth = (t._offsets.max - t._offsets.min) / n * o - this.barMargin
            } else {
                this.barWidth = ((t._offsets.max - t._offsets.min) / p - this.barPadding * (o - 1) - this.barMargin * 2) / o
            }
        } else {
            if (this._stack) {
                this.barWidth = (t._offsets.min - t._offsets.max) / n * o - this.barMargin
            } else {
                this.barWidth = ((t._offsets.min - t._offsets.max) / p - this.barPadding * (o - 1) - this.barMargin * 2) / o
            }
        }
        return [n, o]
    }
    ;
    function f(o) {
        var q = [];
        for (var s = 0; s < o.length; s++) {
            var r = d.jqplot.getColorComponents(o[s]);
            var n = [r[0], r[1], r[2]];
            var t = n[0] + n[1] + n[2];
            for (var p = 0; p < 3; p++) {
                n[p] = (t > 570) ? n[p] * 0.8 : n[p] + 0.3 * (255 - n[p]);
                n[p] = parseInt(n[p], 10)
            }
            q.push("rgb(" + n[0] + "," + n[1] + "," + n[2] + ")")
        }
        return q
    }
    function i(v, u, s, t, o) {
        var q = v, w = v - 1, n, p, r = (o === "x") ? 0 : 1;
        if (q > 0) {
            p = t.series[w]._plotData[u][r];
            if ((s * p) < 0) {
                n = i(w, u, s, t, o)
            } else {
                n = t.series[w].gridData[u][r]
            }
        } else {
            n = (r === 0) ? t.series[q]._xaxis.series_u2p(0) : t.series[q]._yaxis.series_u2p(0)
        }
        return n
    }
    d.jqplot.BarRenderer.prototype.draw = function(E, L, q, G) {
        var I;
        var A = d.extend({}, q);
        var w = (A.shadow != undefined) ? A.shadow : this.shadow;
        var O = (A.showLine != undefined) ? A.showLine : this.showLine;
        var F = (A.fill != undefined) ? A.fill : this.fill;
        var p = this.xaxis;
        var J = this.yaxis;
        var y = this._xaxis.series_u2p;
        var K = this._yaxis.series_u2p;
        var D, C;
        this._dataColors = [];
        this._barPoints = [];
        if (this.barWidth == null) {
            this.renderer.setBarWidth.call(this)
        }
        var N = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
        var x = N[0];
        var v = N[1];
        var s = N[2];
        var H = [];
        if (this._stack) {
            this._barNudge = 0
        } else {
            this._barNudge = (-Math.abs(v / 2 - 0.5) + s) * (this.barWidth + this.barPadding)
        }
        if (O) {
            var u = new d.jqplot.ColorGenerator(this.negativeSeriesColors);
            var B = new d.jqplot.ColorGenerator(this.seriesColors);
            var M = u.get(this.index);
            if (!this.useNegativeColors) {
                M = A.fillStyle
            }
            var t = A.fillStyle;
            var r;
            var P;
            var o;
            if (this.barDirection == "vertical") {
                for (var I = 0; I < L.length; I++) {
                    if (!this._stack && this.data[I][1] == null) {
                        continue
                    }
                    H = [];
                    r = L[I][0] + this._barNudge;
                    if (this._stack && this._prevGridData.length) {
                        o = i(this.index, I, this._plotData[I][1], G, "y")
                    } else {
                        if (this.fillToZero) {
                            o = this._yaxis.series_u2p(0)
                        } else {
                            if (this.waterfall && I > 0 && I < this.gridData.length - 1) {
                                o = this.gridData[I - 1][1]
                            } else {
                                if (this.waterfall && I == 0 && I < this.gridData.length - 1) {
                                    if (this._yaxis.min <= 0 && this._yaxis.max >= 0) {
                                        o = this._yaxis.series_u2p(0)
                                    } else {
                                        if (this._yaxis.min > 0) {
                                            o = E.canvas.height
                                        } else {
                                            o = 0
                                        }
                                    }
                                } else {
                                    if (this.waterfall && I == this.gridData.length - 1) {
                                        if (this._yaxis.min <= 0 && this._yaxis.max >= 0) {
                                            o = this._yaxis.series_u2p(0)
                                        } else {
                                            if (this._yaxis.min > 0) {
                                                o = E.canvas.height
                                            } else {
                                                o = 0
                                            }
                                        }
                                    } else {
                                        o = E.canvas.height
                                    }
                                }
                            }
                        }
                    }
                    if ((this.fillToZero && this._plotData[I][1] < 0) || (this.waterfall && this._data[I][1] < 0)) {
                        if (this.varyBarColor && !this._stack) {
                            if (this.useNegativeColors) {
                                A.fillStyle = u.next()
                            } else {
                                A.fillStyle = B.next()
                            }
                        } else {
                            A.fillStyle = M
                        }
                    } else {
                        if (this.varyBarColor && !this._stack) {
                            A.fillStyle = B.next()
                        } else {
                            A.fillStyle = t
                        }
                    }
                    if (!this.fillToZero || this._plotData[I][1] >= 0) {
                        H.push([r - this.barWidth / 2, o]);
                        H.push([r - this.barWidth / 2, L[I][1]]);
                        H.push([r + this.barWidth / 2, L[I][1]]);
                        H.push([r + this.barWidth / 2, o])
                    } else {
                        H.push([r - this.barWidth / 2, L[I][1]]);
                        H.push([r - this.barWidth / 2, o]);
                        H.push([r + this.barWidth / 2, o]);
                        H.push([r + this.barWidth / 2, L[I][1]])
                    }
                    this._barPoints.push(H);
                    if (w && !this._stack) {
                        var z = d.extend(true, {}, A);
                        delete z.fillStyle;
                        this.renderer.shadowRenderer.draw(E, H, z)
                    }
                    var n = A.fillStyle || this.color;
                    this._dataColors.push(n);
                    this.renderer.shapeRenderer.draw(E, H, A)
                }
            } else {
                if (this.barDirection == "horizontal") {
                    for (var I = 0; I < L.length; I++) {
                        if (!this._stack && this.data[I][0] == null) {
                            continue
                        }
                        H = [];
                        r = L[I][1] - this._barNudge;
                        P;
                        if (this._stack && this._prevGridData.length) {
                            P = i(this.index, I, this._plotData[I][0], G, "x")
                        } else {
                            if (this.fillToZero) {
                                P = this._xaxis.series_u2p(0)
                            } else {
                                if (this.waterfall && I > 0 && I < this.gridData.length - 1) {
                                    P = this.gridData[I - 1][0]
                                } else {
                                    if (this.waterfall && I == 0 && I < this.gridData.length - 1) {
                                        if (this._xaxis.min <= 0 && this._xaxis.max >= 0) {
                                            P = this._xaxis.series_u2p(0)
                                        } else {
                                            if (this._xaxis.min > 0) {
                                                P = 0
                                            } else {
                                                P = 0
                                            }
                                        }
                                    } else {
                                        if (this.waterfall && I == this.gridData.length - 1) {
                                            if (this._xaxis.min <= 0 && this._xaxis.max >= 0) {
                                                P = this._xaxis.series_u2p(0)
                                            } else {
                                                if (this._xaxis.min > 0) {
                                                    P = 0
                                                } else {
                                                    P = E.canvas.width
                                                }
                                            }
                                        } else {
                                            P = 0
                                        }
                                    }
                                }
                            }
                        }
                        if ((this.fillToZero && this._plotData[I][0] < 0) || (this.waterfall && this._data[I][0] < 0)) {
                            if (this.varyBarColor && !this._stack) {
                                if (this.useNegativeColors) {
                                    A.fillStyle = u.next()
                                } else {
                                    A.fillStyle = B.next()
                                }
                            } else {
                                A.fillStyle = M
                            }
                        } else {
                            if (this.varyBarColor && !this._stack) {
                                A.fillStyle = B.next()
                            } else {
                                A.fillStyle = t
                            }
                        }
                        if (!this.fillToZero || this._plotData[I][0] >= 0) {
                            H.push([P, r + this.barWidth / 2]);
                            H.push([P, r - this.barWidth / 2]);
                            H.push([L[I][0], r - this.barWidth / 2]);
                            H.push([L[I][0], r + this.barWidth / 2])
                        } else {
                            H.push([L[I][0], r + this.barWidth / 2]);
                            H.push([L[I][0], r - this.barWidth / 2]);
                            H.push([P, r - this.barWidth / 2]);
                            H.push([P, r + this.barWidth / 2])
                        }
                        this._barPoints.push(H);
                        if (w && !this._stack) {
                            var z = d.extend(true, {}, A);
                            delete z.fillStyle;
                            this.renderer.shadowRenderer.draw(E, H, z)
                        }
                        var n = A.fillStyle || this.color;
                        this._dataColors.push(n);
                        this.renderer.shapeRenderer.draw(E, H, A)
                    }
                }
            }
        }
        if (this.highlightColors.length == 0) {
            this.highlightColors = d.jqplot.computeHighlightColors(this._dataColors)
        } else {
            if (typeof (this.highlightColors) == "string") {
                var N = this.highlightColors;
                this.highlightColors = [];
                for (var I = 0; I < this._dataColors.length; I++) {
                    this.highlightColors.push(N)
                }
            }
        }
    }
    ;
    d.jqplot.BarRenderer.prototype.drawShadow = function(z, G, p, B) {
        var D;
        var w = (p != undefined) ? p : {};
        var t = (w.shadow != undefined) ? w.shadow : this.shadow;
        var I = (w.showLine != undefined) ? w.showLine : this.showLine;
        var A = (w.fill != undefined) ? w.fill : this.fill;
        var o = this.xaxis;
        var E = this.yaxis;
        var v = this._xaxis.series_u2p;
        var F = this._yaxis.series_u2p;
        var y, C, x, u, s, r;
        if (this._stack && this.shadow) {
            if (this.barWidth == null) {
                this.renderer.setBarWidth.call(this)
            }
            var H = this._plotSeriesInfo = this.renderer.calcSeriesNumbers.call(this);
            u = H[0];
            s = H[1];
            r = H[2];
            if (this._stack) {
                this._barNudge = 0
            } else {
                this._barNudge = (-Math.abs(s / 2 - 0.5) + r) * (this.barWidth + this.barPadding)
            }
            if (I) {
                if (this.barDirection == "vertical") {
                    for (var D = 0; D < G.length; D++) {
                        if (this.data[D][1] == null) {
                            continue
                        }
                        C = [];
                        var q = G[D][0] + this._barNudge;
                        var n;
                        if (this._stack && this._prevGridData.length) {
                            n = i(this.index, D, this._plotData[D][1], B, "y")
                        } else {
                            if (this.fillToZero) {
                                n = this._yaxis.series_u2p(0)
                            } else {
                                n = z.canvas.height
                            }
                        }
                        C.push([q - this.barWidth / 2, n]);
                        C.push([q - this.barWidth / 2, G[D][1]]);
                        C.push([q + this.barWidth / 2, G[D][1]]);
                        C.push([q + this.barWidth / 2, n]);
                        this.renderer.shadowRenderer.draw(z, C, w)
                    }
                } else {
                    if (this.barDirection == "horizontal") {
                        for (var D = 0; D < G.length; D++) {
                            if (this.data[D][0] == null) {
                                continue
                            }
                            C = [];
                            var q = G[D][1] - this._barNudge;
                            var J;
                            if (this._stack && this._prevGridData.length) {
                                J = i(this.index, D, this._plotData[D][0], B, "x")
                            } else {
                                if (this.fillToZero) {
                                    J = this._xaxis.series_u2p(0)
                                } else {
                                    J = 0
                                }
                            }
                            C.push([J, q + this.barWidth / 2]);
                            C.push([G[D][0], q + this.barWidth / 2]);
                            C.push([G[D][0], q - this.barWidth / 2]);
                            C.push([J, q - this.barWidth / 2]);
                            this.renderer.shadowRenderer.draw(z, C, w)
                        }
                    }
                }
            }
        }
    }
    ;
    function h(q, p, n) {
        for (var o = 0; o < this.series.length; o++) {
            if (this.series[o].renderer.constructor == d.jqplot.BarRenderer) {
                if (this.series[o].highlightMouseOver) {
                    this.series[o].highlightMouseDown = false
                }
            }
        }
    }
    function j() {
        if (this.plugins.barRenderer && this.plugins.barRenderer.highlightCanvas) {
            this.plugins.barRenderer.highlightCanvas.resetCanvas();
            this.plugins.barRenderer.highlightCanvas = null
        }
        this.plugins.barRenderer = {
            highlightedSeriesIndex: null
        };
        this.plugins.barRenderer.highlightCanvas = new d.jqplot.GenericCanvas();
        this.eventCanvas._elem.before(this.plugins.barRenderer.highlightCanvas.createElement(this._gridPadding, "jqplot-barRenderer-highlight-canvas", this._plotDimensions, this));
        this.plugins.barRenderer.highlightCanvas.setContext();
        this.eventCanvas._elem.bind("mouseleave", {
            plot: this
        }, function(n) {
            k(n.data.plot)
        })
    }
    function c(u, t, q, p) {
        var o = u.series[t];
        var n = u.plugins.barRenderer.highlightCanvas;
        n._ctx.clearRect(0, 0, n._ctx.canvas.width, n._ctx.canvas.height);
        o._highlightedPoint = q;
        u.plugins.barRenderer.highlightedSeriesIndex = t;
        var r = {
            fillStyle: o.highlightColors[q]
        };
        o.renderer.shapeRenderer.draw(n._ctx, p, r);
        n = null
    }
    function k(p) {
        var n = p.plugins.barRenderer.highlightCanvas;
        n._ctx.clearRect(0, 0, n._ctx.canvas.width, n._ctx.canvas.height);
        for (var o = 0; o < p.series.length; o++) {
            p.series[o]._highlightedPoint = null
        }
        p.plugins.barRenderer.highlightedSeriesIndex = null;
        p.target.trigger("jqplotDataUnhighlight");
        n = null
    }
    function b(r, q, u, t, s) {
        if (t) {
            var p = [t.seriesIndex, t.pointIndex, t.data];
            var o = jQuery.Event("jqplotDataMouseOver");
            o.pageX = r.pageX;
            o.pageY = r.pageY;
            s.target.trigger(o, p);
            if (s.series[p[0]].show && s.series[p[0]].highlightMouseOver && !(p[0] == s.plugins.barRenderer.highlightedSeriesIndex && p[1] == s.series[p[0]]._highlightedPoint)) {
                var n = jQuery.Event("jqplotDataHighlight");
                n.which = r.which;
                n.pageX = r.pageX;
                n.pageY = r.pageY;
                s.target.trigger(n, p);
                c(s, t.seriesIndex, t.pointIndex, t.points)
            }
        } else {
            if (t == null) {
                k(s)
            }
        }
    }
    function a(q, p, t, s, r) {
        if (s) {
            var o = [s.seriesIndex, s.pointIndex, s.data];
            if (r.series[o[0]].highlightMouseDown && !(o[0] == r.plugins.barRenderer.highlightedSeriesIndex && o[1] == r.series[o[0]]._highlightedPoint)) {
                var n = jQuery.Event("jqplotDataHighlight");
                n.which = q.which;
                n.pageX = q.pageX;
                n.pageY = q.pageY;
                r.target.trigger(n, o);
                c(r, s.seriesIndex, s.pointIndex, s.points)
            }
        } else {
            if (s == null) {
                k(r)
            }
        }
    }
    function l(p, o, s, r, q) {
        var n = q.plugins.barRenderer.highlightedSeriesIndex;
        if (n != null && q.series[n].highlightMouseDown) {
            k(q)
        }
    }
    function e(q, p, t, s, r) {
        if (s) {
            var o = [s.seriesIndex, s.pointIndex, s.data];
            var n = jQuery.Event("jqplotDataClick");
            n.which = q.which;
            n.pageX = q.pageX;
            n.pageY = q.pageY;
            r.target.trigger(n, o)
        }
    }
    function m(r, q, u, t, s) {
        if (t) {
            var p = [t.seriesIndex, t.pointIndex, t.data];
            var n = s.plugins.barRenderer.highlightedSeriesIndex;
            if (n != null && s.series[n].highlightMouseDown) {
                k(s)
            }
            var o = jQuery.Event("jqplotDataRightClick");
            o.which = r.which;
            o.pageX = r.pageX;
            o.pageY = r.pageY;
            s.target.trigger(o, p)
        }
    }
}
)(jQuery);
