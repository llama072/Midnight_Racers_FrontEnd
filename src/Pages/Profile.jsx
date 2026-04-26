import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import TextBox from "../components/Textbox";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import Modal from "../components/Modal";
import { toast } from "../components/Toast";
import { getProfilAdatok, updateProfilAdat, updatePassword, deleteProfile, clearToken } from "../../api";

const FIELD_LABELS = {
    First_Name: "Keresztnév",
    Last_Name:  "Vezetéknév",
    User_Name:  "Felhasználónév",
    Email:      "E-mail"
};

export default function Profile() {
    const [First_Name, setF_name] = useState("");
    const [Last_Name, setL_name] = useState("");
    const [User_Name, setUsername] = useState("");
    const [Email, setEmail] = useState("");
    // Eredeti ertekek — hogy ne mentsunk valtozatlan adatot
    const [original, setOriginal] = useState({ First_Name: "", Last_Name: "", User_Name: "", Email: "" });
    const [savingField, setSavingField] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [viewAnim, setViewAnim] = useState('in'); // 'in' | 'out' — sima atmenet account <-> password kozott
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    // Sima atmenet a ket nezet kozott (kifade -> tartalom csere -> befade)
    const switchView = (toPassword) => {
        setViewAnim('out');
        setTimeout(() => {
            setIsChangingPassword(toPassword);
            if (!toPassword) {
                setPasswords({ current: "", new: "", confirm: "" });
            }
            setViewAnim('in');
        }, 200);
    };
    // Delete profil modal
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletePwd, setDeletePwd] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfilAdatok();
                if (data && data.User_Name) {
                    setF_name(data.First_Name || "");
                    setL_name(data.Last_Name || "");
                    setUsername(data.User_Name || "");
                    setEmail(data.Email || "");
                    setOriginal({
                        First_Name: data.First_Name || "",
                        Last_Name:  data.Last_Name  || "",
                        User_Name:  data.User_Name  || "",
                        Email:      data.Email      || ""
                    });
                }
            } catch (error) {
                console.error("Hiba történt a profil lekérésekor:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (field, value) => {
        const label = FIELD_LABELS[field] || field;
        const trimmed = (value ?? "").trim();

        // Ures mezo vedelem
        if (trimmed === "") {
            return toast.warning(`A(z) ${label} mező nem lehet üres!`);
        }
        // Nem valtozott -> nincs mit menteni
        if (trimmed === (original[field] ?? "").trim()) {
            return toast.info("Nincs változás — nincs mit menteni.");
        }
        // Extra: email alap formatum ellenorzes
        if (field === "Email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            return toast.warning("Érvénytelen e-mail cím!");
        }

        setSavingField(field);
        try {
            const res = await updateProfilAdat(field, trimmed);
            if (res.result) {
                setOriginal(prev => ({ ...prev, [field]: trimmed }));
                toast.success(`${label} mentve! 💾`);
            } else {
                toast.error("Hiba: " + res.message);
            }
        } catch {
            toast.error("Szerverhiba a mentésnél!");
        }
        setSavingField(null);
    };

    const handleDeleteProfile = async () => {
        if (!deletePwd) return toast.warning("Add meg a jelenlegi jelszavadat a törléshez!");
        setDeleteLoading(true);
        try {
            const res = await deleteProfile(deletePwd);
            if (res.result) {
                // Takaritas: tokent, localStorage usert, majd atiranyit
                clearToken();
                localStorage.removeItem("user");
                toast.success("A fiókod sikeresen törölve lett.");
                navigate("/");
                // teljes reload hogy a Navbar is frissuljon
                window.location.reload();
            } else {
                toast.error("Hiba: " + (res.message || "Ismeretlen hiba"));
            }
        } catch {
            toast.error("Szerverhiba törlés közben!");
        }
        setDeleteLoading(false);
    };

    const handlePasswordSave = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            return toast.warning("Kérlek töltsd ki az összes mezőt!");
        }
        if (passwords.new !== passwords.confirm) {
            return toast.warning("Az új jelszavak nem egyeznek!");
        }
        if (passwords.new.length < 6) {
            return toast.warning("Az új jelszónak legalább 6 karakternek kell lennie!");
        }
        try {
            const res = await updatePassword(passwords.current, passwords.new);
            if (res.result) {
                toast.success("Jelszó sikeresen módosítva! ✔️");
                switchView(false);
            } else {
                toast.error("Hiba: " + res.message);
            }
        } catch {
            toast.error("Hiba történt a mentés során!");
        }
    };

    return (
        <>
        <PageWrapper scrollStyle={{ alignItems: 'center' }}>
            <div style={{
                display: "flex", justifyContent: "center",
                alignItems: "center", flexGrow: 1, width: "100%"
            }}>
                <Card width="800px" height="auto" title={isChangingPassword ? "CHANGE PASSWORD" : "ACCOUNT"}>
                    {!isChangingPassword ? (
                        <div className="px-5 py-4">
                            <style>{`
                                .save-btn {
                                    position: absolute; right: 18px; top: 50%;
                                    transform: translateY(-50%);
                                    background: rgba(255,255,255,0.08);
                                    border: 1px solid rgba(255,255,255,0.18);
                                    border-radius: 10px;
                                    width: 36px; height: 36px;
                                    display: flex; align-items: center; justify-content: center;
                                    cursor: pointer; color: white;
                                    font-size: 1rem;
                                    transition: background 0.2s, opacity 0.2s, transform 0.2s;
                                    z-index: 5; padding: 0;
                                }
                                .save-btn:hover:not(:disabled) {
                                    background: rgba(136,152,240,0.25);
                                    border-color: rgba(136,152,240,0.5);
                                    transform: translateY(-50%) scale(1.05);
                                }
                                .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                                .save-btn.dirty {
                                    background: rgba(100,200,100,0.22);
                                    border-color: rgba(100,200,100,0.5);
                                }
                                .save-btn .spin {
                                    width: 14px; height: 14px; border-radius: 50%;
                                    border: 2px solid rgba(255,255,255,0.3);
                                    border-top-color: white;
                                    animation: spin 0.7s linear infinite;
                                }
                                @keyframes spin { to { transform: rotate(360deg); } }
                                input { padding-right: 60px !important; }
                            `}</style>
                            {(() => {
                                const renderSaveBtn = (field, value) => {
                                    const isDirty = (value ?? "").trim() !== "" && (value ?? "").trim() !== (original[field] ?? "").trim();
                                    const isSaving = savingField === field;
                                    return (
                                        <button
                                            type="button"
                                            className={`save-btn ${isDirty ? 'dirty' : ''}`}
                                            onClick={() => handleUpdate(field, value)}
                                            disabled={isSaving}
                                            aria-label={`${FIELD_LABELS[field]} mentése`}
                                            title={isDirty ? `${FIELD_LABELS[field]} mentése` : 'Nincs változás'}
                                        >
                                            {isSaving ? <span className="spin" /> : '💾'}
                                        </button>
                                    );
                                };
                                return (
                                    <>
                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6 position-relative">
                                                <TextBox placeholder="First Name" type="text" value={First_Name} setValue={setF_name} />
                                                {renderSaveBtn('First_Name', First_Name)}
                                            </div>
                                            <div className="col-md-6 position-relative">
                                                <TextBox placeholder="Last Name" type="text" value={Last_Name} setValue={setL_name} />
                                                {renderSaveBtn('Last_Name', Last_Name)}
                                            </div>
                                        </div>
                                        <div className="row g-3 mb-3">
                                            <div className="col-12 position-relative">
                                                <TextBox placeholder="Username" type="text" value={User_Name} setValue={setUsername} />
                                                {renderSaveBtn('User_Name', User_Name)}
                                            </div>
                                        </div>
                                        <div className="row g-3 mb-3">
                                            <div className="col-12 position-relative">
                                                <TextBox placeholder="E-mail" type="email" value={Email} setValue={setEmail} />
                                                {renderSaveBtn('Email', Email)}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                            <div className="mt-4 d-flex flex-column align-items-center gap-3 pb-3">
                                <div style={{ width: "100%", maxWidth: "420px" }}>
                                    <Button
                                        content="CHANGE YOUR PASSWORD"
                                        color="primary"
                                        onClick={() => setIsChangingPassword(true)}
                                    />
                                </div>
                                <div style={{ width: "100%", maxWidth: "420px" }}>
                                    <Button
                                        content="DELETE YOUR PROFILE"
                                        color="danger"
                                        onClick={() => { setDeletePwd(""); setDeleteOpen(true); }}
                                    />
                                </div>
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

        {/* FIOK TORLES MEGEROSITES MODAL */}
        <Modal
            open={deleteOpen}
            onClose={() => { if (!deleteLoading) setDeleteOpen(false); }}
            title="Fiók törlése"
            maxWidth="520px"
        >
            <div style={{
                background: 'rgba(255,80,80,0.08)',
                border: '1px solid rgba(255,80,80,0.25)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '16px',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.85)'
            }}>
                ⚠️ <b>Figyelem!</b> Ez a művelet visszavonhatatlan.
                A fiókod, az összes statisztikád és eredményed véglegesen törlődik.
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '10px' }}>
                A megerősítéshez add meg a jelenlegi jelszavadat:
            </p>
            <input
                type="password"
                autoFocus
                value={deletePwd}
                onChange={(e) => setDeletePwd(e.target.value)}
                placeholder="Jelenlegi jelszó"
                onKeyDown={(e) => { if (e.key === 'Enter') handleDeleteProfile(); }}
                style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    padding: '10px 14px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                }}
            />

            <div style={{
                display: 'flex', gap: '10px',
                justifyContent: 'flex-end', marginTop: '18px', flexWrap: 'wrap'
            }}>
                <button
                    onClick={() => setDeleteOpen(false)}
                    disabled={deleteLoading}
                    style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        color: 'white', borderRadius: '10px',
                        padding: '10px 20px', cursor: deleteLoading ? 'wait' : 'pointer',
                        fontSize: '0.9rem'
                    }}
                >Mégse</button>
                <button
                    onClick={handleDeleteProfile}
                    disabled={deleteLoading || !deletePwd}
                    style={{
                        background: 'rgba(255,60,60,0.85)',
                        border: '1px solid rgba(255,60,60,1)',
                        color: 'white', borderRadius: '10px',
                        padding: '10px 20px',
                        cursor: (deleteLoading || !deletePwd) ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem', fontWeight: '600',
                        opacity: (deleteLoading || !deletePwd) ? 0.6 : 1
                    }}
                >{deleteLoading ? 'Törlés...' : '🗑 Fiók végleges törlése'}</button>
            </div>
        </Modal>
        </>
    );
}
