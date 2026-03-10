import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import TextBox from "../components/Textbox";
import Button from "../components/Button";
import { useTheme } from "../context/ThemeContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import { bejelentkezes } from "../../api";

export default function Login() {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    const [felhasznalonev, setFelhasznalonev] = useState("");
    const [jelszo, setJelszo] = useState("");
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    const handleLogin = async () => {
        if (!felhasznalonev || !jelszo) {
            alert("Hiányos adat(ok)!");
            return;
        }
        try {
            const res = await bejelentkezes(felhasznalonev, jelszo);
            if (res.result) {
                alert(res.message || "Sikeres belépés!");
                localStorage.setItem("user", JSON.stringify(res.user));
                navigate("/");
                window.location.reload();
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error("Hiba a belépés során:", error);
            alert("A szerver jelenleg nem elérhető.");
        }
    };

    return (
        <div onMouseMove={handleMouseMove} style={{
            height: "100vh", width: "100vw",
            position: "relative", overflow: "hidden", backgroundColor: "black"
        }}>
            <div style={{
                backgroundImage: `url(${isDarkMode ? DarkBackGround : BackGround})`,
                backgroundSize: "cover", backgroundPosition: "center",
                position: "absolute", top: "-5%", left: "-5%",
                width: "110%", height: "110%", zIndex: 0,
                transform: `translate(${offset.x}px, ${offset.y}px)`
            }} />
            <div style={{
                position: "absolute", top: 0, left: 0,
                width: "100%", height: "100%",
                backgroundColor: isDarkMode ? "transparent" : "rgba(0,0,0,0.5)",
                zIndex: 1, transition: "background-color 0.5s ease"
            }} />

            <div onClick={toggleTheme} style={{
                position: 'fixed', bottom: '30px', left: '30px',
                zIndex: 9999, cursor: 'pointer', transition: 'transform 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img src={isDarkMode ? SunIcon : MoonIcon} alt="Theme Toggle"
                    style={{ width: '40px', height: '40px', filter: 'invert(1) brightness(2)' }} />
            </div>

            <div className="no-scrollbar" style={{
                position: "relative", zIndex: 2, height: "100vh",
                overflowY: "auto", width: "100%",
                display: "flex", flexDirection: "column", alignItems: "center"
            }}>
                <Navbar />
                <div style={{
                    display: "flex", justifyContent: "center",
                    alignItems: "center", flexGrow: 1, width: "100%"
                }}>
                    <Card width="500px" height="450px" title="LOGIN">
                        <div className="login-content p-4">
                            <div className="mb-3">
                                <TextBox
                                    title="Felhasználónév"
                                    type="text"
                                    placeholder="Username"
                                    value={felhasznalonev}
                                    setValue={setFelhasznalonev}
                                />
                            </div>
                            <div className="mb-3">
                                <TextBox
                                    title="Jelszó"
                                    type="password"
                                    placeholder="Password"
                                    value={jelszo}
                                    setValue={setJelszo}
                                />
                            </div>
                            <div className="mt-4 text-center">
                                <Button content="Login" onClick={handleLogin} color={"info"} />
                            </div>
                            <div className="text-center text-white mt-3">
                                Don't have an account? <br />
                                <Link to="/Register" className="fw-bold text-decoration-none"
                                    style={{ color: '#8898f0' }}>
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
                <div style={{ height: "80px" }} />
            </div>
        </div>
    );
}