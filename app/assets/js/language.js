(function ($) {
    $.fn.translate = function (options) {
        var that = this; //a reference to ourselves
        var settings = {
            css: "trn",
            lang: "en"
        };
        settings = $.extend(settings, options || {});
        if (settings.css.lastIndexOf(".", 0) !== 0)   //doesn't start with '.'
            settings.css = "." + settings.css;

        var t = settings.t;
        //public methods
        this.lang = function (l) {
            if (l) {
                settings.lang = l;
                this.translate(settings);  //translate everything
            }

            return settings.lang;
        };
        this.get = function (index) {
            var res = index;

            try {
                res = t[index][settings.lang];
            }
            catch (err) {
                //not found, return index
                return index;
            }

            if (res)
                return res;
            else
                return index;
        };
        this.g = this.get;
        //main
        this.find(settings.css).each(function (i) {
            var $this = $(this);

            var trn_key = $this.attr("data-trn-key");
            if (!trn_key) {
                trn_key = $this.html();
                $this.attr("data-trn-key", trn_key);   //store key for next time
            }
            trn_key = trn_key.trim()
            $this.html(that.get(trn_key));
        });
        return this;
    };
})(jQuery);

function set_language(language) {
    var language_preference = localStorage.getItem("language");
    if (language_preference) {
        language = language_preference;
    }
    $('body').translate({ lang: language, t: lang_dict });
    $("#language").val(language);
}

function set_preference(language) {
    localStorage.setItem("language", language);
    set_language(language);
}
function clearStorage() {

    let session = sessionStorage.getItem('ref');

    if (session == null) {

        localStorage.removeItem('language');

    }
    sessionStorage.setItem('ref', 1);

}
window.addEventListener('load', clearStorage);