"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import HeaderLike from "../components/headerlike/headerlike";
 import defaultLogo from "../../app/assets/logo-agilizai-h.png";
 
import Modal from "react-modal";
import { useRouter } from 'next/navigation';

import DateIcon from "../assets/Date.png";
import LocIcon from "../assets/Location.png";



const Reservas = () => {
  const [eventData, setEventData] = useState<any>(null);
  const [logoSrc, setLogoSrc] = useState(defaultLogo.src);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [mesas, setMesas] = useState("1 Mesa / 6 cadeiras");
  const [userId, setUserId] = useState<number | null>(null);
  const [comboImage, setComboImage] = useState<string | null>(null);
  const [observacao, setObservacao] = useState<string>("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;
  const router = useRouter();



  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && !isNaN(Number(storedUserId))) {
      setUserId(Number(storedUserId));
    }
  
    const storedEventData = localStorage.getItem("selectedEvent");
    if (storedEventData) {
      setEventData(JSON.parse(storedEventData));
    }
  
    const storedLogo = localStorage.getItem("lastPageLogo");
    if (storedLogo) {
      setLogoSrc(storedLogo);
    }
  }, [API_URL]); // Remova eventData daqui

  useEffect(() => {
    if (eventData) {
      setComboImage(eventData.imagem_do_combo);
      setObservacao(eventData.observacao || "Sem observação.");
    }
  }, [eventData]);

  const handleSubmitReservation = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (!eventData) {
      alert("Dados do evento estão ausentes.");
      return;
    }
    const reservationData = {
      userId,
      eventId: eventData.id,
      quantidade_pessoas: quantidadePessoas,
      mesas,
      data_da_reserva: new Date().toISOString().split("T")[0],
      casa_da_reserva: eventData.casa_do_evento,
    };
    try {
      const response = await fetch(`${API_URL}/api/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });
      if (response.ok) {
        setModalIsOpen(true);
      } else {
        alert("Erro ao criar a reserva.");
      }
    } catch (error) {
      console.error("Erro ao enviar reserva:", error);
      alert("Erro ao criar a reserva.");
    }
  };

  const handleFinalize = () => {
    setModalIsOpen(false);
    router.push("/");
  };

  if (!eventData) return <div className="p-4 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HeaderLike />
      <div className="relative w-full h-60 md:h-80">
        <Image
          src={`${API_URL}/uploads/events/${eventData.imagem_do_evento}`}
          alt="Banner"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="-mt-6 bg-white rounded-t-3xl p-4 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Nova Reserva</h1>
          <Image src={logoSrc} alt="Logo" width={40} height={40} />
        </div>
        <p className="text-sm text-gray-500">
          Agora falta pouco para garantir a sua reserva! Basta preencher os campos abaixo.
        </p>

        <div className=" p-4 rounded-lg">
        <p className="text-lg font-semibold text-center">{eventData.nome_do_evento}</p>

  <div className="flex flex-col text-gray-500 mt-2">

    <div className="flex items-start gap-2">
      <Image src={DateIcon} alt="Data" width={40} height={40} />
      <div className="flex flex-col">
        <span className="text-[22px] font-bold leading-tight">
          {new Date(eventData.data_do_evento).toLocaleDateString()}
        </span>
        <span className="text-sm mt-1">{eventData.hora_do_evento}</span>
      </div>
    </div>
  </div>

    <div className="flex items-start gap-2 text-gray-700 font-medium mt-4">
      <Image src={LocIcon} alt="Localização" width={40} height={40} />
      <div className="flex flex-col">
        <span className="text-[22px] font-bold leading-tight">
          {eventData.casa_do_evento}
        </span>
       <span className="text-sm mt-1">{eventData.local_do_evento}</span>
       </div>
      </div>
    </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">Pessoas</label>
          <select
            className="p-2 rounded"
            value={quantidadePessoas}
            onChange={(e) => setQuantidadePessoas(Number(e.target.value))}
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>{num} Pessoa{num > 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm">Mesas</label>
          <select
            className="p-2 rounded"
            value={mesas}
            onChange={(e) => setMesas(e.target.value)}
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={`${num} Mesa${num > 1 ? "s" : ""} / ${num * 6} cadeiras`}>
                {num} Mesa{num > 1 ? "s" : ""} / {num * 6} cadeiras
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-700">
          <p><strong>Data:</strong> {new Date(eventData.data_do_evento).toLocaleDateString()}</p>
          <p><strong>Evento:</strong> {eventData.nome_do_evento}</p>
        </div>
        {comboImage && (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-lg overflow-hidden">
              <Image
                src={`${API_URL}/uploads/events/${comboImage}`}
                alt="Combo"
                width={160}
                height={160}
                objectFit="cover"
              />
            </div>
            <p className="text-xs text-center text-gray-600 mt-2">{observacao}</p>
          </div>
        )}
        <button
          onClick={handleSubmitReservation}
          className="bg-[#08738a] text-white py-3 rounded-full text-center text-sm font-semibold"
        >
          Confirmar Reserva
        </button>
      </div>
 
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirmação de Reserva"
        className="bg-white p-6 rounded-lg max-w-sm mx-auto mt-32 shadow-lg text-center"
        overlayClassName="fixed inset-0 z-10 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-2">Falta Pouco!</h2>
        <p className="text-sm mb-4">Sua reserva está sendo processada!</p>
        <button
          onClick={handleFinalize}
          className="bg-[#08738a] text-white py-2 px-6 rounded-full"
        >
          Finalizar
        </button>
      </Modal>
    </div>
  );
};

export default Reservas;
