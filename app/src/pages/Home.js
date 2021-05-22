import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuctions } from "../services/auction";

import Navbar from "../components/navbar";

export default function Home() {
    const [links, setLinks] = useState([]);
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getAuctions({sort, page, searchTerm: search})
            .then(res => {
                setItems(res.data.data);
                setLinks(res.data.links);
            })
            .catch(() => { });
    }, [sort, page, search]);

    const goToPage = (link) => {
        if (typeof link.url !== 'undefined' && link.url !== null && (new URL(link.url)).searchParams) {
            setPage((new URL(link.url)).searchParams.get('page'));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchTerm);
        setPage(1);
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <h1>Auctions</h1>

                <form className="row" onSubmit={handleSearch}>
                    <div className="col">
                        <div className="dropdown">
                            <button className="btn btn-sm btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Sort by Price
                            </button>
                            <ul className="dropdown-menu">
                                <li><div className={"dropdown-item " + (sort === 'asc' && ' active')} onClick={() => setSort('asc')}>Low to high</div></li>
                                <li><div className={"dropdown-item " + (sort === 'desc' && ' active')} onClick={() => setSort('desc')}>High to low</div></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col">
                        <div className="input-group input-group-sm mb-3">
                            <input type="text" className="form-control" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
                            <button className="btn btn-primary" type="submit" id="button-addon2">Search</button>
                        </div>
                    </div>
                </form>


                {items.length > 0 && (
                    <div className="row">
                        {items.map(auction => (
                            <div className="col-sm-3" key={auction.id}>
                                <div className="card mb-5">
                                    <Link to={`/detail/${auction.id}`}>
                                        <img src={auction.image_path} className="card-img-top" alt={auction.title} />
                                    </Link>
                                    <div className="card-body">
                                        <h4 className="card-price">Bid: ${auction.last_price}</h4>
                                        <h5 className="card-title">{auction.title}</h5>
                                        <p className="card-text">{auction.description}</p>
                                        <Link to={`/detail/${auction.id}`} className="btn btn-success">Bid Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <nav>
                    <ul className="pagination justify-content-center">
                        {links.map((link, index) => (
                            <li className={"page-item " + (link.url == null && 'disabled ') + (link.active && ' active ')} key={index}>
                              <span className="page-link" onClick={() => goToPage(link)} style={{ cursor: 'pointer' }}>
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                              </span>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}
