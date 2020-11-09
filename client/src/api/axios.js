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

    if(req.url !== '/login') { 
        if(req.url !== '/refresh-token') { 
            req.headers.authorization = 'Bearer '+localStorage.getItem('accessToken');
        }
    }
    // Important: request interceptors **must** return the request.
    return req;
  });



export default axiosApiInstance;