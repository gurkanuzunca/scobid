import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuction, makeBid, activateAutoBid } from '../services/auction';

import Navbar from "../components/navbar";

export default function Detail() {
    const { auctionId } = useParams();

    const [auction, setAuction] = useState(null);
    const [settings, setSettings] = useState(null);
    const [countdown, setCountdown] = useState('');
    const [amount, setAmount] = useState('');
    const [autoBid, setAutoBid] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAuction(auctionId)
            .then(res => {
                setAuction(res.data);
                setSettings(res.settings);
                setCountdown(timer(res.data.closed_at));
                setError(null);

                if (res.data.auto_bid) {
                    setAutoBid(true);
                }

                if (res.code !== 200 ) {
                    setError(res.message);
                }
            })
            .catch((e) => setError('Something went wrong!'));
    }, [auctionId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (auction) {
                setCountdown(timer(auction.closed_at));
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    const runMakeBid = (e) => {
        e.preventDefault();

        makeBid(auctionId, { price: amount })
            .then(res => {
                setError(null);
                setAuction(res.data);

                if (res.code !== 200) {
                    setError(res.message)
                } else {
                    setAmount('');
                }
            })
            .catch(() => setError('You cannot make a bid for it!'));
    };

    const runActivateAutoBid = (e) => {
        activateAutoBid(auctionId, { status: !autoBid })
            .then(() => setAutoBid(!autoBid))
            .catch(() => setError('You cannot activate auto-bidding!'));
    };

    if (typeof auction !== 'object') {
        return <div className="alert alert-danger">Auction is not found.</div>;
    }

    return auction && (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-4">
                        <img src={auction.image_path} alt={auction.title} className="img-fluid" />
                    </div>

                    <div className="col-8">
                        {error && (
                            <div className="col-12">
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            </div>
                        )}

                        <h1>{auction.title}</h1>
                        <p className="text-danger">{countdown && countdown} left</p>
                        <p>{auction.description}</p>
                        <h2>${auction.last_price}</h2>

                        <form onSubmit={(e) => runMakeBid(e)}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="input-group mb-3">
                                        <input type="number" className={"form-control " + (amount && amount <= auction.last_price && ' is-invalid ')} value={amount} placeholder="Amount" required onChange={(e) => { setAmount(e.target.value) }} />
                                        <button className="btn btn-success" type="submit" id="bid" disabled={amount <= auction.last_price}>Submit Bid</button>
                                        {amount && amount <= auction.last_price && <div className="invalid-feedback">You cannot make a bid lower than the last price!</div>}
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="autoBid" value={autoBid} onChange={() => runActivateAutoBid()} checked={autoBid ? true : false} />
                                <label className="form-check-label" htmlFor="autoBid">Activate Auto-Bidding</label>
                            </div>
                            {autoBid && settings && settings.max_amount < 1 && (
                                <div className="text-muted">
                                    You need to set the maximum amount for Auto-bidding. <br />
                                    <Link to="/settings">Set the Max Amount</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <BidHistory bids={auction.bids} />
            </div>
        </>
    );
}

const BidHistory = ({ bids }) => bids.length > 0 && (
    <div className="mt-5">
        <h5>History</h5>
        <table className="table table-bordered table-striped">
            <thead>
            <tr>
                <th scope="col">User</th>
                <th scope="col">Amount</th>
                <th scope="col">Date</th>
            </tr>
            </thead>
            <tbody>
            {bids.map((bid, index) => (
                <tr key={index}>
                    <th scope="row">{bid.username}</th>
                    <td>${bid.price}</td>
                    <td>{new Date(bid.created_at).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

function timer(date) {
    let distance = new Date(date) - new Date();
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return distance < 0 ? 'EXPIRED' : days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';
}
