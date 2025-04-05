'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/headernotification/headernotification';
import Footer from '../components/footer/footer';
import defaultBanner from '../assets/banner01.webp';

interface Reserva {
  id: number;
  casa_do_evento: string;
  data_do_evento: string;
  imagem_do_evento: string;
  status: string;
  user_id: number;
}

export default function MyReservations() {
  const [bannerSrc, setBannerSrc] = useState(defaultBanner.src);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;
  const router = useRouter();

  useEffect(() => {
    const storedBanner = localStorage.getItem('lastPageBanner');
    if (storedBanner) {
      setBannerSrc(storedBanner);
    }

    const fetchReservas = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reservas`);
        if (response.ok) {
          const data = await response.json();
          const userId = localStorage.getItem('userId');

          const reservasDoUsuario = data
            .filter((reserva: Reserva) => reserva.user_id === Number(userId))
            .map((reserva: Reserva) => ({
              ...reserva,
              imagem_do_evento: reserva.imagem_do_evento
                ? `${API_URL}/uploads/events/${reserva.imagem_do_evento}`
                : bannerSrc,
            }));

          setReservas(reservasDoUsuario);
        } else {
          console.error('Erro ao buscar reservas:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
      }
    };

    fetchReservas();
  }, [API_URL, bannerSrc]);

  const handleReservaClick = (reserva: Reserva) => {
    if (reserva.status === 'Aprovado') {
      router.push(`/confirmation?id=${reserva.id}`);
    }
  };

  return (
    <>
      <Header />

      <div className="px-4 pt-20 pb-10 bg-white min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Reservas</h2>

        <div className="flex flex-col gap-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              onClick={() => handleReservaClick(reserva)}
              className={`flex items-center p-4 rounded-xl shadow-sm cursor-${
                reserva.status === 'Aprovado' ? 'pointer' : 'default'
              } hover:bg-gray-50 transition`}
            >
              <div className="mr-4">
                <Image
                  src={reserva.imagem_do_evento}
                  alt="Banner do Evento"
                  width={150}
                  height={100}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">
                  {reserva.casa_do_evento}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Data: {reserva.data_do_evento}
                </p>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full w-fit ${
                    reserva.status === 'Aprovado'
                      ? 'bg-green-100 text-green-600'
                      : reserva.status === 'Cancelado'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {reserva.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/">
            <span className="bg-emerald-700 hover:bg-emerald-900 text-white px-6 py-3 rounded-lg text-base font-medium cursor-pointer">
              Novas Reservas
            </span>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
