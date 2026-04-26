import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import TextBox from "../components/Textbox";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import { toast } from "../components/Toast";
import { bejelentkezes } from "../../api";

export default function Login() {
    const navigate = useNavigate();
    const [felhasznalonev, setFelhasznalonev] = useState("");
    const [jelszo, setJelszo] = useState("");

    const handleLogin = async () => {
        if (!felhasznalonev || !jelszo) {
            toast.warning("Hiányos adat(ok)!");
            return;
        }
        try {
            const res = await bejelentkezes(felhasznalonev, jelszo);
            if (res.result) {
                toast.success(res.message || "Sikeres belépés!");
                // Csak a nevet cache-eljuk UI-hoz. Az is_admin-t a backend /me endpointjarol kerjuk le,
                // igy a localStorage manipulacio nem tud adminna tenni senkit.
                localStorage.setItem("user", JSON.stringify({ name: res.user?.name }));
                navigate("/");
                window.location.reload();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("Hiba a belépés során:", error);
            toast.error("A szerver jelenleg nem elérhető.");
        }
    };

    return (
        <PageWrapper scrollClassName="no-scrollbar" scrollStyle={{ alignItems: 'center' }}>
            <div className="login-card-wrapper" style={{
                display: "flex", justifyContent: "center",
                alignItems: "center",
                flexGrow: 1, width: "100%",
                paddingBottom: "40px"
            }}>
                <Card width="500px" height="auto" title="LOGIN">
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
        </PageWrapper>
    );
}
