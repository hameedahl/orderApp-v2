const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');


var connectUrl = "mongodb+srv://hlawal:11520220@cluster0.umcmxng.mongodb.net/?retryWrites=true&w=majority";
client = new MongoClient(connectUrl, { useUnifiedTopology: true });
var database = client.db("ackbee");

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


var productsLength = 0;
var cartSize = 0;
var allproducts;
var cart = [];

app.get("/", (req, res) => {
        res.render("index", {data : {cartSize: cartSize}});
});

app.get("/bags", async (req, res) => {
        allproducts = await getProducts("Bags");
        productsLength = allproducts.length;
        res.render('bags', {data : {products : allproducts, errors: "none", cartSize: cartSize}});
});

app.get("/cups", async (req, res) => {
        allproducts = await getProducts("Cups");
        productsLength = allproducts.length;
        res.render('cups', {data : {products : allproducts, errors: "none", cartSize: cartSize}});
});

app.get("/product", async (req, res) => {
        res.render('product');
});

app.post("/product", async (req, res) => {
        product_to_display = req.body.productId;
        product_to_display = await productQuery(product_to_display);
        res.render('product', {data: {product: product_to_display, errors: "none", cartSize: cartSize}});
});

app.post("/add_to_bag", async (req, res) => {
        item_name = req.body.name;
        item_quan = req.body.quantity;
        item_color = req.body.color;
        cart_item = {
                product_obj: await productQuery(item_name),
                product_quantity: item_quan,
                product_color: item_color
        }
        cart.push(cart_item);
        cartSize++;
});

app.get("/cart", async (req, res) => {
        //console.log(cart);
        res.render('cart', {data: {cartItems: cart, cartSize: cartSize}});
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

async function productQuery(productName) {
        try {
                await client.connect();
                /* get collection */
                var collection = await database.collection("products");
                var results = await collection.find({product_name: productName});
                return results.toArray();
        } catch (error) {
                console.log(error);
        }
}

//// close connnection for db

app.listen(process.env.PORT || 3000);