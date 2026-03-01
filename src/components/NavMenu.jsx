import { Link } from 'react-router-dom';

export default function NavMenu() {
    return (
        <div className="nav-links-container">
            <Link to="/" className="nav-item">HOME</Link>
            <Link to="/download" className="nav-item">DOWNLOAD</Link>
            <Link to="/updates" className="nav-item">UPDATES</Link>
            <Link to="/donate" className="nav-item">DONATE</Link>
            <Link to="/faq" className="nav-item">FAQ</Link>
        </div>
    );
}