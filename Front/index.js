window.onload = () => {
    console.log("index.js loaded");

    async function fetchData() {

        const resp = await fetch('http://localhost:3000');
        const data = await resp.json();
        console.log(data);
    }
    fetchData();
};