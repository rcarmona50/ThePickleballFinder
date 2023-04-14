
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11', // stylesheet location
    center: court.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(court.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${court.title}</h3><p>${court.location}</p>`
            )
    )
    .addTo(map)