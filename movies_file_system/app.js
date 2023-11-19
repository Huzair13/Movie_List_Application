const express=require('express');
const movieController = require('./movieController');

const app=express();
const port=3000;

app.use(express.json());
app.use('/',movieController);

app.listen(port,()=>{
    console.log("server started at the port number 3000 !!!")
})