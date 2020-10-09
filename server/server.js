require('dotenv').config()
const express = require("express");
const db = require('./db');
//create an instance of express
const app = express();

//mongo variable // middleware, read body

//define env variables/ dbd configurations
const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});

//middleware, can define multiple
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
        const results = await db.query(`select * from expenses where username = '${req.params.id}'`);
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
app.post('/expenses/add', async (req,res) => {
    try {
        //const {username, paid, sold, shipping, date, platform, other} =
        //const results = await db.query(`insert into expenses (username, paid, sold, shipping, date, platform, other) values ()`);
        console.log(results.rows);
        res.status(200).json({
            status: "success",
            data: {
                id: 2
            }
        })
    }
    catch(err) {
        console.log(err);
    }
    
});

//DELETE an expense
app.delete('/expenses/:id', (req,res) => {
    console.log(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            id: req.params.id
        }
    })
});

