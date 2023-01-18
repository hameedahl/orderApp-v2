const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

var connectUrl = "mongodb+srv://hlawal:11520220@cluster0.umcmxng.mongodb.net/?retryWrites=true&w=majority";
client = new MongoClient(connectUrl, { useUnifiedTopology: true });
var database = client.db("ackbee");

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

var productsLength = 0;
var cartLength = 0;
var allproducts;

app.get("/", (req, res) => {
        res.render("index");
});

app.get("/bags", async (req, res) => {
        allproducts = await getProducts("Bags");
        productsLength = allproducts.length;
        res.render('bags', {data : {products : allproducts, errors: "none"}});
});

app.get("/cups", async (req, res) => {
        allproducts = await getProducts("Cups");
        productsLength = allproducts.length;
        res.render('cups', {data : {products : allproducts, errors: "none"}});
});

app.get("/product", async (req, res) => {
        res.render('product');
});

app.get("/cart", async (req, res) => {
        res.render('cart');
});

async function getProducts(categoryQuery) {
        try {
                await client.connect();
                /* get collection */
                var collection = await database.collection("products");
                var results = await collection.find({category: categoryQuery}).sort({_id: 1});
                return results.toArray();
        } catch (error) {
                console.log(error);
        }
}

app.listen(process.env.PORT || 3000);