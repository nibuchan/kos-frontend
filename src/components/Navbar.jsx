import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [filteredKos, setFilteredKos] = useState([]);
    const [dataKos, setDataKos] = useState([]);

    useEffect(() => {
        fetch("https://kos-backend-production.up.railway.app/api/kos")
            .then((res) => res.json())
            .then((data) => setDataKos(data))
            .catch((err) => console.error("Gagal fetch kos:", err))
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            setFilteredKos([]);
            return;
        }

        const results = dataKos.filter((kos) =>
            kos.nama.toLowerCase().includes(value.toLowerCase()) ||
            kos.alamat.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredKos(results);
    };

    return (
        <div className="w-screen bg-white shadow-md">
            <div className="max-w-screen mx-auto px-6 py-4 flex items-center justify-between">
                {/* Nama Website */}
                <div className="text-2xl font-extrabold text-orange-600">BaCariKos</div>

                {/* Search Bar */}
                <div className="relative flex-1 mx-6">
                    <input 
                        type="text" 
                        value={query}
                        onChange={handleSearch}
                        placeholder="Cari kos...."
                        className="w-full px-4 py-2 rounded-md border border-orange-500 placeholder:text-gray-700 text-black focus:outline-none focus:ring-2 focus:ring-orange-400" 
                    />

                    {query && (
                        <div
                            onClick={() => navigate(`/kos/${kos.id}`)} 
                            className="absolute z-50 mt-1 w-full bg-white border border-orange-400 rounded-md shadow-lg max-h-64 overflow-auto"
                        >
                            {filteredKos.length === 0 ? (
                                <div className="px-4 py-2 text-gray-500">Kos tidak ditemukan</div>
                            ) : (
                                filteredKos.map((kos) => (
                                    <a 
                                        href={`/kos/${kos.id}`}
                                        key={kos.id}
                                        className="flex items-start gap-2 px-4 py-2 hover:bg-orange-100 border-b last:border-none"
                                    >
                                        {kos.foto_url && (
                                            <img 
                                                src={Array.isArray(kos.foto_url)
                                                    ? kos.foto_url[0]
                                                    : JSON.parse(kos.foto_url)[0]
                                                }
                                                alt={kos.nama}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <h4 className="text-sm font-semibold text-black">{kos.nama}</h4>
                                            <p className="text-xs text-gray-500">{kos.alamat}</p>
                                            <p className="text-sm text-orange-500 font-bold">
                                                Rp {kos.harga.toLocaleString()}
                                            </p>
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Login/Register */}
                <div className="space-x-3">
                    <button 
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800" 
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                    <button 
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;