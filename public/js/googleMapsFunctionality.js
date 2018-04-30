var map, lat, lng;
$(document).ready(function(){

	function areLocationsSimilar(loc1,loc2){
	  // comparamos dos sets de coordenadas, si son suficientemente parecidos true else false
	  var epsilon=0.00001;
	  return((Math.abs(loc1.lat-loc2.lat)<epsilon) && (Math.abs(loc1.lng-loc2.lng)<epsilon));
  };

	function enlazarMarcador(e){
	  lat = e.latLng.lat();   // guarda coords para marca siguiente
	  lng = e.latLng.lng();
	  $("#calculadoraSol input[name=latitud]").val(lat); // que esta nueva lat, lng sea la del form de consulta
	  $("#calculadoraSol input[name=longitud]").val(lng);

	  map.removeMarkers(); // quitamos el marcador anterior
	  map.addMarker({ lat: lat, lng: lng});  // pone marcador en mapa
	};

	function geolocalizar(){
	  GMaps.geolocate({
		 success: function(position){
			lat = position.coords.latitude;  // guarda coords en lat y lng
			lng = position.coords.longitude;

			map = new GMaps({  // muestra mapa centrado en coords [lat, lng]
			  el: '#map',
			  lat: lat,
			  lng: lng,
			  click: enlazarMarcador,
			  tap: enlazarMarcador
			});
			map.addMarker({ lat: lat, lng: lng});  // marcador en [lat, lng]
			$("#calculadoraSol input[name=latitud]").val(lat);
			$("#calculadoraSol input[name=longitud]").val(lng);
		 },
		 error: function(error) { alert('Geolocalización falla: '+error.message); },
		 not_supported: function(){ alert("Su navegador no soporta geolocalización"); },
	  });
	};
	geolocalizar();
 });
