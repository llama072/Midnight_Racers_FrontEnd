import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackGround from "../assets/Background.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import TextBox from "../components/Textbox";
import Button from "../components/Button";
import 'bootstrap/dist/css/bootstrap.min.css'
import { regisztracio } from "../../api";

export default function Register() {
    const navigate = useNavigate();

    const [First_Name, setF_name] = useState("");
    const [Last_Name, setL_name] = useState("");
    const [User_Name, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState(""); // Legyen simán Password
    const [ConfirmPassword, setConfirmPassword] = useState(""); // Legyen egyértelmű






    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
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

            {/* Sötét overlay */}
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

            <div
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
                    <Card width="800px" height="600px" title="CREATE AN ACCOUNT">
                        <div className="px-5 py-4">

                            {/* First + Last */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <TextBox placeholder="First Name" type="text" value={First_Name} setValue={setF_name} />
                                </div>
                                <div className="col-md-6">
                                    <TextBox placeholder="Last Name" type="text" value={Last_Name} setValue={setL_name} />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="row g-3 mb-3">
                                <div className="col-12">
                                    <TextBox placeholder="Username" type="text" value={User_Name} setValue={setUsername} />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="row g-3 mb-3">
                                <div className="col-12">
                                    <TextBox placeholder="E-mail" type="email" value={Email} setValue={setEmail} />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="row g-3 mb-3">
                                <div className="col-12">
                                    <TextBox placeholder="Password" type="password" value={Password} setValue={setPassword} />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="row g-3">
                                <div className="col-12">
                                    <TextBox placeholder="Confirm Password" type="password" value={ConfirmPassword} setValue={setConfirmPassword} />
                                </div>
                            </div>

                            {/* Button */}
                            <div className="mt-4 text-center">
                                <Button content="Register" color="info" onClick={async () => {
                                    console.log("Állapot ellenőrzése:", { User_Name, First_Name, Last_Name, Email, Password, ConfirmPassword });
                                    if (!User_Name || !First_Name || !Last_Name || !Email || !Password || !ConfirmPassword) {
                                        alert("Hianyos Adat(ok)  ₍^. .^₎⟆  ")
                                        return;
                                    }
                                    if (Password !== ConfirmPassword) {
                                        alert("A jelszavak nem egyeznek!")
                                        return;
                                    }
                                    const res = await regisztracio(User_Name, First_Name, Last_Name, Email, Password);
                                    if (res.result) {
                                        navigtation('/')
                                    }

                                }}


                                />

                                <div className="mt-3 text-white-50 small">
                                    Already have an account?
                                    <Link
                                        to="/Login"
                                        className="text-info ms-2 fw-bold text-decoration-none"
                                    >
                                        Login here
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}