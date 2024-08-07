/*!
 Buttons for DataTables 1.2.1
 ©2016 SpryMedia Ltd - datatables.net/license
*/
(function(d) {
    "function" === typeof define && define.amd ? define(["jquery", "datatables.net"], function(o) {
        return d(o, window, document)
    }) : "object" === typeof exports ? module.exports = function(o, n) {
        o || (o = window);
        if (!n || !n.fn.dataTable)
            n = require("datatables.net")(o, n).$;
        return d(n, o, o.document)
    }
    : d(jQuery, window, document)
}
)(function(d, o, n, l) {
    var i = d.fn.dataTable
      , u = 0
      , v = 0
      , k = i.ext.buttons
      , m = function(a, b) {
        !0 === b && (b = {});
        d.isArray(b) && (b = {
            buttons: b
        });
        this.c = d.extend(!0, {}, m.defaults, b);
        b.buttons && (this.c.buttons = b.buttons);
        this.s = {
            dt: new i.Api(a),
            buttons: [],
            listenKeys: "",
            namespace: "dtb" + u++
        };
        this.dom = {
            container: d("<" + this.c.dom.container.tag + "/>").addClass(this.c.dom.container.className)
        };
        this._constructor()
    };
    d.extend(m.prototype, {
        action: function(a, b) {
            var c = this._nodeToButton(a);
            if (b === l)
                return c.conf.action;
            c.conf.action = b;
            return this
        },
        active: function(a, b) {
            var c = this._nodeToButton(a)
              , e = this.c.dom.button.active
              , c = d(c.node);
            if (b === l)
                return c.hasClass(e);
            c.toggleClass(e, b === l ? !0 : b);
            return this
        },
        add: function(a, b) {
            var c = this.s.buttons;
            if ("string" === typeof b) {
                for (var e = b.split("-"), c = this.s, d = 0, h = e.length - 1; d < h; d++)
                    c = c.buttons[1 * e[d]];
                c = c.buttons;
                b = 1 * e[e.length - 1]
            }
            this._expandButton(c, a, !1, b);
            this._draw();
            return this
        },
        container: function() {
            return this.dom.container
        },
        disable: function(a) {
            a = this._nodeToButton(a);
            d(a.node).addClass(this.c.dom.button.disabled);
            return this
        },
        destroy: function() {
            d("body").off("keyup." + this.s.namespace);
            var a = this.s.buttons.slice(), b, c;
            b = 0;
            for (c = a.length; b < c; b++)
                this.remove(a[b].node);
            this.dom.container.remove();
            a = this.s.dt.settings()[0];
            b = 0;
            for (c = a.length; b < c; b++)
                if (a.inst === this) {
                    a.splice(b, 1);
                    break
                }
            return this
        },
        enable: function(a, b) {
            if (!1 === b)
                return this.disable(a);
            var c = this._nodeToButton(a);
            d(c.node).removeClass(this.c.dom.button.disabled);
            return this
        },
        name: function() {
            return this.c.name
        },
        node: function(a) {
            a = this._nodeToButton(a);
            return d(a.node)
        },
        remove: function(a) {
            var b = this._nodeToButton(a)
              , c = this._nodeToHost(a)
              , e = this.s.dt;
            if (b.buttons.length)
                for (var g = b.buttons.length - 1; 0 <= g; g--)
                    this.remove(b.buttons[g].node);
            b.conf.destroy && b.conf.destroy.call(e.button(a), e, d(a), b.conf);
            this._removeKey(b.conf);
            d(b.node).remove();
            a = d.inArray(b, c);
            c.splice(a, 1);
            return this
        },
        text: function(a, b) {
            var c = this._nodeToButton(a)
              , e = this.c.dom.collection.buttonLiner
              , e = c.inCollection && e && e.tag ? e.tag : this.c.dom.buttonLiner.tag
              , g = this.s.dt
              , h = d(c.node)
              , f = function(a) {
                return "function" === typeof a ? a(g, h, c.conf) : a
            };
            if (b === l)
                return f(c.conf.text);
            c.conf.text = b;
            e ? h.children(e).html(f(b)) : h.html(f(b));
            return this
        },
        _constructor: function() {
            var a = this
              , b = this.s.dt
              , c = b.settings()[0]
              , e = this.c.buttons;
            c._buttons || (c._buttons = []);
            c._buttons.push({
                inst: this,
                name: this.c.name
            });
            for (var c = 0, g = e.length; c < g; c++)
                this.add(e[c]);
            b.on("destroy", function() {
                a.destroy()
            });
            d("body").on("keyup." + this.s.namespace, function(b) {
                if (!n.activeElement || n.activeElement === n.body) {
                    var c = String.fromCharCode(b.keyCode).toLowerCase();
                    a.s.listenKeys.toLowerCase().indexOf(c) !== -1 && a._keypress(c, b)
                }
            })
        },
        _addKey: function(a) {
            a.key && (this.s.listenKeys += d.isPlainObject(a.key) ? a.key.key : a.key)
        },
        _draw: function(a, b) {
            a || (a = this.dom.container,
            b = this.s.buttons);
            a.children().detach();
            for (var c = 0, d = b.length; c < d; c++)
                a.append(b[c].inserter),
                b[c].buttons && b[c].buttons.length && this._draw(b[c].collection, b[c].buttons)
        },
        _expandButton: function(a, b, c, e) {
            for (var g = this.s.dt, h = 0, b = !d.isArray(b) ? [b] : b, f = 0, q = b.length; f < q; f++) {
                var j = this._resolveExtends(b[f]);
                if (j)
                    if (d.isArray(j))
                        this._expandButton(a, j, c, e);
                    else {
                        var p = this._buildButton(j, c);
                        if (p) {
                            e !== l ? (a.splice(e, 0, p),
                            e++) : a.push(p);
                            if (p.conf.buttons) {
                                var s = this.c.dom.collection;
                                p.collection = d("<" + s.tag + "/>").addClass(s.className);
                                p.conf._collection = p.collection;
                                this._expandButton(p.buttons, p.conf.buttons, !0, e)
                            }
                            j.init && j.init.call(g.button(p.node), g, d(p.node), j);
                            h++
                        }
                    }
            }
        },
        _buildButton: function(a, b) {
            var c = this.c.dom.button
              , e = this.c.dom.buttonLiner
              , g = this.c.dom.collection
              , h = this.s.dt
              , f = function(b) {
                return "function" === typeof b ? b(h, j, a) : b
            };
            b && g.button && (c = g.button);
            b && g.buttonLiner && (e = g.buttonLiner);
            if (a.available && !a.available(h, a))
                return !1;
            var q = function(a, b, c, e) {
                e.action.call(b.button(c), a, b, c, e);
                d(b.table().node()).triggerHandler("buttons-action.dt", [b.button(c), b, c, e])
            }
              , j = d("<" + c.tag + "/>").addClass(c.className).attr("tabindex", this.s.dt.settings()[0].iTabIndex).attr("aria-controls", this.s.dt.table().node().id).on("click.dtb", function(b) {
                b.preventDefault();
                !j.hasClass(c.disabled) && a.action && q(b, h, j, a);
                j.blur()
            }).on("keyup.dtb", function(b) {
                b.keyCode === 13 && !j.hasClass(c.disabled) && a.action && q(b, h, j, a)
            });
            "a" === c.tag.toLowerCase() && j.attr("href", "#");
            e.tag ? (g = d("<" + e.tag + "/>").html(f(a.text)).addClass(e.className),
            "a" === e.tag.toLowerCase() && g.attr("href", "#"),
            j.append(g)) : j.html(f(a.text));
            !1 === a.enabled && j.addClass(c.disabled);
            a.className && j.addClass(a.className);
            a.titleAttr && j.attr("title", a.titleAttr);
            a.namespace || (a.namespace = ".dt-button-" + v++);
            e = (e = this.c.dom.buttonContainer) && e.tag ? d("<" + e.tag + "/>").addClass(e.className).append(j) : j;
            this._addKey(a);
            return {
                conf: a,
                node: j.get(0),
                inserter: e,
                buttons: [],
                inCollection: b,
                collection: null
            }
        },
        _nodeToButton: function(a, b) {
            b || (b = this.s.buttons);
            for (var c = 0, d = b.length; c < d; c++) {
                if (b[c].node === a)
                    return b[c];
                if (b[c].buttons.length) {
                    var g = this._nodeToButton(a, b[c].buttons);
                    if (g)
                        return g
                }
            }
        },
        _nodeToHost: function(a, b) {
            b || (b = this.s.buttons);
            for (var c = 0, d = b.length; c < d; c++) {
                if (b[c].node === a)
                    return b;
                if (b[c].buttons.length) {
                    var g = this._nodeToHost(a, b[c].buttons);
                    if (g)
                        return g
                }
            }
        },
        _keypress: function(a, b) {
            var c = function(e) {
                for (var g = 0, h = e.length; g < h; g++) {
                    var f = e[g].conf
                      , q = e[g].node;
                    if (f.key)
                        if (f.key === a)
                            d(q).click();
                        else if (d.isPlainObject(f.key) && f.key.key === a && (!f.key.shiftKey || b.shiftKey))
                            if (!f.key.altKey || b.altKey)
                                if (!f.key.ctrlKey || b.ctrlKey)
                                    (!f.key.metaKey || b.metaKey) && d(q).click();
                    e[g].buttons.length && c(e[g].buttons)
                }
            };
            c(this.s.buttons)
        },
        _removeKey: function(a) {
            if (a.key) {
                var b = d.isPlainObject(a.key) ? a.key.key : a.key
                  , a = this.s.listenKeys.split("")
                  , b = d.inArray(b, a);
                a.splice(b, 1);
                this.s.listenKeys = a.join("")
            }
        },
        _resolveExtends: function(a) {
            for (var b = this.s.dt, c, e, g = function(c) {
                for (var e = 0; !d.isPlainObject(c) && !d.isArray(c); ) {
                    if (c === l)
                        return;
                    if ("function" === typeof c) {
                        if (c = c(b, a),
                        !c)
                            return !1
                    } else if ("string" === typeof c) {
                        if (!k[c])
                            throw "Unknown button type: " + c;
                        c = k[c]
                    }
                    e++;
                    if (30 < e)
                        throw "Buttons: Too many iterations";
                }
                return d.isArray(c) ? c : d.extend({}, c)
            }, a = g(a); a && a.extend; ) {
                if (!k[a.extend])
                    throw "Cannot extend unknown button type: " + a.extend;
                var h = g(k[a.extend]);
                if (d.isArray(h))
                    return h;
                if (!h)
                    return !1;
                c = h.className;
                a = d.extend({}, h, a);
                c && a.className !== c && (a.className = c + " " + a.className);
                var f = a.postfixButtons;
                if (f) {
                    a.buttons || (a.buttons = []);
                    c = 0;
                    for (e = f.length; c < e; c++)
                        a.buttons.push(f[c]);
                    a.postfixButtons = null
                }
                if (f = a.prefixButtons) {
                    a.buttons || (a.buttons = []);
                    c = 0;
                    for (e = f.length; c < e; c++)
                        a.buttons.splice(c, 0, f[c]);
                    a.prefixButtons = null
                }
                a.extend = h.extend
            }
            return a
        }
    });
    m.background = function(a, b, c) {
        c === l && (c = 400);
        a ? d("<div/>").addClass(b).css("display", "none").appendTo("body").fadeIn(c) : d("body > div." + b).fadeOut(c, function() {
            d(this).remove()
        })
    }
    ;
    m.instanceSelector = function(a, b) {
        if (!a)
            return d.map(b, function(a) {
                return a.inst
            });
        var c = []
          , e = d.map(b, function(a) {
            return a.name
        })
          , g = function(a) {
            if (d.isArray(a))
                for (var f = 0, q = a.length; f < q; f++)
                    g(a[f]);
            else
                "string" === typeof a ? -1 !== a.indexOf(",") ? g(a.split(",")) : (a = d.inArray(d.trim(a), e),
                -1 !== a && c.push(b[a].inst)) : "number" === typeof a && c.push(b[a].inst)
        };
        g(a);
        return c
    }
    ;
    m.buttonSelector = function(a, b) {
        for (var c = [], e = function(a, b, c) {
            for (var d, g, f = 0, h = b.length; f < h; f++)
                if (d = b[f])
                    g = c !== l ? c + f : f + "",
                    a.push({
                        node: d.node,
                        name: d.conf.name,
                        idx: g
                    }),
                    d.buttons && e(a, d.buttons, g + "-")
        }, g = function(a, b) {
            var f, h, i = [];
            e(i, b.s.buttons);
            f = d.map(i, function(a) {
                return a.node
            });
            if (d.isArray(a) || a instanceof d) {
                f = 0;
                for (h = a.length; f < h; f++)
                    g(a[f], b)
            } else if (null === a || a === l || "*" === a) {
                f = 0;
                for (h = i.length; f < h; f++)
                    c.push({
                        inst: b,
                        node: i[f].node
                    })
            } else if ("number" === typeof a)
                c.push({
                    inst: b,
                    node: b.s.buttons[a].node
                });
            else if ("string" === typeof a)
                if (-1 !== a.indexOf(",")) {
                    i = a.split(",");
                    f = 0;
                    for (h = i.length; f < h; f++)
                        g(d.trim(i[f]), b)
                } else if (a.match(/^\d+(\-\d+)*$/))
                    f = d.map(i, function(a) {
                        return a.idx
                    }),
                    c.push({
                        inst: b,
                        node: i[d.inArray(a, f)].node
                    });
                else if (-1 !== a.indexOf(":name")) {
                    var k = a.replace(":name", "");
                    f = 0;
                    for (h = i.length; f < h; f++)
                        i[f].name === k && c.push({
                            inst: b,
                            node: i[f].node
                        })
                } else
                    d(f).filter(a).each(function() {
                        c.push({
                            inst: b,
                            node: this
                        })
                    });
            else
                "object" === typeof a && a.nodeName && (i = d.inArray(a, f),
                -1 !== i && c.push({
                    inst: b,
                    node: f[i]
                }))
        }, h = 0, f = a.length; h < f; h++)
            g(b, a[h]);
        return c
    }
    ;
    m.defaults = {
        buttons: ["copy", "excel", "csv", "pdf", "print"],
        name: "main",
        tabIndex: 0,
        dom: {
            container: {
                tag: "div",
                className: "dt-buttons"
            },
            collection: {
                tag: "div",
                className: "dt-button-collection"
            },
            button: {
                tag: "a",
                className: "dt-button",
                active: "active",
                disabled: "disabled"
            },
            buttonLiner: {
                tag: "span",
                className: ""
            }
        }
    };
    m.version = "1.2.1";
    d.extend(k, {
        collection: {
            text: function(a) {
                return a.i18n("buttons.collection", "Collection")
            },
            className: "buttons-collection",
            action: function(a, b, c, e) {
                var a = c.offset()
                  , g = d(b.table().container())
                  , h = !1;
                d("div.dt-button-background").length && (h = d("div.dt-button-collection").offset(),
                d("body").trigger("click.dtb-collection"));
                e._collection.addClass(e.collectionLayout).css("display", "none").appendTo("body").fadeIn(e.fade);
                var f = e._collection.css("position");
                h && "absolute" === f ? e._collection.css({
                    top: h.top + 5,
                    left: h.left + 5
                }) : "absolute" === f ? (e._collection.css({
                    top: a.top + c.outerHeight(),
                    left: a.left
                }),
                c = a.left + e._collection.outerWidth(),
                g = g.offset().left + g.width(),
                c > g && e._collection.css("left", a.left - (c - g))) : (a = e._collection.height() / 2,
                a > d(o).height() / 2 && (a = d(o).height() / 2),
                e._collection.css("marginTop", -1 * a));
                e.background && m.background(!0, e.backgroundClassName, e.fade);
                setTimeout(function() {
                    d("div.dt-button-background").on("click.dtb-collection", function() {});
                    d("body").on("click.dtb-collection", function(a) {
                        if (!d(a.target).parents().andSelf().filter(e._collection).length) {
                            e._collection.fadeOut(e.fade, function() {
                                e._collection.detach()
                            });
                            d("div.dt-button-background").off("click.dtb-collection");
                            m.background(false, e.backgroundClassName, e.fade);
                            d("body").off("click.dtb-collection");
                            b.off("buttons-action.b-internal")
                        }
                    })
                }, 10);
                if (e.autoClose)
                    b.on("buttons-action.b-internal", function() {
                        d("div.dt-button-background").click()
                    })
            },
            background: !0,
            collectionLayout: "",
            backgroundClassName: "dt-button-background",
            autoClose: !1,
            fade: 400
        },
        copy: function(a, b) {
            if (k.copyHtml5)
                return "copyHtml5";
            if (k.copyFlash && k.copyFlash.available(a, b))
                return "copyFlash"
        },
        csv: function(a, b) {
            if (k.csvHtml5 && k.csvHtml5.available(a, b))
                return "csvHtml5";
            if (k.csvFlash && k.csvFlash.available(a, b))
                return "csvFlash"
        },
        excel: function(a, b) {
            if (k.excelHtml5 && k.excelHtml5.available(a, b))
                return "excelHtml5";
            if (k.excelFlash && k.excelFlash.available(a, b))
                return "excelFlash"
        },
        pdf: function(a, b) {
            if (k.pdfHtml5 && k.pdfHtml5.available(a, b))
                return "pdfHtml5";
            if (k.pdfFlash && k.pdfFlash.available(a, b))
                return "pdfFlash"
        },
        pageLength: function(a) {
            var a = a.settings()[0].aLengthMenu
              , b = d.isArray(a[0]) ? a[0] : a
              , c = d.isArray(a[0]) ? a[1] : a
              , e = function(a) {
                return a.i18n("buttons.pageLength", {
                    "-1": "Show all rows",
                    _: "Show %d rows"
                }, a.page.len())
            };
            return {
                extend: "collection",
                text: e,
                className: "buttons-page-length",
                autoClose: !0,
                buttons: d.map(b, function(a, b) {
                    return {
                        text: c[b],
                        action: function(b, c) {
                            c.page.len(a).draw()
                        },
                        init: function(b, c, d) {
                            var e = this
                              , c = function() {
                                e.active(b.page.len() === a)
                            };
                            b.on("length.dt" + d.namespace, c);
                            c()
                        },
                        destroy: function(a, b, c) {
                            a.off("length.dt" + c.namespace)
                        }
                    }
                }),
                init: function(a, b, c) {
                    var d = this;
                    a.on("length.dt" + c.namespace, function() {
                        d.text(e(a))
                    })
                },
                destroy: function(a, b, c) {
                    a.off("length.dt" + c.namespace)
                }
            }
        }
    });
    i.Api.register("buttons()", function(a, b) {
        b === l && (b = a,
        a = l);
        return this.iterator(!0, "table", function(c) {
            if (c._buttons)
                return m.buttonSelector(m.instanceSelector(a, c._buttons), b)
        }, !0)
    });
    i.Api.register("button()", function(a, b) {
        var c = this.buttons(a, b);
        1 < c.length && c.splice(1, c.length);
        return c
    });
    i.Api.registerPlural("buttons().active()", "button().active()", function(a) {
        return a === l ? this.map(function(a) {
            return a.inst.active(a.node)
        }) : this.each(function(b) {
            b.inst.active(b.node, a)
        })
    });
    i.Api.registerPlural("buttons().action()", "button().action()", function(a) {
        return a === l ? this.map(function(a) {
            return a.inst.action(a.node)
        }) : this.each(function(b) {
            b.inst.action(b.node, a)
        })
    });
    i.Api.register(["buttons().enable()", "button().enable()"], function(a) {
        return this.each(function(b) {
            b.inst.enable(b.node, a)
        })
    });
    i.Api.register(["buttons().disable()", "button().disable()"], function() {
        return this.each(function(a) {
            a.inst.disable(a.node)
        })
    });
    i.Api.registerPlural("buttons().nodes()", "button().node()", function() {
        var a = d();
        d(this.each(function(b) {
            a = a.add(b.inst.node(b.node))
        }));
        return a
    });
    i.Api.registerPlural("buttons().text()", "button().text()", function(a) {
        return a === l ? this.map(function(a) {
            return a.inst.text(a.node)
        }) : this.each(function(b) {
            b.inst.text(b.node, a)
        })
    });
    i.Api.registerPlural("buttons().trigger()", "button().trigger()", function() {
        return this.each(function(a) {
            a.inst.node(a.node).trigger("click")
        })
    });
    i.Api.registerPlural("buttons().containers()", "buttons().container()", function() {
        var a = d();
        d(this.each(function(b) {
            a = a.add(b.inst.container())
        }));
        return a
    });
    i.Api.register("button().add()", function(a, b) {
        1 === this.length && this[0].inst.add(b, a);
        return this.button(a)
    });
    i.Api.register("buttons().destroy()", function() {
        this.pluck("inst").unique().each(function(a) {
            a.destroy()
        });
        return this
    });
    i.Api.registerPlural("buttons().remove()", "buttons().remove()", function() {
        this.each(function(a) {
            a.inst.remove(a.node)
        });
        return this
    });
    var r;
    i.Api.register("buttons.info()", function(a, b, c) {
        var e = this;
        if (!1 === a)
            return d("#datatables_buttons_info").fadeOut(function() {
                d(this).remove()
            }),
            clearTimeout(r),
            r = null,
            this;
        r && clearTimeout(r);
        d("#datatables_buttons_info").length && d("#datatables_buttons_info").remove();
        d('<div id="datatables_buttons_info" class="dt-button-info"/>').html(a ? "<h2>" + a + "</h2>" : "").append(d("<div/>")["string" === typeof b ? "html" : "append"](b)).css("display", "none").appendTo("body").fadeIn();
        c !== l && 0 !== c && (r = setTimeout(function() {
            e.buttons.info(!1)
        }, c));
        return this
    });
    i.Api.register("buttons.exportData()", function(a) {
        if (this.context.length) {
            for (var b = new i.Api(this.context[0]), c = d.extend(!0, {}, {
                rows: null,
                columns: "",
                modifier: {
                    search: "applied",
                    order: "applied"
                },
                orthogonal: "display",
                stripHtml: !0,
                stripNewlines: !0,
                decodeEntities: !0,
                trim: !0,
                format: {
                    header: function(a) {
                        return e(a)
                    },
                    footer: function(a) {
                        return e(a)
                    },
                    body: function(a) {
                        return e(a)
                    }
                }
            }, a), e = function(a) {
                if ("string" !== typeof a)
                    return a;
                c.stripHtml && (a = a.replace(/<[^>]*>/g, ""));
                c.trim && (a = a.replace(/^\s+|\s+$/g, ""));
                c.stripNewlines && (a = a.replace(/\n/g, " "));
                c.decodeEntities && (t.innerHTML = a,
                a = t.value);
                return a
            }, a = b.columns(c.columns).indexes().map(function(a) {
                return c.format.header(b.column(a).header().innerHTML, a)
            }).toArray(), g = b.table().footer() ? b.columns(c.columns).indexes().map(function(a) {
                var d = b.column(a).footer();
                return c.format.footer(d ? d.innerHTML : "", a)
            }).toArray() : null, h = b.rows(c.rows, c.modifier).indexes().toArray(), h = b.cells(h, c.columns).render(c.orthogonal).toArray(), f = a.length, k = 0 < f ? h.length / f : 0, j = Array(k), m = 0, l = 0; l < k; l++) {
                for (var o = Array(f), n = 0; n < f; n++)
                    o[n] = c.format.body(h[m], n, l),
                    m++;
                j[l] = o
            }
            return {
                header: a,
                footer: g,
                body: j
            }
        }
    });
    var t = d("<textarea/>")[0];
    d.fn.dataTable.Buttons = m;
    d.fn.DataTable.Buttons = m;
    d(n).on("init.dt plugin-init.dt", function(a, b) {
        if ("dt" === a.namespace) {
            var c = b.oInit.buttons || i.defaults.buttons;
            c && !b._buttons && (new m(b,c)).container()
        }
    });
    i.ext.feature.push({
        fnInit: function(a) {
            var a = new i.Api(a)
              , b = a.init().buttons || i.defaults.buttons;
            return (new m(a,b)).container()
        },
        cFeature: "B"
    });
    return m
});
