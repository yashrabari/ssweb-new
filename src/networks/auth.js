import requests from './'


const loginRequest = async (data) => {
    return await (await requests.post('/auth/login', data)).data
}


const verifyOtp = async (data) => {
    return await (await requests.post('/auth/2fa', data)).data
}



export {
    loginRequest,
    verifyOtp
}