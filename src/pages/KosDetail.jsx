import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

const DetailKos = () => {
    const { id } = useParams();
    const [kos, setKos] = useState(null);

    useEffect(() => {
        fetch(`https://kos-backend-production.up.railway.app/api/kos/${id}`)
            .then((res) => res.json())
            .then((data) => setKos(data))
            .catch((err) => console.error("Gagal fetch detail kos:", err))
    }, [id]);

    if (!kos) {
        return <div className="p-6 text-center text-gray-500">Memuat kos...</div>
    }

    const fotoList = Array.isArray(kos.foto_url)
        ? kos.foto_url
        : JSON.parse(kos.foto_url || "[]");

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                {kos.nama}
            </h1>

            <div className="bg-gray-100 rounded-xl p-6 shadow-md flex flex-col md:flex-row gap-6">
                {/* Foto utama */}
                <div className="flex-shrink-0">
                    <img
                        src={fotoList[0]}
                        alt="Foto Kos"
                        className="rounded-lg object-cover h-48 w-72 shadow-sm border border-gray-200"
                    />
                </div>

                {/* Informasi kos */}
                <div className="flex flex-col justify-between w-full text-left">
                    <div className="space-y-2 text-gray-800">
                        <p className="text-base">
                            <span className="font-semibold">Alamat:</span> {kos.alamat}
                        </p>

                        <p className="text-base">
                            <span className="font-semibold">Harga:</span>{" "}
                            <span className="text-orange-500 font-bold text-lg">
                                Rp {Number(kos.harga).toLocaleString("id-ID")}/bulan
                            </span>
                        </p>

                        <p className="text-base">
                            <span className="font-semibold">Fasilitas:</span>{" "}
                            {kos.fasilitas?.length > 0 ? kos.fasilitas.join(", ") : "-"}
                        </p>
                    </div>

                    <button className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 w-max">
                        Hubungi Pemilik Kos
                    </button>
                </div>
            </div>

            {/* Map Section */}
            {kos.latitude && kos.longitude && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-700 mb-2">Lokasi Kos</h2>
                    <MapContainer
                        center={[kos.latitude, kos.longitude]}
                        zoom={16}
                        style={{ height: "300px", width: "100%", borderRadius: "0.75rem" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker position={[kos.latitude, kos.longitude]}>
                            <Popup>{kos.nama}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </div>
    );
};

export default DetailKos;