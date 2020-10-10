require('dotenv').config()
const express = require("express");
const db = require('./db');
//create an instance of express
const app = express();

//define env variables/ dbd configurations
const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});

//middlewares
app.use(express.json());

app.use((req,res,next)=>{
    // res.status(404).json({
    //     status: "fail",
    // });
    console.log("Middleware is running");
    //drop a req/packet by not calling next
    next();
});


//READ all expenses
app.get('/expenses', async (req, res) => {
    const results = await db.query("select * from expenses");
    res.status(200).json({
        status: "success",
        data: {
            expenses: results.rows
        }
    });
});

//READ expense by user id
app.get('/expenses/:id', async (req,res) => {
    try {
        const results = await db.query(`select * from expenses where username = $1`, [req.params.id]);
        console.log(results.rows);
        res.status(200).json({
            status: "success",
            data: {
                id: results.rows
            }
        })
    }
    catch(err) {
        console.log(err);
    }
    
});

//WRITE an expense
app.post('/expenses/:id', async (req,res) => {
    try {
        const {paid, sold, shipping, date, platform, other} = req.body;
        const results = await db.query(`insert into expenses (username, paid, sold, shipping, date, platform, other) values ($1, $2, $3, $4, $5, $6, $7)`, 
        [req.params.id, paid, sold, shipping, date, platform, other]);
        //console.log(paid);
        //console.log(req.params.id);
        res.status(200).json({
            status: "success",
        })
    }
    catch(err) {
        console.log(err);
    }
});

//WRITE an tracking number
app.post("/tracking/:id", async (req,res) => {
    try{
        const result = await db.query(`INSERT INTO tracking (username, tracking_num) VALUES ($1, $2)`, [req.params.id, req.body.tracking_num]);
        res.status(200).json({
            status: "success",
        });
    } catch(err) {
        console.error(err);
    }
    
});


//DELETE an expense
app.delete('/expenses/:transaction_id', async (req,res) => {
    console.log(req.params.transaction_id);
    const result = await db.query(`delete from expenses where transaction_id = $1`, [req.params.transaction_id]);
    res.status(200).json({
        status: "success",
        data: {
            id: req.params.transaction_id
        }
    })
});

//DELETE a tracking number
app.delete('/tracking/:tracking_id', async (req,res) => {
    console.log(req.params.tracking_id);
    await db.query(`delete from tracking where tracking_id = $1`, [req.params.tracking_id]);
    res.status(200).json({
        status: "success",
    })
});

app.get('/tracking/', async (req, res) =>{
    console.log();
    const results = await db.query('SELECT * FROM tracking');
    res.status(200).json({
        status: "success",
        data: {
            tracking: results.rows
        }
        
    });
});

// app.update("/users/:id", async(req, res) =>{
//     try{
//         const result = db.query(``);
//     } catch(err){

//     }
// });