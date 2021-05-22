import { Link, useHistory } from 'react-router-dom';
import { getUser, signout } from '../services/auth';

export default function Navbar() {
    const history = useHistory();

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Antique Auctions</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" aria-current="page" to="/settings">Settings</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => { signout();  history.push('/login'); }}>Logout ({ getUser() })</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
