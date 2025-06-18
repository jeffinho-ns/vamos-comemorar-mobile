"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MdSearch, MdFilterList, MdLocationOn } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

// COMPONENTES E TIPAGENS IMPORTADOS
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Intro from "./components/intro/intro";
import EventFilter from "./components/filter/filter";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import FeaturedEventCard from "./components/FeaturedEventCard/FeaturedEventCard";
import { Event } from "./types/index";

// ASSETS
import Promo from "./assets/indique.png";
import imgBanner from "./assets/retangulo-1.png";
import logoWhite from "./assets/logo_blue.png";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasFetched = useRef(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL || '';

  useEffect(() => {
    const introWasShown = localStorage.getItem("introShown");
    if (introWasShown) {
      setShowIntro(false);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const fetchEvents = useCallback(() => {
    if (!showIntro && !hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      setEvents([]);

      fetch(`${API_URL}/api/events`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const eventsWithDetails = data.map((event, index) => ({
              ...event,
              preco: index % 3 === 0 ? 0 : 25.00,
              dia_da_semana: (index % 7) + 1,
            }));
            setEvents(eventsWithDetails);
          } else {
            console.error("Dados da API não são um array:", data);
            setEvents([]);
          }
        })
        .catch((error) => console.error("Erro ao buscar eventos:", error))
        .finally(() => setLoading(false));
    }
  }, [API_URL, showIntro]);

  useEffect(() => {
    if (!showIntro) {
      fetchEvents();
    }
  }, [fetchEvents, showIntro]);

  const handleIntroFinish = () => {
    setShowIntro(false);
    localStorage.setItem("introShown", "true");
    fetchEvents();
  };

  const getDayOfWeekName = (dayNumber: number): string => {
    switch (dayNumber) {
      case 1: return 'Segunda';
      case 2: return 'Terça';
      case 3: return 'Quarta';
      case 4: return 'Quinta';
      case 5: return 'Sexta';
      case 6: return 'Sábado';
      case 7: return 'Domingo';
      default: return '';
    }
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    return timeString.split(':').slice(0, 2).join(':');
  };
  
  const EventCardRow: React.FC<{ event: Event }> = ({ event }) => {
    const getEventPagePath = (place: string) => {
      switch (place) {
        case "Justino": return `/justino/eventDetails`;
        case "Pracinha": return `/pracinha/eventDetails`;
        case "Oh Freguês": return `/ohfregues/eventDetails`;
        case "Highline": return `/highline/eventDetails`;
        default: return `/eventDetails`;
      }
    };
    const handleClick = () => localStorage.setItem("selectedEvent", JSON.stringify(event));
  
    return (
      <Link href={getEventPagePath(event.casa_do_evento)} onClick={handleClick}>
        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="relative w-full h-[120px]">
              <Image
                src={`${API_URL}/uploads/events/${event.imagem_do_evento}`}
                alt={event.nome_do_evento}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
            {event.preco === 0 && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                FREE
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-gray-900 truncate">{event.casa_do_evento}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {getDayOfWeekName(event.dia_da_semana)} ⋅ {formatTime(event.hora_do_evento)}
            </p>
            
            <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-gray-600 w-4/5">
                <MdLocationOn className="text-blue-500 flex-shrink-0" />
                <span className="truncate">{event.local_do_evento}</span>
              </div>
              <FaHeart className="text-blue-500 text-lg" />
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {showIntro ? (
        <Intro onFinish={handleIntroFinish} />
      ) : (
        <>
          {loading && (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
              <LoadingSpinner />
            </div>
          )}

          <Header className="z-20" />
          <div className="relative">
            <div id="home-container" className="container-mobile relative z-1">
              <div className="flex flex-col items-center mt-8 z-10">
                <Link href="/">
                  <Image src={logoWhite} alt="Logo" className="w-[120px] h-auto" />
                </Link>
              </div>
              <div className="absolute top-0 left-0 w-full h-[450px] z-0 mt-[-100px] overflow-hidden">
                <Image
                  src={imgBanner}
                  alt="Banner"
                  fill
                  sizes="100vw"
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="flex justify-center z-10 mt-8 relative">
                <form className="w-11/12 max-w-md flex items-center relative z-10">
                  <div className="flex items-center flex-grow bg-transparent">
                    <MdSearch className="text-white text-4xl mr-2" />
                    <input
                      placeholder="Buscar..."
                      type="text"
                      id="search"
                      className="w-full bg-transparent p-2 focus:outline-none text-white placeholder-white"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowFilter(!showFilter);
                    }}
                    type="button"
                    className="flex items-center bg-[#F76C11]/80 text-white px-4 py-2 ml-4 rounded-full backdrop-blur-sm hover:bg-blue-600/90 transition duration-300"
                  >
                    <MdFilterList className="text-xl mr-2" />
                    Filters
                  </button>
                </form>

                <AnimatePresence>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 100 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-t-3xl shadow-xl p-4 max-h-[85vh] overflow-y-auto w-full absolute bottom-[-800px] left-0 right-0 z-90"
                    >
                      <EventFilter />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex justify-between items-center px-4 md:px-6 mt-[30px] z-10">
                <p className="text-lg font-semibold text-white">Destaques</p>
                <div className="flex items-center gap-2">
           
                <Link
                  href="/events"
                  className="text-[#747688] hover:text-[#747688] text-[10px] font-medium"
                >
                  Ver todos
                </Link>
                </div>
              </div>
              
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth py-6 px-4 gap-4 scrollbar-hide"
              >
                {loading
                  ? [...Array(3)].map((_, index) => (
                      <div key={index} className="snap-start flex-none w-4/5 md:w-1/3">
                        <div className="w-full h-[400px] bg-slate-700 rounded-2xl animate-pulse"></div>
                      </div>
                    ))
                  : events.map((event) => (
                      <div className="snap-start flex-none w-4/5 md:w-1/3" key={event.id}>
                        <FeaturedEventCard event={event} apiUrl={API_URL} />
                      </div>
                    ))}
              </div>

              <div className="flex justify-between items-center px-6 z-10">
                <p className="text-lg font-semibold text-black">Por categorias</p>
                <Link
                  href="/events"
                  className="text-[#747688] hover:text-[#747688] text-[10px] font-medium"
                >
                  Ver todos
                </Link>
              </div>

              <div className="flex justify-center z-10 gap-6 my-8">
                <Link href="justino">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#F0635A] bg-[#F0635A] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Justino
                    </p>
                  </div>
                </Link>
                <Link href="/pracinha">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#F59762] bg-[#F59762] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Pracinha
                    </p>
                  </div>
                </Link>
                <Link href="/ohfregues">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#29D697] bg-[#29D697] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Oh Freguês
                    </p>
                  </div>
                </Link>
                <Link href="/highline">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#46CDFB] bg-[#46CDFB] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Highline
                    </p>
                  </div>
                </Link>
              </div>

              <div className="flex justify-between items-center px-6 mt-8 z-10">
                <p className="text-lg font-semibold text-black">Eventos Semanais</p>
                <Link
                  href="/eventos?tipo=semanal"
                  className="text-[#747688] hover:text-[#747688] text-[10px] font-medium"
                >
                  Ver todos
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 my-6 px-4">
                {loading
                  ? [...Array(4)].map((_, index) => (
                      <div key={index} className="rounded-xl bg-white p-2 w-full h-[240px] mx-auto animate-pulse">
                        <div className="animate-pulse flex flex-col h-full">
                          <div className="bg-slate-300 h-1/2 w-full rounded-lg"></div>
                          <div className="h-1/2 p-2 flex flex-col justify-between">
                            <div className="h-4 bg-slate-300 rounded w-3/4 mt-1"></div>
                            <div className="h-3 bg-slate-300 rounded w-1/2"></div>
                            <div className="border-t mt-2 pt-3 flex justify-between">
                              <div className="h-3 bg-slate-300 rounded w-2/3"></div>
                              <div className="h-4 w-4 bg-slate-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : events
                      .filter(event => event.tipo_evento === 'semanal')
                      .map((event) => <EventCardRow key={event.id} event={event} />)}
              </div>

              <div className="relative flex flex-col items-center mt-8 px-4">
                <Image
                  src={Promo}
                  alt="Promoção"
                  className="w-full max-w-[380px] rounded-lg shadow-md"
                />
                <div className="absolute top-1/2 left-12 md:left-16 transform -translate-y-1/2">
                  <h3 className="text-xl font-bold text-[#000]">Indique e Ganhe</h3>
                  <p className="text-sm mt-2 text-[#000]">
                    Ganhe até <span className="font-semibold">25% de desconto</span>
                  </p>
                  <button className="mt-4 bg-[#2563eb] text-white px-4 py-2 rounded-full hover:bg-[#1e4db7] transition-all">
                    Convite
                  </button>
                </div>
              </div>

              <div className="flex justify-center z-10 gap-6 my-8">
                <Link href="justino">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#F0635A] bg-[#F0635A] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Justino
                    </p>
                  </div>
                </Link>
                <Link href="/pracinha">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#F59762] bg-[#F59762] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Pracinha
                    </p>
                  </div>
                </Link>
                <Link href="/ohfregues">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#29D697] bg-[#29D697] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Oh Freguês
                    </p>
                  </div>
                </Link>
                <Link href="/highline">
                  <div className="flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <p className="text-sm font-semibold text-white border border-[#46CDFB] bg-[#46CDFB] rounded-[20px] px-[10px] py-[5px] pb-[6px]">
                      Highline
                    </p>
                  </div>
                </Link>
              </div>

              <Footer />
            </div>
          </div>
        </>
      )}
    </>
  );
}