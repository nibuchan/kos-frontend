import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: ""});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("kos-backend-production.up.railway.app/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                id: data.id,
                nama: data.nama,
                email: data.email,
                role: data.role
            }));

            console.log("Login response:", {
                id: data.id,
                nama: data.nama || "unknown",
                token: data.token,
                role: data.role
            })

            alert("Login berhasil");

            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 border border-orange-400">
                <h2 className="text-black text-2xl font-bold text-center mb-4">Login</h2>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <input 
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 text-black border border-orange-500 rounded placeholder:text-gray-600"
                    required
                />
                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 text-black border border-orange-500 rounded placeholder:text-gray-600"
                    required
                />

                <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;