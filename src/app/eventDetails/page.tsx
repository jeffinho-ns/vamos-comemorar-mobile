"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeaderLike from "../components/headerlike/headerlike";
import Footer from "../components/footer/footer";
import defaultLogo from "../assets/logo_blue.png";

import DateIcon from "../assets/Date.png";
import LocIcon from "../assets/Location.png";

const EventDetails = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [logoSrc, setLogoSrc] = useState(defaultLogo.src);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  useEffect(() => {
    const storedEventData = localStorage.getItem("selectedEvent");
    const storedLogo = localStorage.getItem("lastPageLogo");

    if (storedEventData) {
      setEventData(JSON.parse(storedEventData));
    }
    if (storedLogo) {
      setLogoSrc(storedLogo);
    }
  }, []);

  if (!eventData) return <div className="p-4 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderLike />
      
      {/* Banner do evento */}
      <div className="relative w-full h-60 md:h-80">
        <Image
          src={`${API_URL}/uploads/events/${eventData.imagem_do_evento}`}
          alt="Banner"
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Conteúdo principal */}
      <div className="-mt-6 bg-white rounded-t-3xl p-4 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Detalhes do Evento</h1>
          <Image src={logoSrc} alt="Logo" width={40} height={40} />
        </div>

        <div className="p-4 rounded-lg">
          <p className="text-2xl font-bold text-center text-gray-800">{eventData.nome_do_evento}</p>

          {/* Data e hora */}
          <div className="flex items-start gap-2 mt-4 text-gray-700">
            <Image src={DateIcon} alt="Data" width={40} height={40} />
            <div className="flex flex-col">
              <span className="text-[22px] font-bold leading-tight">
                {new Date(eventData.data_do_evento).toLocaleDateString()}
              </span>
              <span className="text-sm mt-1">{eventData.hora_do_evento}</span>
            </div>
          </div>

          {/* Local */}
          <div className="flex items-start gap-2 text-gray-700 mt-4">
            <Image src={LocIcon} alt="Localização" width={40} height={40} />
            <div className="flex flex-col">
              <span className="text-[22px] font-bold leading-tight">{eventData.casa_do_evento}</span>
              <span className="text-sm mt-1">{eventData.local_do_evento}</span>
            </div>
          </div>

          {/* Combo (caso exista) */}
          {eventData.imagem_do_combo && (
            <div className="mt-6 flex flex-col items-center">
              <div className="w-40 h-40 rounded-lg overflow-hidden">
                <Image
                  src={`${API_URL}/uploads/events/${eventData.imagem_do_combo}`}
                  alt="Combo"
                  width={160}
                  height={160}
                  objectFit="cover"
                />
              </div>
              <p className="text-xs text-center text-gray-600 mt-2">
                {eventData.observacao || "Sem observação."}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetails;
