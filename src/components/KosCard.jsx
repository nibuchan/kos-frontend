import { useNavigate } from "react-router-dom";

const KosCard = ({ kos }) => {
    console.log("Isi kos di KosCard:", kos);
    const navigate = useNavigate();

    const foto = Array.isArray(kos.foto_url)
        ? kos.foto_url[0]
        : JSON.parse(kos.foto_url || "[]")[0];

    return (
        <div
            onClick={() => navigate(`/kos/${kos.id}`)}
            className="cursor-pointer bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
        >
            <img src={foto || "/no-image.jpg"} alt={kos.nama} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h2 className="font-bold text-lg text-orange-500">{kos.nama}</h2>
                <p className="text-gray-600 text-sm">{kos.alamat}</p>
                <p className="mt-2 font-semibold text-black">Rp {kos.harga}/bulan</p>
            </div>
        </div>
    );
};

export default KosCard;