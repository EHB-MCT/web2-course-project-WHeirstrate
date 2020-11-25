window.onload = () => {
    console.log("index.js loaded");
    const innerBodyHTML = document.getElementById('innerBody');
    fetchAndLoadData();

    Array.from(document.getElementsByTagName('a')).forEach(link => {
        link.addEventListener('click', changePath);
    });

    function changePath(e) {
        e.preventDefault();
        if (e.target.innerText == "Home") fetchAndLoadData();
        if (e.target.innerText == "Form") loadForm();
        if (e.target.innerText == "Api Root") window.location.replace('http://localhost:3000/');
    }

    async function fetchAndLoadData() {
        let htmlDbString = "";
        const resp = await fetch('http://localhost:3000/api/routes');
        const data = await resp.json();

        for (let route of data) {
            let htmlStopsString = "";
            for (let stop of route.stops) {
                htmlStopsString += `<li>${stop}</li>`;
            }
            htmlDbString = `
                <div class="route">
                    <h2>Van ${route.departure} naar ${route.destination}</h2>
                    <p>Vertrek om ${route.departure_time}.</p>
                    <p>De totale afstand is ${route.distance_km}km.</p>
                    <p>Via</p>
                    <ul class="stops">
                        ${htmlStopsString}
                    </ul>
                </div>` + htmlDbString;
        }
        innerBodyHTML.innerHTML = htmlDbString;
    }

    function loadForm() {
        const htmlFormString = `
            <h2>Voeg je eigen rit toe!</h2>
            <form id="form">
                <label for="departureInput">Vertrek</label>
                <input type="text" id="departureInput">
                <br>
                <br>
                <label for="arrivalInput">Aankomst</label>
                <input type="text" id="arrivalInput">
                <br>
                <br>
                <button type="submit">Voeg route toe!</button>
            </form>`;
        innerBodyHTML.innerHTML = htmlFormString;
        eventListenerForm();
    }

    function eventListenerForm() {
        document.getElementById('form').addEventListener('submit', checkForm);
    }

    function checkForm(e) {
        e.preventDefault();
        const departureInput = document.getElementById('departureInput');
        const arrivalInput = document.getElementById('arrivalInput');

        if (departureInput.value != "") {
            if (arrivalInput.value != "") submitForm();
            else arrivalInput.focus();
        } else departureInput.focus();
    }

    async function submitForm() {
        const departureInputValue = document.getElementById('departureInput').value;
        const arrivalInputValue = document.getElementById('arrivalInput').value;

        const userInput = {
            departure: `${departureInputValue}`,
            departure_time: `${Math.floor(Math.random() * 24)}u${Math.floor(Math.random() * 59)}`,
            destination: `${arrivalInputValue}`,
            stops: [
                "To be determined by external API",
                "This function is not implemented yet",
                "This is dummy-tekst to show how the list would work"
            ],
            distance_km: Math.floor(Math.random() * 55)
        };
        console.log(userInput);

        await fetch('http://localhost:3000/api/routes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInput),
        });
        setTimeout(fetchAndLoadData, 500);
    }

};