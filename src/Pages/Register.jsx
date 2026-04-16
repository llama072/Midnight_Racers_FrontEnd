import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/Card";
import TextBox from "../components/Textbox";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import { regisztracio } from "../../api";

export default function Register() {
    const navigate = useNavigate();
    const [First_Name, setF_name] = useState("");
    const [Last_Name, setL_name] = useState("");
    const [User_Name, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
        if (!User_Name || !First_Name || !Last_Name || !Email || !Password || !ConfirmPassword) {
            alert("Hiányos Adat(ok) ₍^. .^₎⟆");
            return;
        }
        if (Password.length < 6) {
            alert("A jelszónak legalább 6 karakternek kell lennie!");
            return;
        }
        if (Password !== ConfirmPassword) {
            alert("A jelszavak nem egyeznek!");
            return;
        }
        try {
            const res = await regisztracio(User_Name, First_Name, Last_Name, Email, Password);
            if (res.result) {
                alert(res.message || "Sikeres regisztráció!");
                navigate('/Login');
            } else {
                alert(res.message || "Hiba történt a regisztráció során.");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Szerver hiba történt, próbáld újra később!");
        }
    };

    return (
        <PageWrapper scrollStyle={{ alignItems: 'center' }}>
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: "110px", paddingBottom: "40px",
                width: "100%"
            }}>
                <Card width="800px" height="auto" title="CREATE AN ACCOUNT">
                    <div className="px-3 px-md-5 py-4">
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <TextBox placeholder="First Name" type="text" value={First_Name} setValue={setF_name} />
                            </div>
                            <div className="col-md-6">
                                <TextBox placeholder="Last Name" type="text" value={Last_Name} setValue={setL_name} />
                            </div>
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-12">
                                <TextBox placeholder="Username" type="text" value={User_Name} setValue={setUsername} />
                            </div>
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-12">
                                <TextBox placeholder="E-mail" type="email" value={Email} setValue={setEmail} />
                            </div>
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-12">
                                <TextBox placeholder="Password (min. 6 karakter)" type="password" value={Password} setValue={setPassword} />
                            </div>
                        </div>
                        <div className="row g-3">
                            <div className="col-12">
                                <TextBox placeholder="Confirm Password" type="password" value={ConfirmPassword} setValue={setConfirmPassword} />
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <Button content="Register" color="info" onClick={handleRegister} />
                            <div className="mt-3 text-white-50 small">
                                Already have an account?
                                <Link to="/Login" className="ms-2 fw-bold text-decoration-none"
                                    style={{ color: '#8898f0' }}>
                                    Login here
                                </Link>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </PageWrapper>
    );
}
