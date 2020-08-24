
const sortList = require('../Components/Dashboard.js');
module.exports = {
    sortByDate(list){
        console.log("Before"+list);
        console.log(list.sort((a,b)=>new Date(a.date)-new Date(b.date)));
    }
}
