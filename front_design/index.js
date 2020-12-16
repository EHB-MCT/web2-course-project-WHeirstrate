window.onload = function () {
    console.log('Index.js connected');

    document.getElementById('form').addEventListener('submit', (e) => {
        e.preventDefault();
        checkMainForm();
    });

    for (let pref of document.getElementsByClassName('prefs')) {
        pref.addEventListener('change', checkPrefs);
    }
};

mapboxgl.accessToken = 'pk.eyJ1Ijoid2hlaXJzdHJhdGUiLCJhIjoiY2tpbmptOWcwMDlqcTJ6bWxtZHd6ZmJpYyJ9.gn-VtDTLzJvbkMUoAJN6fA';
const contentElement = document.getElementById('content');
const depInput = document.getElementById('departureInput');
const arrInput = document.getElementById('arrivalInput');
let prefList = [];
document.getElementById('profile_element').addEventListener('click', () => {

    let previousHtmlString = contentElement.innerHTML;

    let htmlString = `
        <div class="profile_container">
            <p class="inleidingsTekst">Log je in om je favoriete steden en routes bij te houden, zodat je ze snel
                terugvindt!</p>
            <form class="profileLoginForm" id="profileLoginForm">
                <input type="text" name="username" id="usernameInput" placeholder="E-mailadres">
                <input type="password" name="password" id="passwordInput" placeholder="Wachtwoord"> <br>
                <button type="submit">Log je in!</button>
            </form>
        </div>`;

    contentElement.innerHTML = htmlString;


    document.getElementById('profileLoginForm').addEventListener('submit', loginForm);

    document.getElementById('profile_element').addEventListener('click', () => {
        //document.getElementById('logout_element').remove();
        contentElement.innerHTML = previousHtmlString;
        addEventListenersToGeneratedStops();
    });
});

function loginForm(e) {
    e.preventDefault();
    let htmlString = `
        <div class="profile_container">
            <p class="usernameDisplay">Wouter Heirstrate</p>
            <p class="emailDisplay">wouter.heirstrate@gmail.com</p>
            <div class="scroll_container">
                <p class="content_title"><span>Mijn routes</span></p>
                <div class="inner_box">
                    <div class="route_names">
                        <p class="city_route_departure">Antwerpen</p>
                        <img src="./images/arrow_SVG.svg" alt="arrow icon" class="arrow_icon">
                        <p class="city_route_departure">Boom</p>
                    </div>
                </div>
            </div>
            <div class="scroll_container">
                <p class="content_title"><span>Mijn steden</span></p>
                <div class="inner_box">
                    <div class="city_names">
                        <p class="city_names_content">Amsterdam</p>
                    </div>
                </div>
            </div>
        </div>`;

    contentElement.innerHTML = htmlString;

    document.getElementById('profile_element').insertAdjacentHTML('afterend', `<div id="logout_element" class="profile_container_link logout"><img src="./images/logout_SVG.svg"
    alt="Logout icoon">`);
}

function checkPrefs(e) {
    if (e.target.checked)
        prefList.push(e.target.value);
    else
        prefList.splice(prefList.indexOf(e.target.value), 1);
}



function checkMainForm() {
    if (depInput.value !== "")
        if (arrInput.value !== "") {
            console.log('Departure:', depInput.value);
            console.log('Arrival:', arrInput.value);

            loadingAnimation();

            getTrainData(capitalize(depInput.value), capitalize(arrInput.value));
        } else
            arrInput.focus();
    else
        depInput.focus();
}


async function getTrainData(dep, arr) {
    const req = await fetch(`https://api.irail.be/connections/?from=${dep}&to=${arr}&format=json&lang=en`);
    const data = await req.json();

    let longestRoute = [0, null];
    for (let train of data.connection) {
        if (!train.hasOwnProperty("empty"))
            if (train.vias.number > longestRoute[0])
                longestRoute = [train.vias.number, train];
    }

    let stops = [{
        name: dep,
        time: 0,
        coords: []
    }];

    if (!longestRoute[1] !== 0) {
        for (let stop of longestRoute[1].vias.via) {
            stops.push({
                name: stop.station,
                time: stop.timeBetween
            });
        }
    }

    stops.push({
        name: arr,
        time: longestRoute[1].duration
    });

    generateStopsHtml(stops);
}

