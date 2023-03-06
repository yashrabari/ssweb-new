import axios from 'axios'


const baseURL = process.env.PROD ? `https://api.storeandsharevault.io/api/v1` : `https://localhost:5000/api/v1`

const requests = axios.create({
    baseURL: baseURL,
})



export default requests;