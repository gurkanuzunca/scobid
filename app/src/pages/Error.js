import { Link, useParams } from 'react-router-dom';

export default function Error() {
    const { status } = useParams();

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-4">
                    <h1>{status || 404}</h1>
                    <p>Something went wrong!</p>
                    <Link to="/">Go Home</Link>
                </div>
            </div>
        </div>
    )
}
