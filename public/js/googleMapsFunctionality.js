$(document).ready(function(){
	
	creaGoogleMap();

});


var markers=[];
	
	
// helper functions para montar los mapas

function writeAddressName(latLng) {
		// legacy total. No lo vamos a usar.
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          "location": latLng
        },
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK)
            document.getElementById("address").innerHTML = results[0].formatted_address;
          else
            document.getElementById("error").innerHTML += "Unable to retrieve your address" + "<br />";
        });
      }
	  
 function areLocationsSimilar(loc1,loc2){
	// comparamos dos sets de coordenadas, si son suficientemente parecidos true else false
	var epsilon=0.00001;
	return((Math.abs(loc1.lat-loc2.lat)<epsilon) && (Math.abs(loc1.lng-loc2.lng)<epsilon));
}
	  
function onLocation(latLng){
	// si latlong corresponde a una location retornamos el indice el la lista
		  // si no, devolvemos -1
		  var onLoc=false;
		  var loc={lat:latLng.lat(),lng:latLng.lng()};
		  var i=-1;
		  //console.log("onLocation -> la posici�n como parametro ha sido " + latLng);
		  while (!onLoc && i<locations.length-1 ){
			  i++;
			  //console.log("onLocation -> iteraci�n " +i + " comparando el parametro con " + locations[i].latLng.lat +","+ locations[i].latLng.lng);
			  if (areLocationsSimilar(loc,locations[i].latLng)) { //(JSON.stringify(latLng)===JSON.stringify(locations[i].latLng)) 
				  onLoc=true;
			  }
		  }
		  if (onLoc) { return(i);} else { return(-1); }
	  }
	  
/*	  function mapAllLocations(mapObject){
		  // mapeamos todas las ubicaciones de la lista locations.
		  // si hay mensaje de amigos en la ubicación, cambiamos el icono a un sobre
		var userLatLng;
		var marker;
		var strIcon; //='images/yellowEnvelope.png' o '';
		var zIndexInt;
		
		var folderName='mediaMetaData.js';
		var sublocation="";
		var location={};
		for(var i=0;i<locations.length;i++){
			strIcon='images/yellowEnvelope.png';
			zIndexInt=google.maps.Marker.MAX_ZINDEX + 1;
		// console.log(locations[i].name);
			userLatLng=locations[i].latLng;
			if (!locations[i].message){
				// normal marker. Red bullet, any depth. Alternative is envelope, on top.
				strIcon='';
				zIndexInt=0;
			}
				marker=new google.maps.Marker({
				map:mapObject,
				icon:strIcon, // value depends on locations[i].message===true
				zIndex:zIndexInt, // same as above. Envelope always on top
				position: userLatLng				
			});
			google.maps.event.addListener(marker,'click',function(){
				mapObject.setZoom(9);
				mapObject.setCenter(this.getPosition());
				//console.log("añado evento para clicazo en " + myMarker[i].getPosition());
				var markerPosition=this.getPosition();
				var j=onLocation(markerPosition);
				if (j>=0) {
					//alert(locations[onLocation(this.getPosition())].name);
					console.log(locations[onLocation(this.getPosition())].photos);
					
					// esta linea de aqui abajo hay que sustituirla por algo asi como....
					// creaResumenLocation es el callback que se encargará de crear la pantalla que toca.
					sublocation=locations[onLocation(this.getPosition())].photos;
					location=locations[onLocation(this.getPosition())];
					loadScript(folderBase+sublocation,folderName,location,creaResumenLocation);
					
					
					// --> inicio linea a sustituir
					// loadScript(locations[onLocation(this.getPosition())].photos);
					// --->fin linea a sustituir
					
					// esta última es la acción que tomamos: cargar la galería con las fotos.
					// esta última la vamos a cambiar sustancialmente, es el enlace entre
					// la cartografía, y la galería.
				}
				else {
					// el marker no está en ninguna ubicación. Referimos a la primera de la matriz.
					// por decir algo...
					//alert(locations[0].name);
				}
			});
			
		}
	}
*/

function geolocationSuccess(position) {
    //invoked when geolocalization worked. Only difference is that it draws the current position, and a blue circle around it
	//and it also writes the address, but we'll remove this.
	var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    // Write the formatted address Esta la quito porque no la necesito.
    //writeAddressName(userLatLng);

/* aquí un poco de jQuery para enchufar esa latitud y longitud en los input del formulario */
	$("#calculadoraSol input[name=latitud]").val(position.coords.latitude);
	$("#calculadoraSol input[name=longitud]").val(position.coords.longitude);
/* fin de manipular el formulario */

    var myOptions = {
		//zoom : 16,
		zoom: 2,
        center : userLatLng,
        mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
    // Place the marker
    var marker=new google.maps.Marker({
        map: mapObject,
        position: userLatLng
    });
	markers.push(marker);
    // Draw a circle around the user position to have an idea of the current localization accuracy
    /*var circle = new google.maps.Circle({
        center: userLatLng,
        radius: position.coords.accuracy,
        map: mapObject,
        fillColor: '#0000FF',
        fillOpacity: 0.5,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0
    });*/
    //mapObject.fitBounds(circle.getBounds());
	
	// Aquí tenemos que poner el listener de clickazos del mapa.

	google.maps.event.addListener(mapObject, 'click', function(event) {
		mapZoom = mapObject.getZoom();
		startLocation = event.latLng;
		
		var marker=new google.maps.Marker({
			map:mapObject,
			//icon:strIcon, // value depends on locations[i].message===true
			//zIndex:zIndexInt, // same as above. Envelope always on top
			position: startLocation				
		});
		
		if (markers.length>0) {
			markers[0].setMap(null);
			markers=[];
		}
		markers.push(marker); 
		
		console.log(JSON.stringify(startLocation));
		$("#calculadoraSol input[name=latitud]").val(startLocation.lat);
		$("#calculadoraSol input[name=longitud]").val(startLocation.lng);
		// setTimeout(placeMarker, 600);
	});
	
	// fin listener de clickazos del mapa.
} 

	
function geolocationError(positionError) {
	//invoked when geolocalization did not work. We make the start position our place in Santa y NO ponemos listener de clickazos
	console.log("entro en geoLocationError");
	var userLatLng = {lat:19.244687, lng:-99.076892} ; // casa en Santa
		
	// y paso esa latitud longitud como valor de los elementos items del formulario
		
	$("#calculadoraSol input[name=latitud]").val(userLatLng.lat);
	$("#calculadoraSol input[name=longitud]").val(userLatLng.lng);
		 
	// fin manipulación items del form
	var myOptions = {
		zoom: 2,
        center : userLatLng,
        mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
}


function geolocateUser() {
	//starting point for mapping stuff
    if (navigator.geolocation) { // If the browser supports the Geolocation API
        var positionOptions = {
			enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
        };
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
    }
    else {
        document.getElementById("error").innerHTML += "Tu navegador no soporta el API de geolocalizaci&oacute;n";
	}
}


// este es el punto de entrada, que tendra que generar los elementos html y hacer las veces de document on load.

function creaGoogleMap(){
	
	$('div#mapCanvas').append('<div id="wholebodymap" class="transicion3"></div>');
	$('#wholebodymap').append('<div id="map"></div>');
	$('#wholebodymap').append('<p id="error"></p>');
	
	var docWidth=$('div#mapCanvas').width();
	var docHeight=$('div#mapCanvas').height();	

	$map=$('div#map');
	$map.css({'width':docWidth,'height':docHeight});
	$('div#wholebodygalleryMaps').css({'width':docWidth,'height':docHeight});
	geolocateUser();
}