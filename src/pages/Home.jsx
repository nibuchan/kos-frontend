import { useEffect, useState } from "react";
import KosCard from "../components/KosCard";

const Home = () => {
    const [dataKos, setDataKos] = useState([])

    useEffect(() => {
        fetch("kos-backend-production.up.railway.app/api/kos")
        .then(res => res.json())
        .then(data => setDataKos(data))
        .catch(err => console.error("Gagal fetch kos:", err));
    }, []);

    return (
        <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataKos.map(kos => (
                    <KosCard key={kos.id} kos={kos} />
                ))}
            </div>
        </div>
    );
};

export default Home;