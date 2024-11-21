module.exports.convertBase64 =  async function(file){
    return new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            resolve(reader.result)
        };
        reader.onerror = (error)=>{
            reject(error)
        }
    });
}
module.exports.authenticateUser =  function()
{
    let user = sessionStorage.getItem("user");
    if(user==undefined || user==null)
        return false;
    else
        return JSON.parse(user);
}
