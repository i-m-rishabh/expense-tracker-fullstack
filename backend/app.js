
const express = require('express');
const cors = require('cors');

const sequelize = require('./database/db');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
// const {associatedModels} = require('./models/associations');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/user',userRoutes);
app.use('/expense', expenseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password/', passwordRoutes);

(async function(){
    sequelize.sync()
    .then(res=>{
        // associatedModels();
        app.listen(3000, ()=>{
            console.log('server started at port 3000');
        })
    })
    .catch(err=>{
        console.log(err);
    })
})()

