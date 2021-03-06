const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nbt3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');


        // Get all Api 
        app.get('/services', async (req,res) =>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        }) 

        // Get a single Api
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            // console.log('Getting specific id');
            const query = {_id:ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // Post API 
        app.post('/services', async(req,res)=>{
            const service = req.body;
            console.log('hit the post api',service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })


        // Delete Api 

        app.delete('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send("This is Genius car mechanics");
});
app.get('/hello', (req,res) =>{
    res.send("Hello api");
});


app.listen(port,()=>{
    console.log('Running Genius Server on port', port);
})