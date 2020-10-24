const express = require("express");
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
//create an instance of express
const app = express();

//define env variables/ dbd configurations
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
let refreshTokens = [];

const port = process.env.PORT || 3005;

app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});


//middlewares
//enable cors for all routes
app.use(cors());
app.use(express.json());


//Middleware that gets the authorization value from the header
//If authHeader is defined, then the token is retrieved using split
//[0] is Bearer and [1] is the access token
//Access token is verified
//If error, sends a 403, else verifiedJWT info is attached to req header
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, verifiedJWT) => {
            if (err) {
                console.log("Error in verification");
                return res.sendStatus(403);
            }
            //contains username, iat, exp
            console.log("No error");
            req.user = verifiedJWT;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


//Generate access tokens and clerefresh tokens during login
app.post('/api/login', async (req, res) => {
    //get auth header from request, [0] is a string "Basic" and [1] contains the username and password encoded in base64
    //decode the auth header which returns "username:password" in plaintext
    //retrive username/password using split and array destructuring
    const auth = req.headers.authorization.split(' ')[1];
    const decode = Buffer.from(auth, 'base64').toString();
    const [username, password] = decode.split(":");

    const user = await db.query("SELECT * FROM users WHERE username = $1 AND password=$2", [username, password]);
    //console.log(user.rows);
    
    if(user.rows.length !== 0 || user.row !== undefined){
        const accessToken = jwt.sign({username}, accessTokenSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({username}, refreshTokenSecret, { expiresIn: '3m' });
        refreshTokens.push(refreshToken);
        res.status(200).json({ accessToken, refreshToken }
        );
    } else {
        res.send("Username or password incorrect");
    }
});


//Generate new access tokens using refresh tokens 
app.post('/api/token', (req, res) => {
    const {token} = req.body;
    if(!token){
        return res.sendStatus(401);
    }
    if(!refreshTokens.includes(token)){
        return res.sendStatus(403);
    }
    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if(err){ return res.sendStatus(401);}
        const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '1h' });
        res.json({accessToken});        
    })
});

app.post('/api/logout', (req, res) => {
    const {token} = req.body;
    refreshTokens = refreshTokens.filter(t => t != token);
    res.send("Logout successful");
});

//READ all expenses
app.get('/api/expenses', authenticateJWT, async (req, res) => {
    console.log("Post expense");

    const results = await db.query("SELECT * FROM expenses WHERE username = $1", [req.user.username]);
    console.log(results.rows);
    res.status(200).json({
        status: "success",
        expenses: results.rows
    });
});

// //READ expense by user id
// app.get('/expenses/:id', authenticateJWT, async (req,res) => {
//     try {
//         const results = await db.query(`SELECT * FROM expenses WHERE username = $1`, [req.params.id]);
//         console.log(results.rows);
//         res.status(200).json({
//             status: "success",
//             data: {
//                 id: results.rows
//             }
//         })
//     }
//     catch(err) {
//         console.log(err);
//     }
// });

//WRITE an expense
app.post('/api/expenses', authenticateJWT, async (req,res) => {
    try {
        console.log("Post expense");
        const {paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date} = req.body;
        const results = await db.query(`INSERT INTO expenses (username, paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, 
            [req.user.username, paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date]
        );
        console.log(results.row);
        res.status(200).json({
            status: "success",
            data: results.row
        })
    }
    catch(err) {
        console.log(err);
    }
});

//WRITE a tracking number
app.post("/api/tracking/:tracking_num", authenticateJWT, async (req,res) => {
    try {
        const result = await db.query(`INSERT INTO tracking (username, tracking_num) VALUES($1, ARRAY [$2]) RETURNING tracking_num;`, [req.user.username, req.params.tracking_num]);
        res.status(200).json({
            status: "success",
            data: result.rows
        });
    } catch(err) {
        console.error(err);
    }
});

//UPDATE existing tracking numbers
app.put("/api/tracking/:tracking_num", authenticateJWT, async (req,res) => {
    try {
        console.log(req.params.tracking_num);
        const tracking_num = `\{${req.params.tracking_num}\}`;
        const result = await db.query(`UPDATE tracking SET tracking_num = array_cat(tracking_num, $1) WHERE username = $2 RETURNING tracking_num ;`, [tracking_num, req.user.username]);
        res.status(200).json({
            status: "success",
            data: result.rows
        });
    } catch(err) {
        console.error(err);
    }
});

//DELETE an expense
app.delete('/api/expenses/:transaction_id', authenticateJWT, async (req,res) => {
    //console.log(req.params.transaction_id);
    await db.query(`DELETE FROM expenses WHERE transaction_id = $1 and username = $2`, [req.params.transaction_id, req.user.username]);
    //console.log(result);
    res.status(200).json({
        status: "success",
        data: {
            id: req.params.transaction_id
        }
    })
});

//DELETE a tracking number
app.delete('/api/tracking/:tracking_num', authenticateJWT, async (req,res) => {
    console.log(req.params.tracking_num);
    const results = await db.query('UPDATE tracking SET tracking_num = array_remove(tracking_num, $1) WHERE username = $2 RETURNING tracking_num;', [req.params.tracking_num, req.user.username]);
    res.status(200).json({
        status: "success",
        tracking: results.rows
    })
});

//READ tracking number for a specific user
app.get('/api/tracking', authenticateJWT, async (req, res) =>{
    const results = await db.query('SELECT tracking_num FROM tracking WHERE username=$1;', [req.user.username]);
    res.status(200).json({
        status: "success",
        tracking: results.rows
        
        
    });
});

// app.update("/users/:id", async(req, res) =>{
//     try{
//         const result = db.query(``);
//     } catch(err){

//     }
// });