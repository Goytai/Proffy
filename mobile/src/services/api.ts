import axios from 'axios'
import {url} from '../../config'

const api = axios.create({
    baseURL: url
})

export default api