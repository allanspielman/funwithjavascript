(function(g) {
    "function" === typeof define && define.amd ? define(["jquery", "datatables.net", "datatables.net-buttons"], function(d) {
        return g(d, window, document)
    }) : "object" === typeof exports ? module.exports = function(d, e) {
        d || (d = window);
        if (!e || !e.fn.dataTable)
            e = require("datatables.net")(d, e).$;
        e.fn.dataTable.Buttons || require("datatables.net-buttons")(d, e);
        return g(e, d, d.document)
    }
    : g(jQuery, window, document)
}
)(function(g, d, e, h) {
    d = g.fn.dataTable;
    g.extend(d.ext.buttons, {
        colvis: function(a, b) {
            return {
                extend: "collection",
                text: function(a) {
                    return a.i18n("buttons.colvis", "Column visibility")
                },
                className: "buttons-colvis",
                buttons: [{
                    extend: "columnsToggle",
                    columns: b.columns
                }]
            }
        },
        columnsToggle: function(a, b) {
            return a.columns(b.columns).indexes().map(function(a) {
                return {
                    extend: "columnToggle",
                    columns: a
                }
            }).toArray()
        },
        columnToggle: function(a, b) {
            return {
                extend: "columnVisibility",
                columns: b.columns
            }
        },
        columnsVisibility: function(a, b) {
            return a.columns(b.columns).indexes().map(function(a) {
                return {
                    extend: "columnVisibility",
                    columns: a,
                    visibility: b.visibility
                }
            }).toArray()
        },
        columnVisibility: {
            columns: h,
            text: function(a, b, c) {
                return c._columnText(a, c.columns)
            },
            className: "buttons-columnVisibility",
            action: function(a, b, c, f) {
                a = b.columns(f.columns);
                b = a.visible();
                a.visible(f.visibility !== h ? f.visibility : !(b.length && b[0]))
            },
            init: function(a, b, c) {
                var f = this
                  , d = a.column(c.columns);
                a.on("column-visibility.dt" + c.namespace, function(a, b) {
                    b.bDestroying || f.active(d.visible())
                }).on("column-reorder.dt" + c.namespace, function(b, d, e) {
                    1 === a.columns(c.columns).count() && ("number" === typeof c.columns && (c.columns = e.mapping[c.columns]),
                    b = a.column(c.columns),
                    f.text(c._columnText(a, c.columns)),
                    f.active(b.visible()))
                });
                this.active(d.visible())
            },
            destroy: function(a, b, c) {
                a.off("column-visibility.dt" + c.namespace).off("column-reorder.dt" + c.namespace)
            },
            _columnText: function(a, b) {
                var c = a.column(b).index();
                return a.settings()[0].aoColumns[c].sTitle.replace(/\n/g, " ").replace(/<.*?>/g, "").replace(/^\s+|\s+$/g, "")
            }
        },
        colvisRestore: {
            className: "buttons-colvisRestore",
            text: function(a) {
                return a.i18n("buttons.colvisRestore", "Restore visibility")
            },
            init: function(a, b, c) {
                c._visOriginal = a.columns().indexes().map(function(b) {
                    return a.column(b).visible()
                }).toArray()
            },
            action: function(a, b, c, d) {
                b.columns().every(function(a) {
                    a = b.colReorder && b.colReorder.transpose ? b.colReorder.transpose(a, "toOriginal") : a;
                    this.visible(d._visOriginal[a])
                })
            }
        },
        colvisGroup: {
            className: "buttons-colvisGroup",
            action: function(a, b, c, d) {
                b.columns(d.show).visible(!0, !1);
                b.columns(d.hide).visible(!1, !1);
                b.columns.adjust()
            },
            show: [],
            hide: []
        }
    });
    return d.Buttons
});