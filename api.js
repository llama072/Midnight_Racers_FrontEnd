const BASE = "http://localhost:3000"

export async function regisztracio(User_Name, First_Name, Last_Name, Email, Password){
    const res = await fetch(`${BASE}/regisztracio`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({User_Name, First_Name, Last_Name, Email, Password, Is_Admin: 0})
    })
    const data = await res.json();
    if(!res.ok){
        return {result: false, message: data.message};
    }else{
        return {result: true, message: data.message};
    }
}

export async function bejelentkezes(User_Name, Password) {
    const res = await fetch(`${BASE}/belepes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Ez kötelező, hogy a sütit (cookie) el tudja menteni a böngésző!
        credentials: 'include', 
        body: JSON.stringify({ User_Name, Password })
    });
    
    return await res.json();
}

// api.js
export async function kijelentkezes() {
    try {
        const response = await fetch("http://localhost:3000/kijelentkezes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Nagyon fontos a sütik miatt:
            credentials: "include" 
        });
        return await response.json();
    } catch (error) {
        console.error("Logout hiba:", error);
        return { message: "Hiba történt" };
    }
}