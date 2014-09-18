$(document).ready(function(){

	var $overlay = $('<div id = "overlay"></div>');	//overlay will be used for galleries
	$("#maingallery").append($overlay);		//appended to the 'maingallery' section i.e. body of index.html



	


	//2d array holds the cities of photos (where markers are on map) + their info (cover photo + root of their gallery)
	//6th element of each city's array holds the root of its photo gallery
	var cities = [
		['Sevilla', 37.3876812,-5.9787046, 1, "https://s3.amazonaws.com/europe.photos/SEVILLA/SEVILLA2.JPG", "morocco_gallery"],
		['Paris', 48.8588589,2.3470599, 2, "https://s3.amazonaws.com/europe.photos/PARIS(RESIZED)/PARIS12.JPG", "paris_gallery"],
		['Rome', 41.9100711,12.5359979, 3, "https://s3.amazonaws.com/europe.photos/ROME/ROME8.JPG", "rome_gallery"]
	]

	//initializes the info window (specific info will be placed later, once a certain marker is clicked)
	var infowindow = new google.maps.InfoWindow({
		content : '',
		maxWidth: 200
	});


	//function that initializes map + calls setMarkers to place markers
	function initialize() {

		var styles =
		[
		  {
		    "featureType": "landscape",
		    "stylers": [
		      { "lightness": -51 },
		      { "saturation": -53 },
		      { "hue": "#005eff" }
		    ]
		  },{
		    "featureType": "administrative",
		    "elementType": "geometry",
		    "stylers": [
		      { "lightness": -35 }
		    ]
		  },{
		    "featureType": "poi",
		    "stylers": [
		      { "hue": "#ffbb00" },
		      { "visibility": "off" }
		    ]
		  },{
		    "featureType": "water",
		    "stylers": [
		      { "saturation": -60 },
		      { "lightness": -1 },
		      { "hue": "#00ff88" }
		    ]
		  },
		  {
		    "featureType": "road.arterial",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  },
		  {
		    "featureType": "road",
		    "elementType": "geometry",
		    "stylers": [
		      { "lightness": -3 },
		      { "saturation": -70 }
		    ]
		  },{
		    "featureType": "road",
		    "elementType": "labels",
		    "stylers": [
		      { "saturation": -52 }
		    ]
		  }
		]

		var styledMap = new google.maps.StyledMapType(styles,
    		{name: "Styled Map"});

		var mapOptions = {	//sets up initial map view
				center: new google.maps.LatLng(40.75, 11.3),
				zoom: 4,
				panControl: false,
				zoomControl: false,
				mapTypeControl: false,
				streetViewControl: false,
				overviewMapControl: false,
				mapTypeControlOptions: {
      				mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    			}
		};

		var map = new google.maps.Map(document.getElementById("map"),
			mapOptions);	//establishes map in 'map' div

		map.mapTypes.set('map_style', styledMap);
  		map.setMapTypeId('map_style');

		setMarkers(map, cities);	//function that creates markers + info windows

	}


	//functions sets up markers + info windows + galleries on the cities held in cities array
	function setMarkers(map, locations){
		var markerImage = {
			url: 'http://icdn.pro/images/en/o/r/orange-flag-icone-6701-32.png',
		}

		for (var i = 0; i < locations.length; i++) {	//goes through all the cities
		    var city = locations[i];	//current city array held in 'city' variable
		    var myLatLng = new google.maps.LatLng(city[1], city[2]);
		    var marker = new google.maps.Marker({	//establishes marker w/ info provided by array
		        position: myLatLng,
		        animation: google.maps.Animation.DROP,
		        icon: markerImage,
		        image: city[4],
		        gallery: city[5],
		        map: map,
		        title: city[0],
		        zIndex: city[3],
		   	});


		    //event listener for when user clicks on the marker just built--fills the info window with content
		    //corresponding to that city
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent("<a id=\"infowindowlink\" href=\"" + this.gallery + "\"> <img src=\""+ this.image + "\" alt=\" \" >" + this.title + "</a>");
				console.log(infowindow.content);	//for testing
				infowindow.open (map, this);


				//event listener for once the info window is loaded--prevents the default action of the
				//anchor in the infowindow and instead loads the gallery html into the overlay
				google.maps.event.addListenerOnce(infowindow, 'domready', function () {
					console.log("outside");
					$("a").click(function(event){
						event.preventDefault();
						var url = "galleries/" + $(this).attr('href');

						
						//***IGNORE***server will respond to get with an array of image links
						//and then will take the array and format it into html with knockout

				
						$.get(url, function (response){
							console.log(infowindow.content);
							$overlay.append(response);
							$overlay.show();


							$overlay.click(function(event){		//closes + clears overlay when it is clicked
								$overlay.empty();
								$overlay.hide();
								
							});

							/*

							$(".thumbnail").click(function(event){
							event.preventDefault();
							var uri = "images/show?id=" + $(this).attr('id');
							var encoded = encodeURI(uri);
							console.log("holder2: " + $holder.html());
							$.get(encoded, function (response){
								$overlay.empty();
								$overlay.append(response);
								$overlay.show();
								console.log($overlay.html());
								$overlay.click(function(event){		//resets overlay to gallery, not fullsize image
									event.preventDefault()
									$overlay.empty();
									$overlay.append($holder);
										$overlay.click(function(){		//closes + clears overlay when it is clicked
											$holder.empty();
											$overlay.empty();
											$overlay.hide();
										});
								});

							}, "html");
						});	*/


						}, "html");
					});
				});

			});

			

		}
	}

	google.maps.event.addDomListener(window, 'load', initialize);

});












