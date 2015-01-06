/********** Tree Zoom Functionality **********/
function initialize(){
$("#addRandomObject").click (function(){
    $('svg').remove();
    addRandomObjects(1);
});
$("#addRandomObjects").click (function(){
    $('svg').remove();
    addRandomObjects(10); 
});
$("#zoom").click (function(e){
    e.preventDefault();
    $("svg").attr("class", "zoomIn" );
    $("#clusterZone").attr("class", "scrolling");
});
$("#zoomOut").click (function(e){
    e.preventDefault();
    $("svg").attr("class", "zoomOut" );
    $("#clusterZone").attr("class", "scrolling");
});
}
$(initialize);