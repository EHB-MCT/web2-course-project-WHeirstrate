let db;

//EXPRESS
const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

//DB
const MongoClient = require('mongodb').MongoClient;
const db_name = "Milestone2";
const uri = `mongodb+srv://admin:admin@cluster0.en9gr.mongodb.net/${db_name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true
});
//MIDDLEWARE
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
    client.connect(err => {
        if (err) {
            throw err;
        }
        db = client.db(db_name);
        console.log("connected to database", db_name);
    });
});