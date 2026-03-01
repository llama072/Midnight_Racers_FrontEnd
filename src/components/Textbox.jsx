export default function TextBox({ placeholder, type, value, setValue }) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value} // Megmutatja az aktuális értéket
            onChange={(e) => setValue(e.target.value)} // Ez küldi vissza az adatot a szülőnek!
            className="form-control w-100"
            style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                borderRadius: "12px",
                padding: "12px 16px",
                width: "100%",
            }}
        />
    );
}