
const sortList = require('../Components/Chart.js');
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

            for(let i = 0; i < list.length; i++){
                if(list[i].platform === 'Ebay'){
                    a += parseInt(list[i].sold);
                }
                else if(list[i].platform === 'Depop'){
                    b+= parseInt(list[i].sold);
                }
                else{
                    c+= parseInt(list[i].sold);
                }
            };
            console.log(a+" "+b+" "+c);

            const total = a+b+c;
            return [a/total*100,b/total*100,c/total*100];

        }
      
        return [0,0,0];
        
    }

}
//    [{a, platform},{b, platform},{c, platform}]