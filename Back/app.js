const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/api/getObjects', (req, res) => {
    console.log(path.join(__dirname, '/boardgames.json'));
    fs.readFile(path.join(__dirname, '/boardgames.json'), err => {
        console.log('Error: ', err);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});