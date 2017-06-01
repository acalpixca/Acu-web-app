$(document).ready(function(){
	
	creaGoogleMap();
	/*
	var docHeight=$(document).height();
	var docWidth=$(document).width();
	//console.log('docHeight ' + docHeight + ' docWidth ' + docWidth);
	
	var online = navigator.onLine;
		// if(online)
	
	function pintaInterrogantes(){
		// console.log('entro en pinta interrogantes');
		var i;
		var topo=0;
		var left=0;
		var width=0;
		var color="";
		var fuente="";
		var par=true;
		var colores=['red','yellow','green','blue','pink','fuchsia','orange','grey'];
		var fuentes=['"Times New Roman"','Georgia','Arial','Verdana','Courier','Lucida'];
		
		var maxInterrogantes=Math.floor(Math.random()*docWidth/10);
		console.log('maxINterrogantes ' + maxInterrogantes);
		$('#wholeCanvasInterrogantes').empty();
		
		for (i=0;i<maxInterrogantes;i++) {
				width=Math.abs(Math.floor(Math.random()*docHeight/4)+20);
				topo=Math.abs(Math.floor(Math.random()*docHeight)-width);
				left=Math.abs(Math.floor(Math.random()*docWidth)-width);
				color=colores[Math.floor(Math.random()*colores.length)];
				fuente=fuentes[Math.floor(Math.random()*fuentes.length)];
				par=(Math.floor(Math.random()*10)%2===0);
				
				console.log('topo ' + topo + ' left ' + left + ' width ' + width + ' color ' + color + ' fuente ' + fuente + ' par ' + par );
				if (par){
					$('#wholeCanvasInterrogantes').append('<div style="position:fixed;font-size:'+width+'px;top:'+ topo+'px;left:'+left+'px;width:'+width+'px;height:auto;color:'+color+';font-family:'+fuente +'">?</div>');
				}
				else {
					$('#wholeCanvasInterrogantes').append('<div style="position:fixed;font-size:'+width+'px;top:'+ topo+'px;left:'+left+'px;width:'+width+'px;height:auto;color:'+color+';font-family:'+fuente+'>&iquest;</div>');
				}
		}
			
	}
	
	
	var refreshIntervalId = setInterval(pintaInterrogantes, 1000);
	
	$('#wholeCanvasInterrogantes').click(function(){
		clearInterval(refreshIntervalId);
		
		if ($('div#wholeCanvasInterrogantes').length){
			$('div#wholeCanvasInterrogantes').remove();
			createAirportAnimation();
		}
	});
*/	
});

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
		  //console.log("onLocation -> la posición como parametro ha sido " + latLng);
		  while (!onLoc && i<locations.length-1 ){
			  i++;
			  //console.log("onLocation -> iteración " +i + " comparando el parametro con " + locations[i].latLng.lat +","+ locations[i].latLng.lng);
			  if (areLocationsSimilar(loc,locations[i].latLng)) { //(JSON.stringify(latLng)===JSON.stringify(locations[i].latLng)) 
				  onLoc=true;
			  }
		  }
		  if (onLoc) { return(i);} else { return(-1); }
	  }
	  
	  function mapAllLocations(mapObject){
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

      function geolocationSuccess(position) {
      //invoked when geolocalization worked. Only difference is that it draws the current position, and a blue circle around it
		//and it also writes the address, but we'll remove this.
		var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // Write the formatted address Esta la quito porque no la necesito.
        //writeAddressName(userLatLng);

        var myOptions = {
          //zoom : 16,
		  zoom: 2,
          center : userLatLng,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        // Draw the map
        var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
        // Place the marker
        new google.maps.Marker({
          map: mapObject,
          position: userLatLng
        });
		
		mapAllLocations(mapObject);

		
        // Draw a circle around the user position to have an idea of the current localization accuracy
        var circle = new google.maps.Circle({
          center: userLatLng,
          radius: position.coords.accuracy,
          map: mapObject,
          fillColor: '#0000FF',
          fillOpacity: 0.5,
          strokeColor: '#0000FF',
          strokeOpacity: 1.0
        });
        //mapObject.fitBounds(circle.getBounds());
      } 

	
      function geolocationError(positionError) {
	  //invoked when geolocalization did not work. We still map all the locations on the map and make them clickable
	  //plus we make the start position our place in Santa
		console.log("entro en geoLocationError");
		var userLatLng = {lat:19.244687, lng:-99.076892} ; // casa en Santa
		var myOptions = {
		  zoom: 2,
          center : userLatLng,
          mapTypeId : google.maps.MapTypeId.ROADMAP
        };
        // Draw the map
        var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);
        // Place the markers
		mapAllLocations(mapObject);
      }

      function geolocateUser() {
		  //starting point for mapping stuff
        // If the browser supports the Geolocation API
        if (navigator.geolocation)
        {
          var positionOptions = {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
          };
          navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
        }
        else
          document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
      }


// este es el punto de entrada, que tendra que generar los elementos html y hacer las veces de document on load.

function creaGoogleMap(){
	//alert('voy a crear el google map ');
	// primero creo todos los elementos html que estan en indexMap.html, igualitos.
	
	// $('body').append('<div id="wholebodymap" class="transicion3"></div>'); <-- este es el original y funciona bien a pagina completa
	
	$('div#mapCanvas').append('<div id="wholebodymap" class="transicion3"></div>');
	
	$('#wholebodymap').append('<div id="map"></div>');
	$('#wholebodymap').append('<p id="error"></p>');
	
	//var docWidth=$(document).width();
	//var docHeight=$(document).height();
	
	var docWidth=$('div#mapCanvas').width();
	var docHeight=$('div#mapCanvas').height();	

	
	$map=$('div#map');
	$map.css({'width':docWidth,'height':docHeight});
	$('div#wholebodygalleryMaps').css({'width':docWidth,'height':docHeight});
	geolocateUser();
	$('.close').click(function(){
		console.log("evento click sobre .cerrar -> me han invocado");
		$('div#content').empty(); 
		$('div#wholebodygalleryMaps').css("visibility","hidden");
	});
	
	
}