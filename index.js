const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT | 5000

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.5yb9o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db('coffeeDB');
    const coffeeCollection = database.collection('coffee');

    app.post('/coffee', async(req,res)=>{
      const data = req.body;
      const result = await coffeeCollection.insertOne(data);
      res.send(result);
    })

    app.delete('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/update/:id',async(req,res)=>{
      const id = req.params.id;
      const newCoffee = req.body;
      const filter = {_id:new ObjectId(id)};
      const options = {upsert:true};
      const updatedCoffee = {
        $set:{
           name:newCoffee.name,
           chef:newCoffee.chef,
           category:newCoffee.category, 
           details:newCoffee.details,
           suplier:newCoffee.suplier,
           taste:newCoffee.taste,
           photo:newCoffee.photo 
        }
      }
      const result = await coffeeCollection.updateOne(filter,updatedCoffee,options);
      res.send(result);
    })
    

    app.get('/coffee', async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/update/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })
    
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('Hello from Server');
})

app.listen(port,()=>{
    console.log(`server is running at ${port}`);
})