function generateStopsHtml(stops) {
    let htmlString = `<div class="stops_container">`;
    for (let stop of stops) {
        const min = Math.floor(stop.time / 60) % 60;
        const hour = Math.floor(stop.time / 60 / 60) % 24;

        for (let char of stop.name) {
            if (char == '/')
                stop.name = stop.name.split('/')[1];
        }

        htmlString += `
            <div class="stop_container">
                <img src="./images/Stad.jpg" alt="Stad Antwerpen">
                <p class="time">Reistijd: ${hour + 'u' + min}</p>
                <h3 class="stop_name">${stop.name}<h3>
            </div>`;
    }
    htmlString += `</div>`;

    contentElement.innerHTML = htmlString;
    addEventListenersToGeneratedStops();
}

function addEventListenersToGeneratedStops() {
    const containers = document.getElementsByClassName('stop_container');
    for (let container of containers)
        container.addEventListener('click', getStopMap);
}

function getStopMap(e) {
    let city = "";
    if (e.target.className !== "stop_container")
        city = e.path[1].childNodes[5].innerText;
    else
        city = e.path[0].childNodes[5].innerText;
    console.log(city);
    loadMap(city);
}



// MAP //

async function loadMap(city) {
    htmlString = `
    <div class="map" id="map"></div>
    <h2 class="mapCity">${capitalize(city)}</h2>
    <button class="mapBack" id="mapBack">Back! Back! Back!</button>`;
    const previousHtml = contentElement.innerHTML;
    contentElement.innerHTML = htmlString;

    addEventListenersToMap(previousHtml);

    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?types=place&access_token=${mapboxgl.accessToken}`);
    const data = await res.json();
    const coords = data.features[0].geometry.coordinates;
    const parsedCityName = data.features[0].place_name.split(",", 1)[0];
    console.log(parsedCityName);

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
        center: [coords[0], coords[1]], // starting position [lng, lat]
        zoom: 12 // starting zoom
    });

    const filteredList = await prepareMarkerList(parsedCityName);
    console.log(filteredList);

    for (let filteredEl of filteredList) {
        const htmlEl = document.createElement('div');
        if (filteredEl.properties.disc == "FOOD_DRINKS")
            htmlEl.className = 'marker_bar';
        else if (filteredEl.properties.disc == "HOTEL")
            htmlEl.className = 'marker_hotel';
        else if (filteredEl.properties.disc == "MUSEUM")
            htmlEl.className = 'marker_museum';
        else if (filteredEl.properties.disc == "TOURIST_INFORMATION_CENTRE")
            htmlEl.className = 'marker_tourist';
        const popupHtml = `<h3>${filteredEl.properties.name}</h3><br><p>${filteredEl.properties.website}</p>`;
        new mapboxgl.Popup().setHtml()
        console.log(htmlEl);
        new mapboxgl.Marker(htmlEl)
            .setLngLat(filteredEl.geo.coords)
            .setPopup()
            .addTo(map);
    }
}

function addEventListenersToMap(previousHtml) {
    document.getElementById('mapBack').addEventListener('click', (e) => {
        e.preventDefault();
        contentElement.innerHTML = previousHtml;
        addEventListenersToGeneratedStops();
    });
}


//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
async function prepareMarkerList(city) {
    let filteredList = [];
    if (prefList !== [])
        for (let pref of prefList) {
            const req = await fetch(`https://opendata.visitflanders.org/${pref}_v2.json?city=${city}`)
            const data = await req.json();
            for (let prefElement of data) {
                if (prefElement.lat !== "" && prefElement.long !== "") {
                    filteredList.push({
                        type: 'Feature',
                        geo: {
                            type: 'Point',
                            coords: [prefElement.long, prefElement.lat]
                        },
                        properties: {
                            name: prefElement.name,
                            disc: prefElement.discriminator,
                            website: prefElement.website,
                            icon: {
                                iconSize: [50, 50],
                                iconAnchor: [25, 50],
                            }
                        }
                    });
                };
            }
        }
    return filteredList;
}
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//


function loadingAnimation() {
    const htmlString = '<div class="animation_container"></div>';
    contentElement.innerHTML = htmlString;
}


function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}