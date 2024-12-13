require('dotenv').config()

const bodyParser = require("body-parser");
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path');

const preferencesRoutes = require('./routes/preferencesRouter');
const itemRouter = require('./routes/itemRouter');
const cartRouter = require('./routes/cartRouter');
const aiRouter = require('./routes/aiRouter');



const app = express();

// Enable CORS
app.use(cors());



//middleware
app.use(express.json())

//routes
app.use('/api/preferences',preferencesRoutes);
app.use('/api/items',itemRouter);
app.use('/api/cart',cartRouter);
app.use('/api/ai',aiRouter);






//db connect
mongoose.connect(process.env.MONG_URI).then(()=>{
    //listen on port
    app.listen(process.env.PORT,()=>{
        console.log('connected to db and listening on port',process.env.PORT);
    });
}).catch((error)=>{
    console.log(error)
});
