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
    
        //if error is 403, accessToken is expired, refresh the token
        if(err.response.status === 403){
             
            await axiosApiInstance.post('/refresh-token', {}, {withCredentials:true}).then(
                //store the new accessToken in localStorage
                res => {
                    console.log(res);
                    localStorage.removeItem('accessToken');
                    localStorage.setItem('accessToken', res.data.accessToken);
                }
            );
            reTryRequest(err.config);
            return err;
        }
});

const reTryRequest = (originalRequest) => {
    //retry the old request that returned 403 error
    //attach the new accessToken into the header
    originalRequest.headers.authorization = 'Bearer '+localStorage.getItem('accessToken');
    axiosApiInstance.request(originalRequest).then(response => {
        console.log("response from retry");
        console.log(response);

    });
}

  export default axiosApiInstance;