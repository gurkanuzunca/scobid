import axios from 'axios';
import { getUser } from './services/auth'
import {useHistory} from 'react-router-dom';
import config from './config.json';

const api = axios.create({
    baseURL: config[process.env.NODE_ENV].baseUrl,
    headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use((config) => {
    config.headers.common = {...config.headers.common, 'x-auth-user': getUser()};
    return config;
}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use((response) => {
    return redirects(response.data, 'code');
}, (error) =>  {
    return Promise.reject(redirects(error.response));
});

function redirects(response, code) {
    code = code || 'status';

    if (response[code] === 401 && window.location.pathname !== '/login') {
        localStorage.clear();

        return (window.location.href = '/login');
    } else if (response[code] >= 500 || response[code] === 404) {
        return (window.location.href = '/error/'+ response[code]);
    }

    return response;

}

export default api;
