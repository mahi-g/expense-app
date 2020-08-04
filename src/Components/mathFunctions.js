export const getPaypalFee = (sold) => Math.floor((sold * 0.029 + 0.3) * 100) / 100;

export const getSellerFee = (platform,sold)=>{
    if(platform==="Ebay" || platform === "Depop"){
        return Math.floor(sold*.10*100) / 100;
    }
    else{
        return Math.floor((sold*.03+sold*.02)*100) / 100;
    }
}

export const getBalance = (sold,paypal,sellerF,shipping,other) => Math.floor((sold - paypal - sellerF - shipping - other) * 100) / 100;

export const getProfit=(balance, paid)=> Math.floor((balance - paid) * 100) / 100;

