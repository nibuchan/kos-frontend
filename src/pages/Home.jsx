import { useEffect, useState } from "react";
import KosCard from "../components/KosCard";
import Hero from "../components/Hero";

const Home = () => {
    const [dataKos, setDataKos] = useState([])

    useEffect(() => {
        fetch("https://kos-backend-production.up.railway.app/api/kos")
        .then(res => res.json())
        .then(data => setDataKos(data))
        .catch(err => console.error("Gagal fetch kos:", err));
    }, []);

    return (
        <div className="p-6">
            <Hero />
            <div className="grid mt-40 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataKos.map(kos => (
                    <KosCard key={kos.id} kos={kos} />
                ))}
            </div>
        </div>
    );
};

export default Home;