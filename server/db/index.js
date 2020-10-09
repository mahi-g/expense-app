const { Pool } = require('pg');

//pg library automatically looks for .env file so can be left empty
// const pool = new Pool({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
//   })
const pool = new Pool({});
module.exports = {
    query: (text, params) => pool.query(text, params),
  }
