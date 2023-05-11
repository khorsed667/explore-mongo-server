const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// khorsedalam667
// krRld5cW0EuQ5q2D


const uri = "mongodb+srv://khorsedalam667:krRld5cW0EuQ5q2D@cluster0.hlokssy.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("usersDB");
    const usersCollection = database.collection("users");

    app.get('/users', async(req, res)=>{
        const cursor = usersCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)};
      const user = await usersCollection.findOne(query)
      res.send(user)
    })


    app.put('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const user = req.body;
      console.log(user);

      const filter = {_id: new ObjectId(id)}
      const option = {upsert: true}
      const updateUser = {
        $set:{
          name: user.name,
          email: user.email
        }
      }

      const result = await usersCollection.updateOne(filter, updateUser, option)
       res.send(result)

    })


    app.post('/users', async(req, res) =>{
        const user = req.body; 
        console.log('new user', user)
        const result = await usersCollection.insertOne(user);
        res.send(result)
    })


    app.delete('/users/:id', async(req, res) =>{
        const id = req.params.id
        console.log('are being deleted from database', id);
        const query  = {_id: new ObjectId(id)}
        const result = await usersCollection.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
  } finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Mongo server is running on.....')
})

app.listen(port, ()=>{
    console.log(`the port is running on: ${port}`);
})