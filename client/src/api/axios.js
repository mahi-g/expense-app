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

axiosApiInstance.interceptors.response.use(res => res, async err => {
    console.log("Response interceptor");
    console.log("Error:",err.response);
        console.log("Error config:",err.config);

        if(err.response.status === 403){
             
            await axiosApiInstance.post('/refresh-token', {}, {withCredentials:true}).then(
                res => {
                    console.log(res);
                    localStorage.removeItem('accessToken');
                    localStorage.setItem('accessToken', res.data.accessToken);

                }
            );
            const originalRequest = err.config;
            originalRequest.headers.authorization = 'Bearer '+localStorage.getItem('accessToken');
            axiosApiInstance.request(originalRequest);
            return Promise.reject(err);
        }
});


  export default axiosApiInstance;