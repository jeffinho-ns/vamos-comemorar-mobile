// components/PlaceReservationModal/PlaceReservationModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
// O CSS do DatePicker deve ser importado globalmente no seu globals.css
// @import 'react-datepicker/dist/react-datepicker.css';


interface PlaceReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  casaDoEvento: string; // Prop para receber o nome da casa
  API_URL: string; // Prop para receber a URL da API
}

const PlaceReservationModal: React.FC<PlaceReservationModalProps> = ({
  isOpen,
  onClose,
  casaDoEvento,
  API_URL,
}) => {
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [mesas, setMesas] = useState("1 Mesa / 6 cadeiras");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [reservationConfirmationModalIsOpen, setReservationConfirmationModalIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && !isNaN(Number(storedUserId))) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const handleSubmitReservation = async () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (!selectedDate) {
      alert("Por favor, selecione uma data para a reserva.");
      return;
    }

    const reservationData = {
      userId,
      quantidade_pessoas: quantidadePessoas,
      mesas,
      data_da_reserva: selectedDate.toISOString().split("T")[0],
      casa_da_reserva: casaDoEvento, // Enviando o nome da casa recebido via prop
    };

    try {
      // Chamando o novo endpoint genérico: /api/reservas/place-reservation
      const response = await fetch(`${API_URL}/api/reservas/place-reservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        setReservationConfirmationModalIsOpen(true);
        onClose(); // Fecha o modal de reserva principal
      } else {
        const errorData = await response.json();
        alert(`Erro ao criar a reserva: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao enviar reserva:", error);
      alert("Erro ao criar a reserva. Verifique sua conexão.");
    }
  };

  const handleFinalize = () => {
    setReservationConfirmationModalIsOpen(false);
    // router.push("/"); // Opcional: Redirecionar após finalizar
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-t-3xl shadow-xl p-4 max-h-[85vh] overflow-y-auto w-full fixed bottom-0 left-0 right-0 z-40"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center mb-4">Fazer Reserva para {casaDoEvento}</h2>

            {/* Campo de seleção de data */}
            <div className="flex flex-col gap-2">
              <label className="text-sm">Data da Reserva</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="p-2 rounded border w-full"
                minDate={new Date()}
                placeholderText="Selecione uma data"
              />
            </div>

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
              className="bg-black text-white py-3 rounded-full text-center text-sm font-semibold mt-4"
            >
              Confirmar Reserva
            </button>

            {/* Botão para fechar o modal de reserva */}
            <button
                onClick={onClose}
                className="text-gray-600 mt-2 text-sm underline"
            >
                Cancelar
            </button>
          </div>

          {/* Modal de confirmação */}
          <Modal
            isOpen={reservationConfirmationModalIsOpen}
            onRequestClose={() => setReservationConfirmationModalIsOpen(false)}
            contentLabel="Confirmação de Reserva"
            className="bg-white p-6 rounded-lg max-w-sm mx-auto mt-32 shadow-lg text-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          >
            <h2 className="text-xl font-bold mb-2">Falta Pouco!</h2>
            <p className="text-sm mb-4">Sua reserva está sendo processada!</p>
            <button
              onClick={handleFinalize}
              className="bg-black text-white py-2 px-6 rounded-full"
            >
              Finalizar
            </button>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaceReservationModal;