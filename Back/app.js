'use strict';
//EXPRESS
const express = require('express');
const app = express();
const router = express.router();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send("//Load an 'about' page");
});

app.get('/boardgames', (req, res) => {
    //console.log(path.join(__dirname, '/boardgames.json'));
    //fs.readFile(path.join(__dirname, '/boardgames.json'), err => {
    //    console.log('Error: ', err);
    //});
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});