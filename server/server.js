const express = require("express");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
//create an instance of express
const app = express();

//define env variables/ dbd configurations
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const port = process.env.PORT || 3005;

app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});


//middlewares
//enable cors for all routes
app.use(express.json());
app.use(cookieParser());

//set credentials to true to allow cookie headers
const options = {
    credentials: true, 
    origin: 'http://localhost:3000',
    allowedHeaders: 'Content-Type,Authorization'
}
app.use(cors(options));


//Middleware that gets the authorization value from the header
//If authHeader is defined, then the token is retrieved using split
//[0] is Bearer and [1] is the access token
//Access token is verified
//If error, sends a 403, else verifiedJWT info is attached to req header
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Auth: ", authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, verifiedJWT) => {
            if (err) {
                console.log("Error in verification", err);
                return res.sendStatus(403);
            }
            console.log("No error");
            //contains username, iat, exp
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
    //retrieve username/password using split and array destructuring
    const auth = req.headers.authorization.split(' ')[1];
    const decodedFromBase64 = Buffer.from(auth, 'base64').toString();
    const [username, password] = decodedFromBase64.split(":");
    
    //retrieve hashed password from db, use bcrypt.compare to compare user entered password and stored password
    const user = await db.query("SELECT password FROM users WHERE username = $1", [username]);
    bcrypt.compare(password, user.rows[0].password, (err, result) => {
        //if passwords match, generate access token, and refresh token for user
        //refresh token is stored in a secured cookie header, access token is sent in json
        if(result) {
            const accessToken = jwt.sign({username}, accessTokenSecret, { expiresIn: '1m' });
            const refreshToken = jwt.sign({username}, refreshTokenSecret, { expiresIn: '48h' });
            res.cookie('refreshToken', refreshToken, {
                expires: new Date(Date.now() + 1000*60*60*48), //1000ms*60s*60min*48h
                secure: false, // set to true if your using https
            });
            res.status(200).json({ accessToken });
        }
        else {
            res.status(401);
            res.send("Username or password incorrect");
        }
    });
});


const checkUsernameAvailable = async (req, res, next) => {
    const username = await db.query('SELECT username FROM users WHERE username = $1', [req.body.username]);
    //send 403 error if user already exists
    if(username.rows[0] !== undefined) { return res.sendStatus(403); }
    next(); 
}

//Register a user to the database
app.post('/api/signup', checkUsernameAvailable, async (req, res) => {
    let hash = bcrypt.hashSync(req.body.password, 10);
    const user = await db.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [req.body.username, hash]);
    console.log(user);
    res.sendStatus(200);
});

//Generate new access tokens using refresh tokens 
app.post('/api/refresh-token', (req, res) => {
    
    const { refreshToken } = req.cookies;

    if(!refreshToken){
        return res.sendStatus(401);
    }
    
    jwt.verify(refreshToken, refreshTokenSecret, (err, result) => {
        
        //check if err exists or result is undefined
        if(err || !result){ 
            return res.sendStatus(401);
        }
        const { username } = result;
        const accessToken = jwt.sign({ username }, accessTokenSecret, { expiresIn: '1m' });
        res.json({ accessToken });     
    });
       
});

app.post('/api/logout', (req, res) => {
    const { refreshToken } = req.cookies;
    res.clearCookie('refreshToken');
    res.sendStatus(200);
});

//READ all expenses
app.get('/api/expenses', authenticateJWT, async (req, res) => {
    //console.log("get /api/expenses req.user.username", req.user.username)
    const results = await db.query("SELECT * FROM expenses WHERE username = $1", [req.user.username]);
    //console.log("get /api/expenses db result", results.rows);
    res.status(200).json({
        status: "success",
        expenses: results.rows
    });
});

//WRITE an expense
app.post('/api/expenses', authenticateJWT, async (req,res) => {
    try {
        //console.log("Post expense");
        const {paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date} = req.body;
        const results = await db.query(`INSERT INTO expenses (username, paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, 
            [req.user.username, paid, sold, shipping, other, paypal_fee, seller_fee, item_profit, platform, date]
        );
        //console.log("post /api/expenses req.user.username", req.user.username)
        //console.log("post /api/expenses db result", results.row);
        res.status(200).json({
            status: "success",
            data: results.row
        })
    }
    catch(err) {
        console.log(err);
    }
});

//DELETE an expense
app.delete('/api/expenses/:transaction_id', authenticateJWT, async (req,res) => {
    await db.query(`DELETE FROM expenses WHERE transaction_id = $1 and username = $2`, [req.params.transaction_id, req.user.username]);
    res.status(200).json({
        status: "success",
        data: {
            id: req.params.transaction_id
        }
    })
});

//WRITE a tracking number
app.post("/api/tracking/:tracking_num", authenticateJWT, async (req,res) => {
    try {
        const count = await db.query(`SELECT tracking_num FROM tracking WHERE username = $1`, [req.user.username]);
        
        let result;

        //if no row exist, then insert data into table for the first time else update the existing row
        if(count.rowCount === 0) {
            result = await db.query(`INSERT INTO tracking (username, tracking_num) VALUES($1, ARRAY [$2]) RETURNING tracking_num;`, [req.user.username, req.params.tracking_num]);
        } else {
            const tracking_num = `\{${req.params.tracking_num}\}`; 
            result = await db.query(`UPDATE tracking SET tracking_num = array_cat(tracking_num, $1) WHERE username = $2 RETURNING tracking_num;`, [tracking_num, req.user.username]);
        }
        res.status(200).json({
            status: "success",
            data: result.rows
        });
    } catch(err) {
        console.error(err);
    }
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

