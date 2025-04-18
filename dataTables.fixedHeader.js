/*!
 FixedHeader 3.1.2
 ©2009-2016 SpryMedia Ltd - datatables.net/license
*/
(function(d) {
    "function" === typeof define && define.amd ? define(["jquery", "datatables.net"], function(g) {
        return d(g, window, document)
    }) : "object" === typeof exports ? module.exports = function(g, h) {
        g || (g = window);
        if (!h || !h.fn.dataTable)
            h = require("datatables.net")(g, h).$;
        return d(h, g, g.document)
    }
    : d(jQuery, window, document)
}
)(function(d, g, h, k) {
    var j = d.fn.dataTable
      , l = 0
      , i = function(b, a) {
        if (!(this instanceof i))
            throw "FixedHeader must be initialised with the 'new' keyword.";
        !0 === a && (a = {});
        b = new j.Api(b);
        this.c = d.extend(!0, {}, i.defaults, a);
        this.s = {
            dt: b,
            position: {
                theadTop: 0,
                tbodyTop: 0,
                tfootTop: 0,
                tfootBottom: 0,
                width: 0,
                left: 0,
                tfootHeight: 0,
                theadHeight: 0,
                windowHeight: d(g).height(),
                visible: !0
            },
            headerMode: null,
            footerMode: null,
            autoWidth: b.settings()[0].oFeatures.bAutoWidth,
            namespace: ".dtfc" + l++,
            scrollLeft: {
                header: -1,
                footer: -1
            },
            enable: !0
        };
        this.dom = {
            floatingHeader: null,
            thead: d(b.table().header()),
            tbody: d(b.table().body()),
            tfoot: d(b.table().footer()),
            header: {
                host: null,
                floating: null,
                placeholder: null
            },
            footer: {
                host: null,
                floating: null,
                placeholder: null
            }
        };
        this.dom.header.host = this.dom.thead.parent();
        this.dom.footer.host = this.dom.tfoot.parent();
        var e = b.settings()[0];
        if (e._fixedHeader)
            throw "FixedHeader already initialised on table " + e.nTable.id;
        e._fixedHeader = this;
        this._constructor()
    };
    d.extend(i.prototype, {
        enable: function(b) {
            this.s.enable = b;
            this.c.header && this._modeChange("in-place", "header", !0);
            this.c.footer && this.dom.tfoot.length && this._modeChange("in-place", "footer", !0);
            this.update()
        },
        headerOffset: function(b) {
            b !== k && (this.c.headerOffset = b,
            this.update());
            return this.c.headerOffset
        },
        footerOffset: function(b) {
            b !== k && (this.c.footerOffset = b,
            this.update());
            return this.c.footerOffset
        },
        update: function() {
            this._positions();
            this._scroll(!0)
        },
        _constructor: function() {
            var b = this
              , a = this.s.dt;
            d(g).on("scroll" + this.s.namespace, function() {
                b._scroll()
            }).on("resize" + this.s.namespace, function() {
                b.s.position.windowHeight = d(g).height();
                b.update()
            });
            var e = d(".fh-fixedHeader");
            !this.c.headerOffset && e.length && (this.c.headerOffset = e.outerHeight());
            e = d(".fh-fixedFooter");
            !this.c.footerOffset && e.length && (this.c.footerOffset = e.outerHeight());
            a.on("column-reorder.dt.dtfc column-visibility.dt.dtfc draw.dt.dtfc column-sizing.dt.dtfc", function() {
                b.update()
            });
            a.on("destroy.dtfc", function() {
                a.off(".dtfc");
                d(g).off(b.s.namespace)
            });
            this._positions();
            this._scroll()
        },
        _clone: function(b, a) {
            var e = this.s.dt
              , c = this.dom[b]
              , f = "header" === b ? this.dom.thead : this.dom.tfoot;
            !a && c.floating ? c.floating.removeClass("fixedHeader-floating fixedHeader-locked") : (c.floating && (c.placeholder.remove(),
            this._unsize(b),
            c.floating.children().detach(),
            c.floating.remove()),
            c.floating = d(e.table().node().cloneNode(!1)).css("table-layout", "fixed").removeAttr("id").append(f).appendTo("body"),
            c.placeholder = f.clone(!1),
            c.host.prepend(c.placeholder),
            this._matchWidths(c.placeholder, c.floating))
        },
        _matchWidths: function(b, a) {
            var e = function(a) {
                return d(a, b).map(function() {
                    return d(this).width()
                }).toArray()
            }
              , c = function(b, c) {
                d(b, a).each(function(a) {
                    d(this).css({
                        width: c[a],
                        minWidth: c[a]
                    })
                })
            }
              , f = e("th")
              , e = e("td");
            c("th", f);
            c("td", e)
        },
        _unsize: function(b) {
            var a = this.dom[b].floating;
            a && ("footer" === b || "header" === b && !this.s.autoWidth) ? d("th, td", a).css({
                width: "",
                minWidth: ""
            }) : a && "header" === b && d("th, td", a).css("min-width", "")
        },
        _horizontal: function(b, a) {
            var e = this.dom[b]
              , c = this.s.position
              , d = this.s.scrollLeft;
            e.floating && d[b] !== a && (e.floating.css("left", c.left - a),
            d[b] = a)
        },
        _modeChange: function(b, a, e) {
            var c = this.dom[a]
              , f = this.s.position
              , g = d.contains(this.dom["footer" === a ? "tfoot" : "thead"][0], h.activeElement) ? h.activeElement : null;
            if ("in-place" === b) {
                if (c.placeholder && (c.placeholder.remove(),
                c.placeholder = null),
                this._unsize(a),
                "header" === a ? c.host.prepend(this.dom.thead) : c.host.append(this.dom.tfoot),
                c.floating)
                    c.floating.remove(),
                    c.floating = null
            } else
                "in" === b ? (this._clone(a, e),
                c.floating.addClass("fixedHeader-floating").css("header" === a ? "top" : "bottom", this.c[a + "Offset"]).css("left", f.left + "px").css("width", f.width + "px"),
                "footer" === a && c.floating.css("top", "")) : "below" === b ? (this._clone(a, e),
                c.floating.addClass("fixedHeader-locked").css("top", f.tfootTop - f.theadHeight).css("left", f.left + "px").css("width", f.width + "px")) : "above" === b && (this._clone(a, e),
                c.floating.addClass("fixedHeader-locked").css("top", f.tbodyTop).css("left", f.left + "px").css("width", f.width + "px"));
            g && g !== h.activeElement && g.focus();
            this.s.scrollLeft.header = -1;
            this.s.scrollLeft.footer = -1;
            this.s[a + "Mode"] = b
        },
        _positions: function() {
            var b = this.s.dt.table()
              , a = this.s.position
              , e = this.dom
              , b = d(b.node())
              , c = b.children("thead")
              , f = b.children("tfoot")
              , e = e.tbody;
            a.visible = b.is(":visible");
            a.width = b.outerWidth();
            a.left = b.offset().left;
            a.theadTop = c.offset().top;
            a.tbodyTop = e.offset().top;
            a.theadHeight = a.tbodyTop - a.theadTop;
            f.length ? (a.tfootTop = f.offset().top,
            a.tfootBottom = a.tfootTop + f.outerHeight(),
            a.tfootHeight = a.tfootBottom - a.tfootTop) : (a.tfootTop = a.tbodyTop + e.outerHeight(),
            a.tfootBottom = a.tfootTop,
            a.tfootHeight = a.tfootTop)
        },
        _scroll: function(b) {
            var a = d(h).scrollTop(), e = d(h).scrollLeft(), c = this.s.position, f;
            if (this.s.enable && (this.c.header && (f = !c.visible || a <= c.theadTop - this.c.headerOffset ? "in-place" : a <= c.tfootTop - c.theadHeight - this.c.headerOffset ? "in" : "below",
            (b || f !== this.s.headerMode) && this._modeChange(f, "header", b),
            this._horizontal("header", e)),
            this.c.footer && this.dom.tfoot.length))
                a = !c.visible || a + c.windowHeight >= c.tfootBottom + this.c.footerOffset ? "in-place" : c.windowHeight + a > c.tbodyTop + c.tfootHeight + this.c.footerOffset ? "in" : "above",
                (b || a !== this.s.footerMode) && this._modeChange(a, "footer", b),
                this._horizontal("footer", e)
        }
    });
    i.version = "3.1.2";
    i.defaults = {
        header: !0,
        footer: !1,
        headerOffset: 0,
        footerOffset: 0
    };
    d.fn.dataTable.FixedHeader = i;
    d.fn.DataTable.FixedHeader = i;
    d(h).on("init.dt.dtfh", function(b, a) {
        if ("dt" === b.namespace) {
            var e = a.oInit.fixedHeader
              , c = j.defaults.fixedHeader;
            if ((e || c) && !a._fixedHeader)
                c = d.extend({}, c, e),
                !1 !== e && new i(a,c)
        }
    });
    j.Api.register("fixedHeader()", function() {});
    j.Api.register("fixedHeader.adjust()", function() {
        return this.iterator("table", function(b) {
            (b = b._fixedHeader) && b.update()
        })
    });
    j.Api.register("fixedHeader.enable()", function(b) {
        return this.iterator("table", function(a) {
            (a = a._fixedHeader) && a.enable(b !== k ? b : !0)
        })
    });
    j.Api.register("fixedHeader.disable()", function() {
        return this.iterator("table", function(b) {
            (b = b._fixedHeader) && b.enable(!1)
        })
    });
    d.each(["header", "footer"], function(b, a) {
        j.Api.register("fixedHeader." + a + "Offset()", function(b) {
            var c = this.context;
            return b === k ? c.length && c[0]._fixedHeader ? c[0]._fixedHeader[a + "Offset"]() : k : this.iterator("table", function(c) {
                if (c = c._fixedHeader)
                    c[a + "Offset"](b)
            })
        })
    });
    return i
});