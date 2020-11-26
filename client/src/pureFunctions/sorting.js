
const sortList = require('../Components/PieChart.js');
module.exports = {
    sortByDate(list){
        console.log("Before"+list);
        console.log(list.sort((a,b)=>new Date(a.date)-new Date(b.date)));
    },
    getAllRevenue(list){
        let a = 0;
        let b = 0;
        let c = 0;
        if(list !== undefined){
            list.forEach((d) => {
                if(d.platform === 'Ebay') {
                    a += parseInt(d.sold);
                }
                else if(d.platform === 'Depop') {
                    b += parseInt(d.sold);
                }
                else{
                    c += parseInt(d.sold);
                }
            });
            console.log(a+" "+b+" "+c);
            const total = a+b+c;
            return [a/total*100,b/total*100,c/total*100];
        }
        return [0,0,0];
    }
}
