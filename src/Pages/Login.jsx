import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackGround from "../assets/Background.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import TextBox from "../components/Textbox";
import Button from "../components/Button";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from "react-router-dom";
import { bejelentkezes } from "../../api";


export default function Login() {
    const navigate = useNavigate();

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
            // Hívjuk a backendet
            const res = await bejelentkezes(felhasznalonev, jelszo);

            if (res.result) {
                // SIKER! A süti már a böngészőben van.
                alert(res.message);

                // Opcionális: elmentheted a nevet a gépükre is
                localStorage.setItem("username", res.user.name);

                navigate("/"); // Irány a kezdőlap!
            } else {
                // HIBA (pl. rossz jelszó vagy nincs ilyen felhasználó)
                alert(res.message);
            }
        } catch (error) {
            console.error("Hiba a belépés során:", error);
            alert("A szerver jelenleg nem elérhető.");
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                height: "100vh",
                width: "100vw",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "black"
            }}
        >
            {/* Parallax háttér */}
            <div
                style={{
                    backgroundImage: `url(${BackGround})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "absolute",
                    top: "-5%",
                    left: "-5%",
                    width: "110%",
                    height: "110%",
                    zIndex: 0,
                    transform: `translate(${offset.x}px, ${offset.y}px)`
                }}
            />

            {/* Sötétítő réteg */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 1
                }}
            />

            {/* Görgethető fő konténer */}
            <div
                className="no-scrollbar"
                style={{
                    position: "relative",
                    zIndex: 2,
                    height: "100vh",
                    overflowY: "auto",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Navbar />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexGrow: 1,
                        width: "100%"
                    }}
                >
                    <Card width="500px" height="400px" title="LOGIN">
                        <div className="login-content">

                            <TextBox
                                title="Felhasználónév"
                                type="text"
                                placeholder="Username"
                                value={felhasznalonev}
                                setValue={setFelhasznalonev}
                            />

                            <TextBox
                                title="Jelszó"
                                type="password"
                                placeholder="Password"
                                value={jelszo}
                                setValue={setJelszo}
                            />
                            <div className="mt-3">
                                <Button
                                    content="Login"
                                    onClick={handleLogin}
                                    color={"info"}
                                />
                            </div>
                            <div className="text-center text-white mt-2">
                                Don't have an account? <br />
                                <Link
                                    to="/Register"
                                    className="fw-bold text-decoration-none"
                                    style={{
                                        color: '#8898f0',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        transition: '0.3s'
                                    }}
                                    // Egy kis hover effekt, hogy világosodjon, ha ráviszed az egeret
                                    onMouseEnter={(e) => e.target.style.color = '#adb9f5'}
                                    onMouseLeave={(e) => e.target.style.color = '#8898f0'}
                                >
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