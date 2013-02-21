require([
// Libs
'jquery',
'underscore',
'backbone',
// Deps
"app",
"views/layout"
],
function($, _, BB, app, Layout) {

    app.views.layout = new Layout();
    app.views.layout.render();
    app.methods.start();

    $(document).on("click", "a[href]:not([data-bypass])", function(evt) {

        var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
        var root = location.protocol + "//" + location.host + app.root;

        if (href.prop.slice(0, root.length) === root) {
          evt.preventDefault();
          BB.history.navigate(href.attr, true);
        }

    });

});