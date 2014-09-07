
/* 
 * If running inside bl.ocks.org we want to resize the iframe to fit both graphs
 */
if(parent.document.getElementsByTagName("iframe")[0]) {
    parent.document.getElementsByTagName("iframe")[0].setAttribute('style', 'height: 650px !important');
}

/*
 * Note how the 'data' object is added to here before rendering to provide decoration information.
 * <p>
 * This is purposefully done here instead of in data.js as an example of how data would come from a server
 * and then have presentation information injected into it (rather than as separate arguments in another object)
 * and passed into LineGraph.
 *
 * Also, CSS can be used to style colors etc, but this is also doable via the 'data' object so that the styling
 * of different data points can be done in code which is often more natural for display names, legends, line colors etc
 */
// add presentation logic for 'data' object using optional data arguments
var data = '';
var url = '/data';
$.ajax({
    dataType: 'json',
    url: url,
    success: function(d) {
	data = d;
	console.log(d);
    },
    async: false 
});
var colors = ['black','brown','green','red','orange','darkred','darkgreen','purple'];

// create graph now that we've added presentation config
var graphs = new Array(8);
for (var i = 0; i < 8; i++) {
    graphs[i] = new LineGraph({containerId: 'graph'+Number(i+1), data: data[i]});
    data[i]["displayNames"] = ["channel " + Number(i + 1)];
    data[i]["colors"] = [colors[i]];
    data[i]["scale"] = "pow";
}

setInterval(function() {
    var newData = [];
    var data = '';
    var url = '/data';
    $.ajax({
        dataType: 'json',
        url: url,
        success: function(d) {
	    data = d;
	    console.log(d);
            for(var i=0; i<8; i++) {
                graphs[i].updateData(data[i]);
            }
        },
        async: true
    });
}, 500);

