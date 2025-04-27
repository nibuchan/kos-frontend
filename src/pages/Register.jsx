import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({ nama: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("https://kos-backend-production.up.railway.app/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            console.log("Register response:", {
                nama: data.user.nama,
                email: data.user.email,
                role: data.user.role || "owner"
            });

            alert("Registrasi berhasil! Silahkan login");

            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded border border-orange-400 shadow-md w-96">
                <h2 className="text-2xl text-black font-bold text-center mb-4">Register</h2>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <input
                    type="text"
                    name="nama"
                    placeholder="Nama"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full text-black mb-3 p-2 border border-orange-500 rounded placeholder:text-gray-600"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full text-black mb-3 p-2 border border-orange-500 rounded placeholder:text-gray-600"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border text-black border-orange-500 rounded placeholder:text-gray-600"
                    required
                />
                <button className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-500">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;