const express = require('express');
const connetDB = require('./config/db');
const app = express();

const port = process.env.port || 5000;

//initialize database
connetDB();

//init  middleware
app.use(express.json({ extended:false }));

app.get('/',(req,res) =>{
    res.send('Home page is working perfectly');
});

//define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


app.listen(port, () => console.log(`server running at port no ${port}`))
