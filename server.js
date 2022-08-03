const express = require("express");
const app = express();
const PORT = 2121 //assigning a port for our server to communicate through
require('dotenv').config() //use node module dotenv which allows you to load in environment variable that yo uset up in a .env file: https://www.npmjs.com/package/dotenv
app.set('view engine', 'ejs')

const dbConnectionStr = process.env.DB_STRING // Parse .env config file  --> returns object based on parsed keys/values 
const dbName = 'affirmations'

const MongoClient = require('mongodb').MongoClient


MongoClient.connect(dbConnectionStr, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    const db = client.db(dbName)
    const transCollection = db.collection('trans')

    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    })); // middleware that extracts data from the <form> element and add them to the body property in the request object.
    app.use(express.static('public')) //tells Express to make this folder accessible to the public by using express.static middleware

    app.get('/', (req, res) => {
        db.collection('trans').find().toArray()
            .then(results => {
                console.log(results)
                res.render('index.ejs', {
                    quotes: results
                })
            })
            .catch(error => console.error(error))


        // res.sendFile(__dirname + '/index.html') // __dirname is the current directory you're in
    })

    app.post('/quotes', (req, res) => {
        transCollection.insertOne(req.body)
            .then(result => {
                console.log(result)
                res.redirect('/') //send user back home
            })
            .catch(error => console.error(error))
    })

    app.put('/quotes', (req, res) => {
        console.log(req.body)
    })

    /*
        Have server listen on port set in the PORT variable
    */
    app.listen(process.env.PORT || PORT, () => {
        console.log(`Server running on port ${PORT}: http://localhost:${PORT}`)
    })
})