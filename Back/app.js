let db, collection;

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
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(cors());

//REQUESTS
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/root.html`);
});

app.use('/api', router);

router.route('/routes')
    //display data on this route
    .get((req, res) => {
        collection = db.collection('routes');
        collection.find({}).toArray((err, result) => {
            if (err)
                return res.status(500).send(err);
            res.json(result);
        });
    })
    //what to do when user adds object
    .post((req, res) => {
        collection = db.collection('routes');
        console.log(req.body);
        if (req.body) {
            collection.insertOne(req.body);
            console.log("LOG Route has been saved!");
        } else {
            console.log("Body was empty");
        }
    })
    //update the object with what the user inputs
    .put((req, res) => {})

    .patch((req, res) => {});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    client.connect(err => {
        if (err) {
            throw err;
        }
        db = client.db(db_name);
        console.log(`\n-- SERVER -- Connected to database ${db_name}!`);
    });
});