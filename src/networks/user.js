import requests from './'



requests.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;



const getUser = async () => {
    return await (await requests.get('/users')).data
}

export {
    getUser
}