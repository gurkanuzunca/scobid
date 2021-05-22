import api from '../interceptor';

export function getSettings() {
    return api.get('/api/setting');
}

export function updateSettings(maxAmount) {
    return api.post('/api/setting/update', {maxAmount});
}
