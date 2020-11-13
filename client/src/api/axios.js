import axios from 'axios';

//create an instance of axios
const axiosApiInstance = axios.create({
    baseURL: `http://localhost:3006/api`
});

//request interceptor that defines the header for all routes
axiosApiInstance.interceptors.request.use( req => {
    console.log("RUNNING INTERCEPTOR");
    console.log(`${req.url}`);
    console.log(req);


    if(req.url !== '/login' || req.url !== '/refresh-token') { 
        if(localStorage.getItem('accessToken') !== null){
            req.headers.authorization = 'Bearer '+localStorage.getItem('accessToken');
        }
    }
    return req;
  });

export default axiosApiInstance;