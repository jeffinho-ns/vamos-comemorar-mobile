"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
  FaGift,
  FaTicketAlt,
  FaTag,
  FaChevronDown,
} from "react-icons/fa";
import LocationMap from "../components/LocationMap/LocationMap";

// Tipagem
interface Event {
  id: string;
  title: string;
  address: string;
  imagem_do_evento: string;
  hora_do_evento: string;
  categoria: string;
  valor_da_mesa: string;
  brinde: string;
  numero_de_convidados: string;
  valor_da_entrada: string;
  imagem_do_combo: string;
  observacao: string;
  nome_do_evento: string;
  casa_do_evento: string;
  local_do_evento: string;
  data_do_evento: string;
  descricao?: string;
  place?: { name: string; logo: string };
}

// Estilo do modal
const customModalStyles = {
  content: {
    top: "50%", left: "50%", right: "auto", bottom: "auto",
    marginRight: "-50%", transform: "translate(-50%, -50%)",
    border: "none", borderRadius: "16px", padding: "24px",
    maxWidth: "90vw", width: "400px", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1000,
  },
};

const EventDetails = () => {
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [mesas, setMesas] = useState("1 Mesa / 6 cadeiras");
  const [userId, setUserId] = useState<number | null>(null);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(Number(storedUserId));
    const storedEventData = localStorage.getItem("selectedEvent");
    if (storedEventData) {
      setEventData(JSON.parse(storedEventData));
    } else {
      router.push("/");
    }
  }, [router]);

  const handleSubmitReservation = async () => {
    if (!userId || !eventData) {
      alert("Não foi possível identificar o usuário ou o evento.");
      return;
    }
    const reservationData = {
      userId,
      eventId: eventData.id,
      peopleCount: quantidadePessoas,
      tables: mesas,
      status: "pending",
    };
    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });
      if (!response.ok) throw new Error("Erro ao enviar reserva.");
      setModalIsOpen(true);
    } catch (err) {
      alert("Ocorreu um erro ao tentar fazer sua reserva.");
    }
  };

  const handleFinalize = () => {
    setModalIsOpen(false);
    router.push("/");
  };

  if (!eventData) {
    return (
      <div className="bg-gray-900 w-full h-screen flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 h-screen w-full overflow-hidden">
      {/* Imagem de Fundo */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={`${API_URL}/uploads/events/${eventData.imagem_do_evento}`}
          alt={eventData.nome_do_evento}
          fill
          className="object-cover opacity-50"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </motion.div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-30">
        <button onClick={() => router.back()} className="bg-white/10 p-3 rounded-full text-white backdrop-blur-sm">
          <FaArrowLeft />
        </button>
        <button className="bg-white/10 p-3 rounded-full text-white backdrop-blur-sm">
          <FaHeart />
        </button>
      </header>

      {/* Painel inferior */}
      <motion.div
        className="absolute top-10 bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl z-20 flex flex-col"
        initial={{ y: "88%" }}
        animate={{ y: isPanelOpen ? "20%" : "88%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(event, info) => {
          if (info.offset.y > 100) setIsPanelOpen(false);
          else if (info.offset.y < -100) setIsPanelOpen(true);
        }}
      >
        <div className="w-full py-4 flex-shrink-0 flex justify-center cursor-grab" onPointerDown={() => setIsPanelOpen(!isPanelOpen)}>
          <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Título e botão recolher */}
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{eventData.nome_do_evento}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>{eventData.local_do_evento}</span>
              </div>
            </div>
            <AnimatePresence>
              {isPanelOpen && (
                <motion.button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-3 bg-gray-100 rounded-full text-gray-600"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <FaChevronDown />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Conteúdo */}
        <div ref={contentRef} className="px-6 pb-32 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">Sobre o Evento</h3>
          <p className="text-gray-600 mb-6 text-sm">{eventData.descricao || "Nenhuma descrição disponível."}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3">
              <FaClock className="text-blue-500 text-xl" />
              <div>
                <h4 className="text-xs text-gray-500">Horário</h4>
                <p className="font-semibold text-sm">{eventData.hora_do_evento}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3">
              <FaTicketAlt className="text-blue-500 text-xl" />
              <div>
                <h4 className="text-xs text-gray-500">Entrada</h4>
                <p className="font-semibold text-sm">R$ {eventData.valor_da_entrada}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3">
              <FaGift className="text-blue-500 text-xl" />
              <div>
                <h4 className="text-xs text-gray-500">Brinde</h4>
                <p className="font-semibold text-sm">{eventData.brinde}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3">
              <FaTag className="text-blue-500 text-xl" />
              <div>
                <h4 className="text-xs text-gray-500">Categoria</h4>
                <p className="font-semibold text-sm">{eventData.categoria}</p>
              </div>
            </div>
          </div>

          {eventData.imagem_do_combo && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Combo Especial</h3>
              <Image
                src={`${API_URL}/uploads/events/${eventData.imagem_do_combo}`}
                alt="Combo"
                width={600}
                height={300}
                className="w-full h-auto object-cover rounded-xl shadow-md"
                unoptimized
              />
            </div>
          )}

          <LocationMap address={eventData.local_do_evento} />

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Faça sua Reserva</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Quantidade de Pessoas</label>
                <select
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50"
                  value={quantidadePessoas}
                  onChange={(e) => setQuantidadePessoas(Number(e.target.value))}
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} Pessoa{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Mesas</label>
                <select
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50"
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

              <button
                onClick={handleSubmitReservation}
                className="bg-green-600 text-white py-3 rounded-full text-center font-semibold mt-4 hover:bg-green-700 transition-colors"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Botão inferior */}
      <AnimatePresence>
        {!isPanelOpen && (
          <motion.div
            className="absolute bottom-0 left-0 w-full p-4 z-30"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
          >
            <button
              onClick={() => setIsPanelOpen(true)}
              className="w-full bg-blue-600 text-white py-4 rounded-full text-center font-bold text-lg shadow-lg hover:bg-blue-700"
            >
              Ver Detalhes e Reservar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmação */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customModalStyles} contentLabel="Confirmação de Reserva" ariaHideApp={false}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Falta Pouco!</h2>
          <p className="text-md mb-6 text-gray-600">Sua reserva foi enviada e está aguardando confirmação.</p>
          <button onClick={handleFinalize} className="w-full bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700">
            Entendido
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetails;
