import { useState, useEffect } from "react";
import Card from "../components/Card";
import TextBox from "../components/Textbox";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import { getProfilAdatok, updateProfilAdat, updatePassword } from "../../api";

export default function Profile() {
    const [First_Name, setF_name] = useState("");
    const [Last_Name, setL_name] = useState("");
    const [User_Name, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfilAdatok();
                if (data && data.User_Name) {
                    setF_name(data.First_Name || "");
                    setL_name(data.Last_Name || "");
                    setUsername(data.User_Name || "");
                    setEmail(data.Email || "");
                }
            } catch (error) {
                console.error("Hiba történt a profil lekérésekor:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (field, value) => {
        try {
            const res = await updateProfilAdat(field, value);
            if (res.result) {
                alert(`${field} mentve! ✔️`);
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Szerverhiba a mentésnél!");
        }
    };

    const handlePasswordSave = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            return alert("Kérlek töltsd ki az összes mezőt!");
        }
        if (passwords.new !== passwords.confirm) {
            return alert("Az új jelszavak nem egyeznek!");
        }
        if (passwords.new.length < 6) {
            return alert("Az új jelszónak legalább 6 karakternek kell lennie!");
        }
        try {
            const res = await updatePassword(passwords.current, passwords.new);
            if (res.result) {
                alert("Jelszó sikeresen módosítva! ✔️");
                setIsChangingPassword(false);
                setPasswords({ current: "", new: "", confirm: "" });
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Hiba történt a mentés során!");
        }
    };

    return (
        <PageWrapper scrollStyle={{ alignItems: 'center' }}>
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", flexGrow: 1, width: "100%"
            }}>
                <Card width="800px" height="auto" title={isChangingPassword ? "CHANGE PASSWORD" : "ACCOUNT"}>
                    {!isChangingPassword ? (
                        <div className="px-5 py-4">
                            <style>{`
                                .tick-btn {
                                    position: absolute; right: 25px; top: 50%;
                                    transform: translateY(-50%); cursor: pointer;
                                    color: white; font-size: 1.2rem;
                                    transition: opacity 0.2s; z-index: 5;
                                }
                                .tick-btn:hover { opacity: 0.7; }
                                input { padding-right: 45px !important; }
                            `}</style>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6 position-relative">
                                    <TextBox placeholder="First Name" type="text" value={First_Name} setValue={setF_name} />
                                    <span className="tick-btn" onClick={() => handleUpdate('First_Name', First_Name)}>✔️</span>
                                </div>
                                <div className="col-md-6 position-relative">
                                    <TextBox placeholder="Last Name" type="text" value={Last_Name} setValue={setL_name} />
                                    <span className="tick-btn" onClick={() => handleUpdate('Last_Name', Last_Name)}>✔️</span>
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-12 position-relative">
                                    <TextBox placeholder="Username" type="text" value={User_Name} setValue={setUsername} />
                                    <span className="tick-btn" onClick={() => handleUpdate('User_Name', User_Name)}>✔️</span>
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-12 position-relative">
                                    <TextBox placeholder="E-mail" type="email" value={Email} setValue={setEmail} />
                                    <span className="tick-btn" onClick={() => handleUpdate('Email', Email)}>✔️</span>
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col-12" onClick={() => setIsChangingPassword(true)} style={{ cursor: "pointer" }}>
                                    <TextBox placeholder="********" type="password" readOnly />
                                </div>
                            </div>
                            <div className="mt-4 text-center pb-3">
                                <Button content="DELETE YOUR PROFILE" color="danger" onClick={() => {}} />
                            </div>
                        </div>
                    ) : (
                        <div className="px-5 py-4">
                            <div className="mb-3">
                                <TextBox placeholder="Current Password" type="password" value={passwords.current} setValue={(v) => setPasswords({ ...passwords, current: v })} />
                            </div>
                            <div className="mb-3">
                                <TextBox placeholder="New Password" type="password" value={passwords.new} setValue={(v) => setPasswords({ ...passwords, new: v })} />
                            </div>
                            <div className="mb-3">
                                <TextBox placeholder="Confirm Password" type="password" value={passwords.confirm} setValue={(v) => setPasswords({ ...passwords, confirm: v })} />
                            </div>
                            <div className="d-flex justify-content-center gap-3 mt-4 pb-3">
                                <div style={{ width: "200px" }}>
                                    <Button content="CANCEL" color="danger" onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswords({ current: "", new: "", confirm: "" });
                                    }} />
                                </div>
                                <div style={{ width: "200px" }}>
                                    <Button content="SAVE" color="primary" onClick={handlePasswordSave} />
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </PageWrapper>
    );
}
