const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const {check, validationResult } = require('express-validator');
const e = require('express');


var connectUrl = "mongodb+srv://hlawal:11520220@cluster0.umcmxng.mongodb.net/?retryWrites=true&w=majority";
client = new MongoClient(connectUrl, { useUnifiedTopology: true });
var database = client.db("ackbee");

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


var productsLength = 0;
var cartSize = 0;
var allproducts, subtotal, tax, total, discount, discount_added, total_amounts;
var cart = [];
var favorites = [];

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
        obj = await productQuery(item_name);
        cart_item = {
                product_obj: obj,
                product_quantity: item_quan,
                product_color: item_color
        }
        cart.push(cart_item);
        cartSize++;
});

app.post("/rm_from_bag", async (req, res) => {
        item = req.body.item_name;
        /* find index of the item to be removed */
        for (index_to_rm = 0; index_to_rm < cartSize; index_to_rm++) {
                obj = cart[index_to_rm].product_obj[0];
                if (obj.product_name == item) {
                        break;
                }
        }
        /* remove obj */
        cart.splice(index_to_rm, 1);
        cartSize--;
});


app.get("/cart", async (req, res) => {
        res.render('cart', {data: {cartItems: cart, errors: "none", cartSize: cartSize}});
});

app.post("/order_form", async (req, res) => {
        subtotal = req.body.subtotalAmount;
        tax = req.body.taxAmount;
        total = req.body.totalAmount;
        discount = req.body.discount;

        if (discount == "") {
                discount_added = false;
        } else {
                discount_added = true;
        }

        total_amounts = {
                subtotal: subtotal,
                tax: tax,
                total: total,
                discount: discount,
                discount_added: discount_added
        }
        
        await getFavs();
        res.render('order_form', {data: {cartItems: cart, errors: "none", cartSize: cartSize, favs: favorites, totals: total_amounts, contact: "none"}});
});

async function getFavs() {
        var collection = await database.collection("customers");
        favorites = await collection.find();
        favorites = await favorites.toArray();
}

app.post("/order_complete",
        check('lname').notEmpty().withMessage("Please enter a last name"),
        check('address').notEmpty().withMessage("Please enter an address"),
        check('phone').notEmpty().withMessage("Please enter a phone number"),
        async (req, res) => {
        const errors = validationResult(req);

        contact_info = {
                fname: req.body.fname,
                lname: req.body.lname,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                phone: req.body.phone
        }

        if (errors.isEmpty()) {
                await addToDatabase(contact_info);
                res.render('order_complete', {data: {cartItems: cart, errors: "none", cartSize: cartSize, totals: total_amounts, contact: contact_info}});
        } else {
                /* stay on page and display errors */
                res.render('order_form', {data: {cartItems: cart, errors: errors.array(), cartSize: cartSize, favs: favorites, totals: total_amounts, contact: contact_info}});
        }
});

/* filters */

app.post("/filter", async (req, res) => {
        filter = req.body.filter;
        {$and: [{category: "Cups"},{layers: "Single"}]}
        // how can we just change array without reloading whole page
});


async function addToDatabase(contact) {
        var collection = await database.collection("orders");

        var newDoc = {"contact": contact, "items": cart, "total": total_amounts};
        collection.insertOne(newDoc, function(err) {
                if (err) throw err;
        });
}


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


// filter functionality

// search "
// favorites
// added dups



app.listen(process.env.PORT || 3000);