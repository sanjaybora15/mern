const express = require('express');
const connetDB = require('./configs/db');
const app = express();

const port = process.env.port || 5000;
connetDB();
app.get('/',(req,res) =>{
    res.send('API is running');
});


//the main file is coming
//port iinitalized
//hello

app.listen(port, () => console.log(`server running at port no ${port}`))
