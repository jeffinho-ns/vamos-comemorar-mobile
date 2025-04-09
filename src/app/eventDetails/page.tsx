"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderLike from "../components/headerlike/headerlike";
import Footer from "../components/footer/footer";
import defaultLogo from "../assets/logo_blue.png";
import DateIcon from "../assets/Date.png";
import LocIcon from "../assets/Location.png";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";


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
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  const [showReserva, setShowReserva] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [mesas, setMesas] = useState("1 Mesa / 6 cadeiras");
  const [userId, setUserId] = useState<number | null>(null);
  const [comboImage, setComboImage] = useState<string | null>(null);
  const [observacao, setObservacao] = useState<string>("");
  const [logoSrc, setLogoSrc] = useState(defaultLogo.src);

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
    <>
      <HeaderLike />
      <main className="container-mobile p-4 max-w-md mx-auto text-gray-800">
        {/* Imagem do Evento */}
        <div className="w-full h-[250px] relative rounded-2xl overflow-hidden shadow-md mb-6">
          <Image
            src={`${API_URL}/uploads/events/${eventData.imagem_do_evento}`}
            alt={eventData.nome_do_evento}
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
            unoptimized
          />
        </div>

        {/* Título e Info Principal */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl font-bold">{eventData.nome_do_evento}</h1>
          <p className="text-sm text-gray-500">{eventData.casa_do_evento}</p>
          <p className="text-sm text-gray-500">{eventData.hora_do_evento}</p>
        </div>

        {/* Data e Local */}
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
          <Image src={DateIcon} alt="Data" width={24} height={24} />
          <span>
            {new Date(eventData.data_do_evento).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-700 mb-6">
          <Image src={LocIcon} alt="Local" width={24} height={24} />
          <span>{eventData.local_do_evento}</span>
        </div>

        {/* Descrição */}
        {eventData.descricao && (
          <div className="bg-gray-100 p-4 rounded-xl mb-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-gray-700 mb-1">{eventData.descricao}</p>
            <p className="text-sm text-blue-600 italic">{eventData.categoria}</p>
          </div>
        )}

        {/* Info de Valores e Brindes */}
        <div className="grid grid-cols-1 gap-4 mb-6">
         {/* Info de Valores e Brindes */}
         <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm text-gray-500">Brinde</h3>
            <p className="font-medium">{eventData.brinde}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm text-gray-500">Valor da Mesa</h3>
            <p className="font-medium">R$ {eventData.valor_da_mesa}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm text-gray-500">Valor da Entrada</h3>
            <p className="font-medium">R$ {eventData.valor_da_entrada}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm text-gray-500">Nº de Convidados</h3>
            <p className="font-medium">{eventData.numero_de_convidados}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm text-gray-500">Observações</h3>
            <p className="font-medium">{eventData.observacao}</p>
          </div>
        </div>
        </div>

        {/* Imagem do Combo */}
        {eventData.imagem_do_combo && (
          <div className="rounded-xl overflow-hidden shadow-md mb-6">
            <Image
              src={`${API_URL}/uploads/events/${eventData.imagem_do_combo}`}
              alt="Imagem do Combo"
              width={600}
              height={300}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Botão de Reserva */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowReserva(!showReserva);
          }}
          className="flex items-center bg-[#5D56F3]/80 text-white px-4 py-2 ml-4 rounded-full backdrop-blur-sm hover:bg-blue-600/90 transition duration-300"
        >
          Fazer Reserva
        </button>

        {/* Reserva Modal */}
        <AnimatePresence>
          {showReserva && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-t-3xl shadow-xl p-4 max-h-[85vh] overflow-y-auto w-full fixed bottom-0 left-0 right-0 z-40"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Pessoas</label>
                  <select
                    className="p-2 rounded border"
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
                  <label className="text-sm">Mesas</label>
                  <select
                    className="p-2 rounded border"
                    value={mesas}
                    onChange={(e) => setMesas(e.target.value)}
                  >
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
                      <option
                        key={num}
                        value={`${num} Mesa${num > 1 ? "s" : ""} / ${num * 6} cadeiras`}
                      >
                        {num} Mesa{num > 1 ? "s" : ""} / {num * 6} cadeiras
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSubmitReservation}
                  className="bg-[#08738a] text-white py-3 rounded-full text-center text-sm font-semibold mt-4"
                >
                  Confirmar Reserva
                </button>
              </div>

              {/* Modal de confirmação */}
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Confirmação de Reserva"
                className="bg-white p-6 rounded-lg max-w-sm mx-auto mt-32 shadow-lg text-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Organização */}
        <div className="flex items-center mt-6">
          <span className="text-sm text-gray-500 mr-2">Organizado por:</span>
          <Image
            src={
              eventData.place?.logo
                ? `${API_URL}/uploads/${eventData.place.logo}`
                : defaultLogo.src
            }
            alt="Logo da casa"
            width={40}
            height={40}
            className="rounded-full border"
            unoptimized
          />
          <span className="ml-2 font-medium">
            {eventData.place?.name || "Casa não identificada"}
          </span>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventDetails;
