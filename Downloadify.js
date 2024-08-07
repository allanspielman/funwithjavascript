/* Downloadify 0.2 (c) 2009 by Douglas Neiner. Licensed under the MIT license */
/* See http://github.com/dcneiner/Downloadify for license and more info */
(function() {
    Downloadify = window.Downloadify = {
        queue: {},
        uid: new Date().getTime(),
        getTextForSave: function(a) {
            var b = Downloadify.queue[a];
            if (b)
                return b.getData();
            return ""
        },
        getFileNameForSave: function(a) {
            var b = Downloadify.queue[a];
            if (b)
                return b.getFilename();
            return ""
        },
        getDataTypeForSave: function(a) {
            var b = Downloadify.queue[a];
            if (b)
                return b.getDataType();
            return ""
        },
        saveComplete: function(a) {
            var b = Downloadify.queue[a];
            if (b)
                b.complete();
            return true
        },
        saveCancel: function(a) {
            var b = Downloadify.queue[a];
            if (b)
                b.cancel();
            return true
        },
        saveError: function(a) {
            var b = Downloadify.queue[a];
            if (b)
                b.error();
            return true
        },
        addToQueue: function(a) {
            Downloadify.queue[a.queue_name] = a
        },
        getUID: function(a) {
            if (a.id == "")
                a.id = 'downloadify_' + Downloadify.uid++;
            return a.id
        }
    };
    Downloadify.create = function(a, b) {
        var c = (typeof (a) == "string" ? document.getElementById(a) : a);
        return new Downloadify.Container(c,b)
    }
    ;
    Downloadify.Container = function(d, e) {
        var f = this;
        f.el = d;
        f.enabled = true;
        f.dataCallback = null;
        f.filenameCallback = null;
        f.data = null;
        f.filename = null;
        var g = function() {
            f.options = e;
            if (!f.options.append)
                f.el.innerHTML = "";
            f.flashContainer = document.createElement('span');
            f.el.appendChild(f.flashContainer);
            f.queue_name = Downloadify.getUID(f.flashContainer);
            if (typeof (f.options.filename) === "function")
                f.filenameCallback = f.options.filename;
            else if (f.options.filename)
                f.filename = f.options.filename;
            if (typeof (f.options.data) === "function")
                f.dataCallback = f.options.data;
            else if (f.options.data)
                f.data = f.options.data;
            var a = {
                queue_name: f.queue_name,
                width: f.options.width,
                height: f.options.height
            };
            var b = {
                allowScriptAccess: 'always'
            };
            var c = {
                id: f.flashContainer.id,
                name: f.flashContainer.id
            };
            if (f.options.enabled === false)
                f.enabled = false;
            if (f.options.transparent === true)
                b.wmode = "transparent";
            if (f.options.downloadImage)
                a.downloadImage = f.options.downloadImage;
            swfobject.embedSWF(f.options.swf, f.flashContainer.id, f.options.width, f.options.height, "10", null, a, b, c);
            Downloadify.addToQueue(f)
        };
        f.enable = function() {
            var a = document.getElementById(f.flashContainer.id);
            a.setEnabled(true);
            f.enabled = true
        }
        ;
        f.disable = function() {
            var a = document.getElementById(f.flashContainer.id);
            a.setEnabled(false);
            f.enabled = false
        }
        ;
        f.getData = function() {
            if (!f.enabled)
                return "";
            if (f.dataCallback)
                return f.dataCallback();
            else if (f.data)
                return f.data;
            else
                return ""
        }
        ;
        f.getFilename = function() {
            if (f.filenameCallback)
                return f.filenameCallback();
            else if (f.filename)
                return f.filename;
            else
                return ""
        }
        ;
        f.getDataType = function() {
            if (f.options.dataType)
                return f.options.dataType;
            return "string"
        }
        ;
        f.complete = function() {
            if (typeof (f.options.onComplete) === "function")
                f.options.onComplete()
        }
        ;
        f.cancel = function() {
            if (typeof (f.options.onCancel) === "function")
                f.options.onCancel()
        }
        ;
        f.error = function() {
            if (typeof (f.options.onError) === "function")
                f.options.onError()
        }
        ;
        g()
    }
    ;
    Downloadify.defaultOptions = {
        swf: 'media/downloadify.swf',
        downloadImage: 'images/download.png',
        width: 100,
        height: 30,
        transparent: true,
        append: false,
        dataType: "string"
    }
}
)();
if (typeof (jQuery) != "undefined") {
    (function($) {
        $.fn.downloadify = function(b) {
            return this.each(function() {
                b = $.extend({}, Downloadify.defaultOptions, b);
                var a = Downloadify.create(this, b);
                $(this).data('Downloadify', a)
            })
        }
    }
    )(jQuery)
}
;if (typeof (MooTools) != 'undefined') {
    Element.implement({
        downloadify: function(a) {
            a = $merge(Downloadify.defaultOptions, a);
            return this.store('Downloadify', Downloadify.create(this, a))
        }
    })
}
;