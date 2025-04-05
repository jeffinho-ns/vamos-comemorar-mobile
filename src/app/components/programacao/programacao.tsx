"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MdAccessTime } from "react-icons/md";
import Link from "next/link";

interface EventData {
  id: number;
  nome_do_evento: string;
  data_do_evento: string;
  hora_do_evento: string;
  valor_da_entrada: string;
  imagem_do_evento: string;
}

const Programacao = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/events`);
        const data = await response.json();
        setEvents(data.slice(0, 9));
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL]);

  const handleEventClick = (event: EventData) => {
    localStorage.setItem("selectedEvent", JSON.stringify(event));
  };

  return (
    <div className="px-4 py-6 bg-white">
      <h2 className="text-center mb-4 text-xl font-semibold font-poppins text-slate-800">
        Programação da semana
      </h2>
      <div className="flex flex-col gap-5">
        {loading ? (
          [...Array(9)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 max-w-md w-full p-4 bg-gray-100 rounded-lg animate-pulse"
            >
              <div className="h-44 bg-gray-300 rounded" />
              <div className="flex flex-col gap-2">
                <div className="h-6 w-3/4 bg-gray-400 rounded" />
                <div className="h-4 w-1/2 bg-gray-400 rounded" />
                <div className="h-4 w-1/4 bg-gray-400 rounded" />
              </div>
            </div>
          ))
        ) : (
          events.map((event) => (
            <Link key={event.id} href="/reservas">
              <div onClick={() => handleEventClick(event)}>
                <EventCard
                  img={`${API_URL}/uploads/events/${event.imagem_do_evento}`}
                  title={event.nome_do_evento}
                  date={new Date(event.data_do_evento).toLocaleDateString("pt-BR")}
                  time={event.hora_do_evento}
                  price={`R$${event.valor_da_entrada}`}
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

const EventCard = ({
  img,
  title,
  date,
  time,
  price,
}: {
  img: string;
  title: string;
  date: string;
  time: string;
  price: string;
}) => (
  <div className="flex bg-white rounded-md shadow-sm hover:shadow-md p-3 transition-all">
    <div className="flex flex-col items-center mr-4">
      <div className="w-3 h-3 bg-cyan-700 rounded-full mb-2" />
      <div className="w-px bg-gray-300 flex-grow" />
      <p className="text-xs text-gray-500 mt-2 text-center">{date}</p>
    </div>
    <div className="flex flex-col flex-grow">
      <Image
        src={img}
        alt={title}
        width={500}
        height={300}
        unoptimized
        className="w-full h-44 object-cover rounded"
      />
      <div className="mt-3">
        <h3 className="text-base font-medium text-cyan-700 font-poppins">{title}</h3>
        <div className="flex items-center text-sm text-gray-600 mt-1">
          <MdAccessTime className="mr-1 text-cyan-700" />
          <p>{time}</p>
        </div>
        <p className="text-sm text-gray-800 mt-1">{price}</p>
      </div>
    </div>
  </div>
);

export default Programacao;