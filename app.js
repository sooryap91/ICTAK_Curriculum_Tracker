const express = require('express')
const app = new express();
const cors = require('cors')
const logger = require('morgan')
const PORT = process.env.PORT || 3500;
const path = require('path');

app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use(cors())
app.use(logger('dev'))

require('./middleware/mongodb') //to init mongoDB

app.use('/uploads', express.static(path.join(__dirname +'/uploads')));
app.use(express.static(path.join(__dirname + '/dist/frontend')));

const api = require('./routes/api')
app.use('/api',api)




app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
});


app.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})
