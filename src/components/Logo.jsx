import logoImg from "../assets/Logo.png";

export default function Logo() {
    return (
        <div style={{ width: '200px', display: 'flex', justifyContent: 'flex-start' }}>
            <img src={logoImg} alt="Logo" style={{ width: '120px', height: 'auto' }} />
        </div>
    );
}