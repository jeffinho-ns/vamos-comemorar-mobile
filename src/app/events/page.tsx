"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import Header from "../components/headerlike/headerlike";
import Footer from "../components/footer/footer";
import Avatar1 from "../assets/avatar/001.jpg";
import Avatar2 from "../assets/avatar/002.jpg";
import Avatar3 from "../assets/avatar/003.jpeg";
import Avatar4 from "../assets/avatar/004.jpg";

interface Event {
  id: string;
  title: string;
  address: string;
  imagem_do_evento: string;
  nome_do_evento: string;
  casa_do_evento: string;
  local_do_evento: string;
  data_do_evento: string;
  place: {
    name: string;
    logo: string;
  };
}

export default function AllEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  const fetchEvents = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [API_URL]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };
    return date.toLocaleDateString('pt-BR', options);
  };

  const getEventPagePath = (place: string, id: string) => {
    switch (place) {
      case "Justino": return `/justino/eventDetails`;
      case "Pracinha": return `/pracinha/eventDetails`;
      case "Oh Freguês": return `/ohfregues/eventDetails`;
      case "Highline": return `/highline/eventDetails`;
      default: return `/eventDetails`;
    }
  };

  return (
    <>
      <Header />
      <div className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] min-h-screen px-4 py-10">
        <h1 className="text-white text-3xl font-bold mb-6 text-center">Todos os Eventos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {events.map((event) => (
            <Link key={event.id} href={getEventPagePath(event.casa_do_evento, event.id)}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden relative transition-all duration-300"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={`${API_URL}/uploads/events/${event.imagem_do_evento}`}
                    alt={event.nome_do_evento}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-red-500">
                    {formatDate(event.data_do_evento)}
                  </div>
                  <div className="absolute top-3 right-3 bg-white p-2 rounded-full">
                    <FaHeart className="text-red-500" />
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-bold text-gray-800">{event.nome_do_evento}</h2>
                  <p className="text-sm text-gray-500">{event.local_do_evento}</p>
                  <div className="flex items-center mt-3">
                    <div className="flex -space-x-2">
                      <Image src={Avatar1} alt="A1" className="h-8 w-8 rounded-full ring-2 ring-white" />
                      <Image src={Avatar2} alt="A2" className="h-8 w-8 rounded-full ring-2 ring-white" />
                      <Image src={Avatar3} alt="A3" className="h-8 w-8 rounded-full ring-2 ring-white" />
                      <Image src={Avatar4} alt="A4" className="h-8 w-8 rounded-full ring-2 ring-white" />
                    </div>
                    <p className="text-sm text-gray-400 ml-3">+20 Seguindo</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}