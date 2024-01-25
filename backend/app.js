const mongoose = require('mongoose');


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// const sequelize = require('./database/db');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const fileRoutes = require('./routes/file');


//creating a write stream in append mode
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userRoutes);
app.use('/expense', expenseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password/', passwordRoutes);
// app.use('/file/', fileRoutes);

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

// (async function(){
//     sequelize.sync()
//     .then(res=>{
//         // associatedModels();
//         app.listen(process.env.PORT || 3000, ()=>{
//             console.log('server started at port 3000');
//         })
//     })
//     .catch(err=>{
//         console.log(err);
//     })
// })()

mongoose.connect('mongodb+srv://rishabh:rishabh@cluster0.dwhtk.mongodb.net/expenseTracker?retryWrites=true&w=majority')
    .then(()=>{
        app.listen(3000, ()=>{
            console.log('server started at port 3000');
        })
    })
    .catch(err=>{
        console.log('database connection err', err);
    })

