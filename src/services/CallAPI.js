import axios from "axios";

const callApis = {
    //This Function is used to call User Micro API without any token.
    callPostApi: async function(api_url,request){
        try{
            const config = {
                url:process.env.REACT_APP_API_USER_MICRO_URL+api_url,
                method:"POST",
                header:{'Content-Type':'application/json'},
                data:request
            };
            let response = await axios.request(config);
            return response.data;
        }
        catch(error){
            return {code:500,message:error.message}
        }
    },

    callTaskMicroPostApi: async function(api_url,request){
        try{
            let user = JSON.parse(sessionStorage.getItem("user"));
            console.log(user)
            const config = {
                url:process.env.REACT_APP_API_TASK_MICRO_URL+api_url,
                method:"POST",
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer '+user.access_token
                  },
                data:request
            };
            let response = await axios.request(config);
            console.log("call "+api_url+" API")
            return response.data;
        }
        catch(err)
        {
            return {code:500,message:err.message}
        }
    },
    //This Function is used to call User Micro API with Access token(Breare Token)
    callUserMicroPostApi: async function(api_url,request){
        try{
            console.log('callUserMicroPostApi call')
            let user = JSON.parse(sessionStorage.getItem("user"));
            const config = {
                url:process.env.REACT_APP_API_USER_MICRO_URL+api_url,
                method:"POST",
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer '+user.access_token
                  },
                data:request
            };
            let response = await axios.request(config);
            return response.data;
        }
        catch(err)
        {
            return {code:500,message:err.message}
        }
    }
}

export default callApis;