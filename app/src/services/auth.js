import api from '../interceptor';

export function signin(credentials) {
    return api.post('/api/login', credentials).then(res => {
        if (res.code === 200) {
            localStorage.setItem('user', res.data.user);
        } else {
            alert("Please check your login information!")
        }
    })
    .catch(e => {
        alert("Please check your login information!")
    });
}

export function signout() {
    localStorage.removeItem('user');
}

export function getUser() {
    return localStorage.getItem('user');
}


