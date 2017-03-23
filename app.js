
const baseUrl = 'https://api.500px.com/v1/'
const photoUrl = 'photos/search'
const consumerKey = 'SIwRLq0AwiEydJeCT8NLk3chVNyEMgweH52bQVx5';

let centTo = { lat: 43.6532, lng: -79.3832 }; // originally downtown Toronto
let map;

let infoDataPhoto = []; // creating a empty array to hold informations for all photos
let locations = [];		// creating a empty array to hold the list of locations 
let markers = []; 		// creating a empty array to hold markers

function initMap (){
	// appending the map to the div mapPhotos
	map = new google.maps.Map(document.getElementById("mapPhotos"), {
		zoom: 9,
		center: centTo,
	});	
	// display a marker in center of Toronto
	const marker = new google.maps.Marker({
        position: centTo,
        map: map,
		icon: "http://www.googlemapsmarkers.com/v1/009900/"
    });
} // end of initMap function 

// searching by clicking the button
$("button").click(function(e){
	e.preventDefault();
	$('#photos').empty();			// empty the div from previous photos 
	locations = [];					// empty the location array from previous info 
	userInput = $('input').val();	// take the value from the user 
	fetchPhotos(userInput);			// call the fetch data
});  

// fetch data
const fetchPhotos = term => {
return fetch(baseUrl + photoUrl + '?consumer_key=' + consumerKey + '&term=' + term +'&geo=43.6532,-79.3832,50km')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    infoDataPhoto = data;
	displayPhoto();  // call the function to display photo 
  }).catch (alert);
};

function displayPhoto(){
	
	// for loop, for every photos append coordinates (lat and lng) 
	for (i = 0; i <infoDataPhoto.photos.length; i++) { 
		// remove photos with lat and lng = null
		if (infoDataPhoto.photos[i].latitude != null && infoDataPhoto.photos[i].longitude != null){
			let coordinates = {lat: infoDataPhoto.photos[i].latitude, lng: infoDataPhoto.photos[i].longitude};
			locations.push(coordinates);
		}
	};
	console.log(locations); // to show all the locations 
	
	// looping throught fetched photos 
	for (i=0; i<infoDataPhoto.photos.length; i ++){
		let image = $('<img>').attr('src', infoDataPhoto.photos[i].image_url);
		let clkImage = $('<a>').attr('href', '#').append(image);
		let clkImageDiv = $('<div>').addClass('image').attr('id', i).append(clkImage);
		$('#photos').append(clkImageDiv);	// appending all images to our webpage
	}
	
	// change map div size 
	$('#mapPhotos').css('width', '647px');
	// change photo div size
	$('#photos').css('width', '700px')
	// change main size
	$('main').css({'width':'1350px', 'margin':'0 auto'})
	
	// clicking the photo
	$('.image').click(function(e){
		var id = this.id;
		
		if (markers[id].getAnimation() !== null) {
			markers[id].setAnimation(null);
		} else {
			markers[id].setAnimation(google.maps.Animation.BOUNCE);
			
		};
		
	});
	
	deleteMarkers(markers); // call the function to delete all the previous markers
	
} // end of displayPhoto function 

// creating a function to delete all the previous markers
function deleteMarkers(markersArray) {
	for (var i = 0; i < markersArray.length; i++) {
			markersArray[i].setMap(null);
		}
    markersArray = [];
	
	displayMarkers();  // call the function to display the new search markers
};

function displayMarkers(){
	
	// display markers for every locations in the new search
	markers = locations.map( location => {
        return new google.maps.Marker({
            position: location,
            map: map,
			animation: google.maps.Animation.DROP,
        });
    }); 
	
	displayInfoWindows(); // call the function to display the infoWindow 
	
} // end of displayMarkers function 	
	
function displayInfoWindows(){
	
	let infoWindows = []; 	// creating a empty array to hold info windows objects
	
	// for loop, set the content of each info window object and push to window array 
	for (i=0; i<locations.length; i++){
		let infoWindow = new google.maps.InfoWindow();
		let info = "<b>" + infoDataPhoto.photos[i].name + "</b>" + "<br>" +
					"<img src=" + infoDataPhoto.photos[i].image_url + ">" + "<br>" +
					"From: " + "<i>" + infoDataPhoto.photos[i].user.fullname + "</i>";		
		infoWindow.setContent(info);
		infoWindows.push(infoWindow);		
	}
	
	let	prevInfowindow = false; //used to close previous infowindow when a new one is open
	
	// show infoWindows when the marker is clicked 
	markers.forEach( (marker, i) => {
		marker.addListener('click', () => {
			if( prevInfowindow ) {
				prevInfowindow.close();
			}
			prevInfowindow = infoWindows[i];
			infoWindows[i].open(map, marker);
        });
    }); 
	
} // end of displayInfoWindows function













