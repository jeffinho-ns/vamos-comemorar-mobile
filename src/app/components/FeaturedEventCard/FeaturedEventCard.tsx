"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

import { Event } from "../../types/index";

import Avatar1 from "../../assets/avatar/001.jpg";
import Avatar2 from "../../assets/avatar/002.jpg";
import Avatar3 from "../../assets/avatar/003.jpeg";
import Avatar4 from "../../assets/avatar/004.jpg";

interface FeaturedEventCardProps {
  event: Event;
  apiUrl: string;
}

const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event, apiUrl }) => {
  const getEventPagePath = (place: string) => {
    switch (place) {
      case "Justino": return `/justino/eventDetails`;
      case "Pracinha": return `/pracinha/eventDetails`;
      case "Oh Freguês": return `/ohfregues/eventDetails`;
      case "Highline": return `/highline/eventDetails`;
      default: return `/eventDetails`;
    }
  };

  const handleClick = () => {
    localStorage.setItem("selectedEvent", JSON.stringify(event));
  };

  const formatCardDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short' };
    const month = date.toLocaleDateString('pt-BR', options).replace('.', '').toUpperCase();
    const day = date.getDate().toString().padStart(2, '0');
    return { month, day };
  };

  const { month, day } = formatCardDate(event.data_do_evento);

  return (
    <Link href={getEventPagePath(event.casa_do_evento)} onClick={handleClick} className="block w-full">
      <motion.div
        className="relative w-full overflow-hidden rounded-2xl shadow-lg"
        style={{ height: '400px' }}
        whileHover={{ y: -5, boxShadow: "0px 15px 30px -5px rgba(0,0,0,0.3)" }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={`${apiUrl}/uploads/events/${event.imagem_do_evento}`}
          alt={event.nome_do_evento}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="text-2xl font-bold tracking-tight">{event.casa_do_evento}</h2>
          <div className="flex items-center gap-1 text-sm text-gray-200 mt-1">
            <MdLocationOn />
            <span>{event.local_do_evento}</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex -space-x-3 overflow-hidden">
              <Image className="inline-block h-9 w-9 rounded-full ring-2 ring-white" src={Avatar1} alt="User 1" />
              <Image className="inline-block h-9 w-9 rounded-full ring-2 ring-white" src={Avatar2} alt="User 2" />
              <Image className="inline-block h-9 w-9 rounded-full ring-2 ring-white" src={Avatar3} alt="User 3" />
              <Image className="inline-block h-9 w-9 rounded-full ring-2 ring-white" src={Avatar4} alt="User 4" />
            </div>
            <p className="text-sm text-gray-200 ml-3">+20 pessoas seguindo</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-lg p-2 text-center text-white shadow-lg">
          <span className="text-xs font-bold">{month}</span>
          <span className="text-2xl font-extrabold block">{day}</span>
        </div>
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white shadow-lg">
          <FaHeart className="text-xl" />
        </div>
      </motion.div>
    </Link>
  );
};

export default FeaturedEventCard;