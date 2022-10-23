require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))



// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// Create admin user
const Users = require('./models/userModel');
const userData = require('./data/admin_user');
function createAdminUser(userData) {
    try {
        userData.forEach(async(element) => {
            const { email } = element
            const user = await Users.findOne({email});
            if (user) return;
            const newUser = Users(element);
            await newUser.save();
            console.log("Admin Created")
        });
    }
    catch (err) {
        console.log(err)
    }
}
createAdminUser(userData);

// Create default category
const Category = require('./models/categoryModel');
const categoryData = require('./data/category');
function createCategory(categoryData) {
    try {
        categoryData.forEach(async(element) => {
            const { name } = element
            const category = await Category.findOne({name});
            if (category) return;
            const newCategory = Category(element);
            await newCategory.save();
            console.log("Category Created")
        });
    }
    catch (err) {
        console.log(err)
    }
}

// Create default Product
const Product = require('./models/productModel');
const productData = require('./data/product');
function createProduct(productData) {
    try {
        productData.forEach(async(element) => {
            const { product_id, category } = element
            const product = await Product.findOne({product_id});
            if (product) return;
            const prodcut_category = await Category.findOne({name: category});
            element["category"] = prodcut_category._id
            const newProduct = Product(element);
            await newProduct.save();
            console.log("Product Created")
        });
    }
    catch (err) {
        console.log(err)
    }
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>{
    console.log('Server is running on port', PORT)
})

createCategory(categoryData);
setTimeout(function() {createProduct(productData);}, 1000);