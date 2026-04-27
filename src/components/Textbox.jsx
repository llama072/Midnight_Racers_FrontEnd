export default function TextBox({ placeholder, type, value, setValue, readOnly = false, onEnter }) {
    const handleKeyDown = onEnter
        ? (e) => { if (e.key === 'Enter') { e.preventDefault(); onEnter(); } }
        : undefined;
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={readOnly ? undefined : (e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            className="form-control w-100"
            style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                borderRadius: "12px",
                padding: "12px 16px",
                width: "100%",
                cursor: readOnly ? "pointer" : "text",
            }}
        />
    );
}
