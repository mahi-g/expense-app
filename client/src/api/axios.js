import axios from 'axios';

//create an instance of axios
const axiosApiInstance = axios.create({
    baseURL: `http://localhost:3006/api`
});

//request interceptor that defines the header for all routes
axiosApiInstance.interceptors.request.use( req => {
    console.log("RUNNING INTERCEPTOR");
    console.log(`${req.method} ${req.url}`);
    if(req.url !== '/login') { 
        if(req.url !== '/refresh-token') { 
            req.headers.authorization = 'Bearer '+localStorage.getItem('accessToken');
        }
    }
    // Important: request interceptors **must** return the request.
    return req;
  });

axiosApiInstance.interceptors.response.use( res => res, err => {
    console.log("Response interceptor");
    console.log("Error:",err.response);
        if(err.response.status === 403){
             (async() => {
                await axiosApiInstance.post('/refresh-token', {}, {withCredentials:true}).then(
                    res => {
                        console.log(res);
                    }
                );
            })();
            console.log("if");
        }
        else{
            console.log("Else");
        }
    }
);


  export default axiosApiInstance;