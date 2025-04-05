"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import HeaderNotification from "../components/headernotification/headernotification";
import Footer from "../components/footer/footer";

interface Reserva {
  id: number;
  casa_do_evento: string;
  data_do_evento: string;
  imagem_do_evento: string;
  nome_do_evento: string;
  status: string;
  user_id: number;
  quantidade_pessoas: number;
  qrcode: string | null;
}

function ReservationDetails() {
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  const searchParams = useSearchParams();
  const reservaId = searchParams.get("id");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!reservaId || !userId) {
      setIsLoading(false);
      return;
    }

    const fetchReserva = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reservas/${reservaId}`);
        if (!res.ok) throw new Error("Erro ao buscar reserva");
        const data: Reserva = await res.json();

        if (data.user_id === Number(userId)) {
          setReserva({
            ...data,
            imagem_do_evento: data.imagem_do_evento
              ? `${API_URL}/uploads/events/${data.imagem_do_evento}`
              : "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReserva();
  }, [reservaId]);

  const handleQRCodeClick = (qrcode: string) => {
    setCurrentQRCode(qrcode);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setCurrentQRCode(null);
  };

  return (
    <>
      <HeaderNotification />

      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Detalhes da Reserva
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-500 text-lg">Carregando...</p>
        ) : reserva ? (
          <div className="bg-white rounded-xl shadow-xl p-6 text-center space-y-4">
            {reserva.imagem_do_evento ? (
              <Image
                src={reserva.imagem_do_evento}
                alt="Imagem do Evento"
                width={120}
                height={120}
                className="rounded-full mx-auto"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto">
                <span className="text-sm text-gray-600">Sem Imagem</span>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800">
              {reserva.nome_do_evento}
            </h2>

            <p className="text-gray-600">
              <strong>Casa:</strong> {reserva.casa_do_evento}
            </p>

            <p className="text-gray-600">
              <strong>Data:</strong>{" "}
              {new Date(reserva.data_do_evento).toLocaleDateString()}
            </p>

            <p className="text-gray-600">
              <strong>Pessoas:</strong> {reserva.quantidade_pessoas}
            </p>

            {reserva.qrcode ? (
              <div
                className="mt-4 cursor-pointer inline-block transition hover:scale-105"
                onClick={() => handleQRCodeClick(reserva.qrcode!)}
              >
                <h4 className="font-medium text-gray-700 mb-2">
                  QR Code da Reserva
                </h4>
                <Image
                  src={reserva.qrcode}
                  alt="QR Code"
                  width={180}
                  height={180}
                  className="rounded-xl shadow-md mx-auto"
                />
              </div>
            ) : (
              <p className="text-gray-500">QR Code não disponível.</p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Não foi possível carregar os dados da reserva.
          </p>
        )}
      </div>

      {showPopup && currentQRCode && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClosePopup}
        >
          <div
            className="relative bg-white p-6 rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 bg-gray-200 text-gray-600 rounded-full p-1 hover:bg-red-500 hover:text-white"
              onClick={handleClosePopup}
            >
              ✕
            </button>
            <Image
              src={currentQRCode}
              alt="QR Code Ampliado"
              width={300}
              height={300}
              className="rounded-xl shadow"
            />
            <p className="text-center text-gray-700 mt-4">
              Apresente este QR Code na entrada do evento.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function Confirmation() {
  return (
    <Suspense fallback={<div className="text-center py-12">Carregando...</div>}>
      <ReservationDetails />
    </Suspense>
  );
}
