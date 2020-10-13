require('dotenv').config()
const express = require("express");
const cors = require('cors');
const db = require('./db');


//create an instance of express
const app = express();


//define env variables/ dbd configurations
const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});

//middlewares

//enable cors for all routes
app.use(cors());
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
    const results = await db.query("SELECT * FROM expenses");
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
        const results = await db.query(`SELECT * FROM expenses WHERE username = $1`, [req.params.id]);
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
        const {paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date} = req.body;
        console.log(req.body);
        const results = await db.query(`INSERT INTO expenses (username, paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, 
        [req.params.id, paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date]);
        res.status(200).json({
            status: "success",
        })
    }
    catch(err) {
        console.log(err);
    }
});

//WRITE an tracking number
app.post("/tracking/:user_id/:tracking_num", async (req,res) => {
    try{
        const result = await db.query(`INSERT INTO tracking (username, tracking_num) VALUES($1, ARRAY [$2]);`, [req.params.user_id, req.params.tracking_num]);
        res.status(200).json({
            status: "success",
        });
    } catch(err) {
        console.error(err);
    }
    
});

//update existing tracking numbers
app.put("/tracking/:user_id/:tracking_num", async (req,res) => {
    try {
        console.log(req.params.tracking_num, req.params.user_id);
        const tracking_num = `\{${req.params.tracking_num}\}`;
        const result = await db.query(`UPDATE tracking SET tracking_num = array_cat(tracking_num, $1) WHERE username = $2 RETURNING * ;`, [tracking_num, req.params.user_id]);
        console.log(result.rows);
        res.status(200).json({
            status: "success",
        });
    } catch(err) {
        console.error(err);
    }
    
});


//DELETE an expense
app.delete('/expenses/:user_id/:transaction_id', async (req,res) => {
    console.log(req.params.transaction_id);
    const result = await db.query(`DELETE FROM expenses WHERE transaction_id = $1 and username = $2`, [req.params.transaction_id, req.params.user_id]);
    res.status(200).json({
        status: "success",
        data: {
            id: req.params.transaction_id
        }
    })
});

//DELETE a tracking number
app.delete('/tracking/:user_id/:tracking_num', async (req,res) => {
    console.log(req.params.tracking_num);
    const results = await db.query('UPDATE tracking SET tracking_num = array_remove(tracking_num, $1) WHERE username = $2 RETURNING tracking_num;', [req.params.tracking_num, req.params.user_id]);
    console.log(results);
    res.status(200).json({
        status: "success",
        tracking: results.rows
    })
});

app.get('/tracking/:user_id', async (req, res) =>{
    console.log();
    const results = await db.query('SELECT tracking_num FROM tracking WHERE username=$1;', [req.params.user_id]);
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