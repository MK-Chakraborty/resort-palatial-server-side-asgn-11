const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.ehdi4.mongodb.net:27017,cluster0-shard-00-01.ehdi4.mongodb.net:27017,cluster0-shard-00-02.ehdi4.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-a8zpg9-shard-0&authSource=admin&retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehdi4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        console.log('Db connected')

        const database = client.db("resort_palatial");
        const offersCollection = database.collection('offers');
        const bookingCollection = database.collection("bookings");

        app.get('/offers', async(req, res) => {
            const cursor = offersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/offers/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const offer = await offersCollection.findOne(query);
            res.json(offer);
        })

        app.post('/offers', async(req, res) => {
            const offerInfo = req.body;
            const result = await offersCollection.insertOne(offerInfo);
            res.json(result);
        })

        app.get('/bookings', async(req, res) => {
            const cursor = bookingCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/bookings', async(req, res) => {
            const bookingInfo = req.body;
            const result = await bookingCollection.insertOne(bookingInfo);
            res.json(result);
        })

        app.delete('/bookings/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Resort backend Server');
})

app.listen(port, () => {
    console.log('LIstening to PORT: ', port);
})