import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardKos = ({ pemilikId }) => {
    const navigate = useNavigate();
    const [kosList, setKosList] = useState([]);
    const [form, setForm] = useState({ 
        nama: "", 
        alamat: "", 
        harga: "", 
        fasilitas: [], 
        foto_url: [],
        fotoFiles: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser || !token) {
            navigate("/login");
            return;
        }

        const user = JSON.parse(storedUser);

        if (user.role !== "owner") {
            alert("Akses ditolak. Halaman ini hanya untuk pemilik kos");
            navigate("/");
        } else {
            setIsAuthorized(true);
        }
    }, [navigate, token]);

    useEffect(() => {
        if (isAuthorized && pemilikId) {
            fetchKos();
        }
    }, [isAuthorized, pemilikId]);

    const fetchKos = async () => {
        const res = await fetch(`kos-backend-production.up.railway.app/api/kos?pemilik=${pemilikId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        setKosList(data);
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === "fasilitas") {
            setForm((prev) => {
                const updated = checked
                    ? [...prev.fasilitas, value]
                    : prev.fasilitas.filter((item) => item !== value);
                return { ...prev, fasilitas: updated };
            });
        } else if (name === "foto") {
            setForm((prev) => ({ ...prev, fotoFiles: Array.from(files) }));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isEditing
            ? `kos-backend-production.up.railway.app/api/kos/${editId}`
            : "kos-backend-production.up.railway.app/api/kos";

        const method = isEditing ? "PUT" : "POST";

        const formData = new FormData();
        formData.append("nama", form.nama);
        formData.append("alamat", form.alamat);
        formData.append("harga", form.harga);
        formData.append("fasilitas", JSON.stringify(form.fasilitas));

        if (!isEditing) {
            formData.append("latitude", form.latitude || "");
            formData.append("longitude", form.longitude || "");
        }

        form.fotoFiles.forEach((file) => {
            formData.append("foto", file)
        });

        const res = await fetch(endpoint, {
            method,
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.text();
            alert(`Gagal menyimpan kos: ${error}`);
            return;
        }

        setForm({ nama: "", alamat: "", harga: "", fasilitas: [], foto_url: [], fotoFiles: [] });
        setIsEditing(false);
        setEditId(null);
        fetchKos();
    };

    const handleEdit = (kos) => {
        setForm({
            nama: kos.nama,
            alamat: kos.alamat,
            harga: kos.harga,
            fasilitas: kos.fasilitas || [],
            foto_url: kos.foto_url || [],
            fotoFiles: []
        });
        setIsEditing(true);
        setEditId(kos.id);
    };

    const handleDelete = async (id) => {
        const confirmDelete = confirm("Yakin ingin menghapus kos ini?");
        if (!confirmDelete) return;

        const res = await fetch(`kos-backend-production.up.railway.app/api/kos/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const error = await res.text();
            alert(`Gagal menghapus kos: ${error}`);
            return;
        }

        fetchKos();
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl text-orange-500 font-bold mb-4">Dashboard Kos</h2>

            <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded border border-orange-400 mb-6 space-y-3">
                <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Nama kos"
                    className="w-full p-2 text-black border border-gray-400 rounded placeholder:text-gray-600"
                    required
                />
                <input
                    type="text"
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    placeholder="Alamat"
                    className="w-full p-2 text-black border border-gray-400 rounded placeholder:text-gray-600"
                    required
                />
                <input
                    type="number"
                    name="harga"
                    value={form.harga}
                    onChange={handleChange}
                    placeholder="Harga per bulan"
                    className="w-full p-2 border text-black border-gray-400 rounded placeholder:text-gray-600"
                    required
                />

                <div className="flex gap-4 text-orange-500 font-bold">
                    <label className="flex items-center gap-1">
                        <input type="checkbox" name="fasilitas" value="AC" checked={form.fasilitas.includes("AC")} onChange={handleChange} /> AC
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="checkbox" name="fasilitas" value="Wifi" checked={form.fasilitas.includes("Wifi")} onChange={handleChange} /> Wifi
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="checkbox" name="fasilitas" value="Kamar Mandi Dalam" checked={form.fasilitas.includes("Kamar Mandi Dalam")} onChange={handleChange} /> Kamar Mandi Dalam
                    </label>
                </div>

                <input
                    type="file"
                    name="foto"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border border-black text-black"
                />

                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {isEditing ? "Update Kos" : "Tambah Kos"}
                </button>
            </form>

            <div className="space-y-4">
                {kosList.map((kos) => (
                    <div key={kos.id} className="p-4 border border-gray-200 rounded shadow flex justify-between items-center">
                        <div>
                            <p className="font-bold text-lg">{kos.nama}</p>
                            <p className="text-gray-600">{kos.alamat}</p>
                            <p className="text-gray-800">Rp {kos.harga}/bulan</p>
                        </div>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEdit(kos)}
                                className="px-3 py-1 bg-yellow-400 text-white rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(kos.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardKos;
