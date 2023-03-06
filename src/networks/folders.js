import requests from '.'



requests.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;



const getFolders = async () => {
    return await (await requests.get('/folders')).data
}

export {
    getFolders
}