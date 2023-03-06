import requests from '.'



requests.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;



const getFiles = async () => {
    return await (await requests.get('/upload')).data
}

export {
    getFiles
}