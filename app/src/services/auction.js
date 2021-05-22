import api from '../interceptor';

export function getAuctions(credentials) {
    return api.get('/api/auction/index?' + new URLSearchParams(credentials).toString());
}

export function getAuction(auction) {
    return api.get(`/api/auction/detail/${auction}`);
}

export function makeBid(auctionId, credentials) {
    return api.post(`/api/bid/${auctionId}`, credentials);
}

export function activateAutoBid(auctionId, credentials) {
    return api.post(`/api/auto-bid/${auctionId}`, credentials);
}
