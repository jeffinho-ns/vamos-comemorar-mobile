"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: -23.55052,
  lng: -46.633308,
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

export default function MapPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [events, setEvents] = useState<any[]>([]);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleCenterLocation = () => {
    if (navigator.geolocation && mapRef) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Erro ao buscar localização:", error);
        }
      );
    }
  };

  const handleCardClick = (lat: number, lng: number) => {
    const newCenter = { lat, lng };
    setCenter(newCenter); // Atualiza o estado do centro
    if (mapRef) {
      mapRef.panTo(newCenter);
      mapRef.setZoom(16);
    }
  };
  

  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <div className="relative w-full h-screen">
      {/* Campo de busca + botão localização */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar eventos..."
          className="flex-1 p-3 rounded-2xl shadow-md bg-white text-sm placeholder-gray-500 focus:outline-none"
        />
        <button
          onClick={handleCenterLocation}
          className="p-3 bg-white rounded-full shadow-md"
        >
          <Image src="/gps-icon.svg" alt="Localizar" width={20} height={20} />
        </button>
      </div>

      {/* Logo central no topo */}
      {/* <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <Image src="/logo.svg" alt="Logo" width={140} height={40} />
      </div> */}

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={(map) => setMapRef(map)}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            position={{ lat: event.latitude, lng: event.longitude }}
            icon={{
              url: "/pin.svg",
              scaledSize: new google.maps.Size(40, 40),
            }}
          />
        ))}
      </GoogleMap>

      {/* Lista de eventos animada */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4">
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
  <button
    onClick={() => setShowEvents(!showEvents)}
    className="flex items-center justify-center gap-2 bg-white text-gray-800 text-base font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <Image src="/calendar-icon.svg" alt="Eventos" width={20} height={20} />
    <span>Eventos</span>
  </button>
</div>

        <AnimatePresence>
          {showEvents && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-t-3xl shadow-xl p-4 max-h-[45vh] overflow-y-auto"
            >
              <div className="flex gap-4 overflow-x-auto scrollbar-hide px-1">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    onClick={() => handleCardClick(event.latitude, event.longitude)}
                    className="relative bg-white rounded-lg shadow-md overflow-hidden min-w-[260px] cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="relative w-full h-[180px]">
                      <Image
                        src={`${API_URL}/uploads/events/${event.imagem_do_evento}`}
                        alt={event.nome_do_evento}
                        layout="fill"
                        objectFit="cover"
                        className="absolute inset-0 w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-md font-bold truncate mb-1">{event.casa_do_evento}</h2>
                      <p className="text-sm text-gray-400 mb-1">{event.local_do_evento}</p>
                    </div>
                    <div className="absolute top-2 left-2 bg-white rounded-full px-3 py-1 shadow text-xs font-semibold text-red-500">
                      {formatDate(event.data_do_evento)}
                    </div>
                    <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                      <FaHeart className="text-red-500 text-lg" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}