let db, collection;

// Setup

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const port = (process.env.PORT || 3000);

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');

// Mongoose database

const db_name = "final_project";
mongoose.connect(`mongodb+srv://admin:admin@cluster0.en9gr.mongodb.net/${db_name}?retryWrites=true&w=majority`, {
    useNewUrlParser: true
});

// Middleware

const cors = require('cors');
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(cors());

// CRUD opperations

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/pages/root.html`);
});

app.use('/api', authRoute);
app.use('/api/users', userRoute);


app.listen(port, () => {
    db = mongoose.connection;
    db.on('error', () => console.error('Connection to database failed'));
    db.once('open', () => console.log(`\n-- SERVER -- Connected to database ${db_name}!`));
});