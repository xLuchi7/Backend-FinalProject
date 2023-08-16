import { ServerApiVersion } from "mongodb";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import { winstonLogger } from "../utils/winstonLogger.js";

export async function conectar(){
    //await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    //winstonLogger.info("base de datos conectada a ecommerce")

    const uri = "mongodb+srv://luciano:probando22@cluster0.r1ikgz0.mongodb.net/?retryWrites=true&w=majority&ssl=true"

    await mongoose.connect(uri)

    // const connectionParams = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // }

    // await mongoose.connect(uri, connectionParams)

    // .then(() => {
    //     console.log("conectado a la db de atlas")
    // })
    // .catch((e) => {
    //     console.log("error: ", e)
    // })

    //Create a MongoClient with a MongoClientOptions object to set the Stable API version
    // const client = new MongoClient(uri, {
    //     serverApi: {
    //     version: ServerApiVersion.v1,
    //     strict: true,
    //     deprecationErrors: true,
    //     }
    // });
    // async function run() {
    //     try {
    //     // Connect the client to the server	(optional127.0.0.1:27017 starting in v4.7)
    //     await client.connect();
    //     // Send a ping to confirm a successful connection
    //     await client.db("admin").command({ ping: 1 });
    //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //     } finally {
    //     // Ensures that the client will close when you finish/error
    //     await client.close();
    //     }
    // }
    // run().catch(console.dir);
}