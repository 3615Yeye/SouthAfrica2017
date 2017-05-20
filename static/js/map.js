var mymap = L.map('mapid').setView([-33.970, 18.563], 9);

L.tileLayer('https://api.mapbox.com/styles/v1/ronanlp/cj2ol4jdo00342smt0zcjn2ne/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9uYW5scCIsImEiOiJjajJvbDFrMTYwMDRpMzNxb2N1YXZoZmZxIn0.2p4QVjbpSOP1GtgkTWpzLg', {foo: 'bar'}).addTo(mymap);

$('.gallerie').magnificPopup({
  delegate: 'a', // child items selector, by clicking on it popup will open
  type: 'image',
  // other options
  gallery:{
    enabled:true
  }
});
