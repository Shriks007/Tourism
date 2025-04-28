document.addEventListener('DOMContentLoaded', function() {
    // Check if the map container exists
    const mapContainer = document.getElementById('destination-map');
    if (!mapContainer) return;

    // Get destination coordinates from data attributes
    const lat = parseFloat(mapContainer.dataset.lat || 0);
    const lng = parseFloat(mapContainer.dataset.lng || 0);
    const name = mapContainer.dataset.name || 'Destination';

    // Initialize the map
    function initMap() {
        // Create map
        const map = new google.maps.Map(mapContainer, {
            center: { lat, lng },
            zoom: 10,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "all",
                    "stylers": [{ "saturation": "-100" }]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "all",
                    "stylers": [{ "visibility": "off" }]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        { "saturation": -100 },
                        { "lightness": 65 },
                        { "visibility": "on" }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        { "saturation": -100 },
                        { "lightness": "50" },
                        { "visibility": "simplified" }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{ "saturation": "-100" }]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{ "visibility": "simplified" }]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [{ "lightness": "30" }]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [{ "lightness": "40" }]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        { "saturation": -100 },
                        { "visibility": "simplified" }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        { "hue": "#ffff00" },
                        { "lightness": -25 },
                        { "saturation": -97 }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        { "lightness": -25 },
                        { "saturation": -100 }
                    ]
                }
            ]
        });

        // Add marker
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: name,
            animation: google.maps.Animation.DROP
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `<div class="p-2"><h5>${name}</h5><p>An amazing destination waiting to be explored!</p></div>`
        });

        // Open info window when marker is clicked
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        // Show info window by default
        infoWindow.open(map, marker);
    }

    // Load Google Maps API dynamically
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
        script.defer = true;
        script.async = true;

        // Define callback function in global scope
        window.initMap = initMap;

        // Handle script load error
        script.onerror = function() {
            mapContainer.innerHTML = `
                <div class="alert alert-warning text-center py-5">
                    <i class="fas fa-map-marker-alt fa-3x mb-3"></i>
                    <h4>Map Loading Error</h4>
                    <p>Sorry, we couldn't load the map. Please try again later.</p>
                </div>
            `;
        };

        // Add script to document
        document.head.appendChild(script);
    } else {
        // Google Maps API already loaded, initialize map
        initMap();
    }
});
