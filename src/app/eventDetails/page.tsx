"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import LocationMap from "../components/LocationMap/LocationMap";
import defaultLogo from "../assets/logo_blue.png";

// Interface do Evento (sem alterações)
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
  place?: {
    name: string;
    logo: string;
  };
}

const EventDetails = () => {
  const [eventData, setEventData] = useState<Event | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const router = useRouter();
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [mesas, setMesas] = useState("1 Mesa / 6 cadeiras");
  const [userId, setUserId] = useState<number | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(Number(storedUserId));
  
    const storedEventData = localStorage.getItem("selectedEvent");
    if (storedEventData) {
      setEventData(JSON.parse(storedEventData));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleSubmitReservation = async () => {
    // ... (lógica de envio da reserva - sem alterações)
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
      {/* Camada 1: Imagem de Fundo Fixa */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-3/4"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={`${API_URL}/uploads/events/${eventData.imagem_do_evento}`}
          alt={eventData.nome_do_evento}
          fill={true}
          className="object-cover opacity-60"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </motion.div>

      {/* Header com botões */}
      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
        <button onClick={() => router.back()} className="bg-white/20 p-3 rounded-full text-white backdrop-blur-sm">
          <FaArrowLeft />
        </button>
        <button className="bg-white/20 p-3 rounded-full text-white backdrop-blur-sm">
          <FaHeart />
        </button>
      </header>

      {/* Camada 2: Painel Deslizante de Conteúdo */}
      <motion.div
        className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl z-10"
        initial={{ y: "65%" }}
        animate={{ y: isPanelOpen ? "15%" : "65%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={(event, info) => {
            if(info.offset.y > 100) {
                setIsPanelOpen(false)
            } else if (info.offset.y < -100) {
                setIsPanelOpen(true)
            }
        }}
      >
        {/* ---- ALTERAÇÃO #1 (Opcional) ---- Adicionada a classe 'touch-none' */}
        <div className="w-full py-4 flex justify-center cursor-grab touch-none">
            <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Informações iniciais */}
        <div className="px-6 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">{eventData.nome_do_evento}</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 text-gray-600">
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /><span>{eventData.local_do_evento}</span></div>
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /><span>{new Date(eventData.data_do_evento).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</span></div>
            </div>
        </div>

        {/* Conteúdo completo (scrollable) */}
        {/* ---- ALTERAÇÃO #2 (Principal) ---- Adicionada a propriedade 'onPointerDown' */}
        <div 
            className="px-6 pb-32 h-[70vh] overflow-y-auto"
            onPointerDown={(e) => e.stopPropagation()}
        >
            <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">Sobre o Evento</h3>
            <p className="text-gray-600 mb-6">{eventData.descricao || "Nenhuma descrição disponível."}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 p-3 rounded-xl"><h4 className="text-sm text-gray-500">Brinde</h4><p className="font-semibold">{eventData.brinde}</p></div>
                <div className="bg-gray-100 p-3 rounded-xl"><h4 className="text-sm text-gray-500">Mesa</h4><p className="font-semibold">R$ {eventData.valor_da_mesa}</p></div>
                <div className="bg-gray-100 p-3 rounded-xl"><h4 className="text-sm text-gray-500">Entrada</h4><p className="font-semibold">R$ {eventData.valor_da_entrada}</p></div>
                <div className="bg-gray-100 p-3 rounded-xl"><h4 className="text-sm text-gray-500">Convidados</h4><p className="font-semibold">{eventData.numero_de_convidados}</p></div>
            </div>

            {eventData.imagem_do_combo && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Combo Especial</h3>
                <Image src={`${API_URL}/uploads/events/${eventData.imagem_do_combo}`} alt="Imagem do Combo" width={600} height={300} className="w-full h-auto object-cover rounded-xl" unoptimized />
              </div>
            )}
            
            <LocationMap address={eventData.local_do_evento} />
            
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Faça sua Reserva</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Quantidade de Pessoas</label>
                        <select className="p-3 rounded-lg border border-gray-300 bg-gray-50" value={quantidadePessoas} onChange={(e) => setQuantidadePessoas(Number(e.target.value))}>
                            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num}>{num} Pessoa{num > 1 ? "s" : ""}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Mesas</label>
                        <select className="p-3 rounded-lg border border-gray-300 bg-gray-50" value={mesas} onChange={(e) => setMesas(e.target.value)}>
                            {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={`${num} Mesa${num > 1 ? "s" : ""} / ${num * 6} cadeiras`}>
                                    {num} Mesa{num > 1 ? "s" : ""} / {num * 6} cadeiras
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleSubmitReservation} className="bg-green-600 text-white py-3 rounded-full text-center font-semibold mt-4 hover:bg-green-700 transition-colors">
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
      </motion.div>

       {/* Botão de Ação Condicional */}
       <AnimatePresence>
        {!isPanelOpen && (
            <motion.div
                className="absolute bottom-0 left-0 w-full p-4 z-20 bg-gradient-to-t from-white via-white to-transparent"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ ease: "easeInOut", duration: 0.4 }}
            >
                <button
                    onClick={() => setIsPanelOpen(true)}
                    className="w-full bg-blue-600 text-white py-4 rounded-full text-center font-bold text-lg shadow-lg hover:bg-blue-700 transition-colors"
                >
                    Ver Detalhes e Reservar
                </button>
            </motion.div>
        )}
       </AnimatePresence>

      {/* Modal de confirmação */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        // ... (props do modal - sem alterações)
      >
        <h2 className="text-xl font-bold mb-2">Falta Pouco!</h2>
        <p className="text-sm mb-4 text-gray-600">Sua reserva foi enviada para o estabelecimento e está aguardando confirmação.</p>
        <button onClick={handleFinalize} className="bg-blue-600 text-white py-2 px-8 rounded-full">
          Entendido
        </button>
      </Modal>
    </div>
  );
};

export default EventDetails;