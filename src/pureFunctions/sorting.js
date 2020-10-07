
module.exports = {
    getAllRevenue(list){
        let a = 0;
        let b = 0;
        let c = 0;
        if(list !== undefined){
            list.map((d) => {
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



