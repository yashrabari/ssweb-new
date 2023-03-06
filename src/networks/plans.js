import requests from "./";


const getPlans = async () => {
    return await (await requests.get('/subscriptions')).data
}


export {
    getPlans
}