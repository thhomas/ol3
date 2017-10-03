goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');
goog.require('ol.source.Zoomify');


var layer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var map = new ol.Map({
  layers: [layer],
  target: 'map',
  view: new ol.View({
    center: [653600, 5723680],
    zoom: 5
  }),
});

const req = new XMLHttpRequest();
var iipUrl = 'http://wxs.ign.fr/61fs25ymczag0c67naqvvmap/iipsrv-svims?FIF=GEOSUD.SVIMS/213129/PARIS-PARC_2016050639551578/scn/MS/IMG_PHR1B_MS_201605061059115_SEN_1782241101-002_R1C1.JP2';
req.open('GET', iipUrl + '&obj=IIP,1.0&obj=pic-tiles&obj=Max-size&obj=Tile-size&obj=Resolution-number&obj=Component-number', true);
req.send(null);
req.onload = function(response) {
  var data = response.currentTarget.responseText;
  var sizeImage = [parseFloat(data.split('\n')[1].split(':')[1].split(' ')[0]), parseFloat(data.split('\n')[1].split(':')[1].split(' ')[1])];
  var size = sizeImage;
  var center = ol.proj.transform([2.253070, 48.841408], 'EPSG:4326', 'EPSG:3857');
  var extent = ol.proj.transformExtent([2.18110785234, 48.7939509319, 2.32535583584, 48.8906955634], 'EPSG:4326', 'EPSG:3857');
  var scale = [ol.extent.getWidth(extent)/size[0], ol.extent.getHeight(extent)/size[1]];
  /*var iipLayer = new ol.layer.Image({
    source: new ol.source.GeoImage({
      url: iipUrl + '&cvt=jpeg&wid=' + size[0] + '&hei=' + size[1],
      imageCenter: center,
      imageScale: scale
    })
  });
  olMap.addLayer(iipLayer);*/
  var zoomifyLayer = new ol.layer.Tile({
    source: new ol.source.Zoomify({
      url : iipUrl + '&JTL={z},{tileIndex}',
      size: [ol.extent.getWidth(extent), ol.extent.getHeight(extent)],
      extent: extent,
      resolutions: map.getView().getResolutions(),
      tileSize: 256,
      nbResolutions: 5,
      crossOrigin: 'anonymous'
    })
  });
  map.addLayer(zoomifyLayer);
}
