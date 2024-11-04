/*
	Author: BestPixels
	Template: Nipe | Multipurpose HTML Landing Page
	Version: 1.0
*/
	
"use strict";

/*global jQuery, $*/
jQuery(document).ready(function(){
	
	// One Page navigation
	$('#navigation').onePageNav({
		'scrollOffset': 100,
	});
	
	// navigation collapse
	jQuery('.navbar-collapse').on("click", 'li', function() {
        jQuery('.navbar-collapse').collapse('hide');
    });
	
	//magnificPopup	Video
	jQuery('.play-button , .video-trigger-ui').magnificPopup({
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		callbacks: {
		beforeOpen: function() {
			  // just a hack that adds mfp-anim class to markup 
			  this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
			  this.st.mainClass = this.st.el.attr('data-effect');
			}
		},
	});
	
});

jQuery(window).on('load', function () {
	//Masonry
    jQuery('.testimonials-list').masonry({
	  // options
	  itemSelector: '.testimonial-item',
	});
});

// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: 12,

		// The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(38.0279975, -84.751751), // New York

		// How you would like to style the map. 
		// This is where you would paste any style found on Snazzy Maps.
		styles: []
	};

	// Get the HTML DOM element that will contain your map 
	// We are using a div with id="map" seen below in the <body>
	var mapElement = document.getElementById('map');

	// Create the Google Map using our element and options defined above
	var map = new google.maps.Map(mapElement, mapOptions);

	// Let's also add a marker while we're at it
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(38.0279975, -84.751751),
		map: map,
		title: 'Trav!'
	});
}