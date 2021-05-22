import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../services/settings'
import Navbar from "../components/navbar";


export default function Settings() {
    const [maxAmount, setMaxAmount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSettings()
            .then(res => {
                if (res.data !== null) {
                    setMaxAmount(res.data.max_amount);
                }
            })
            .catch((e) => setError('Something went wrong!'));
    }, []);

    const runUpdate = (e) => {
        e.preventDefault();

        updateSettings(maxAmount)
            .then(res => {
                console.log(res);
                setError(null);
                setMaxAmount(res.data.max_amount);

                if (res.code !== 200) {
                    setError(res.message);
                    setMaxAmount(0);
                } else {
                    alert('The maximum bid amount has been updated!');
                }
            })
            .catch(() => setError('Something went wrong!'));
    };

    return (
        <div>
            <Navbar/>
            <div className="row justify-content-center">
                <div className="col-sm-6 col-md-4">
                    <h1>Settings</h1>
                    {error && (
                        <div className="col-12">
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={runUpdate}>
                        <div className="mb-3">
                            <label htmlFor="maxAmount" className="form-label">Maximum Bid Amount</label>
                            <input id="maxAmount" name="maxAmount" type="number" className="form-control" onChange={(e) => { setMaxAmount(e.target.value) }} value={maxAmount} required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
