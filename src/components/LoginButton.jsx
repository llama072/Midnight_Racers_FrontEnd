import { useNavigate } from "react-router-dom";

export default function LoginButton() {
    const navigate = useNavigate();

    return (
        <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
                onClick={() => navigate("/Login")} // Itt történik a navigáció
                className="btn btn-outline-light" // Bootstrap keretes fehér gomb
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    padding: '10px 25px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: '0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
                LOGIN / REGISTER
            </button>
        </div>
    );
}