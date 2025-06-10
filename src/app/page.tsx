"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MdSearch, MdFilterList, MdLocationOn } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Intro from "./components/intro/intro";
import EventFilter from "./components/filter/filter";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

import Promo from "./assets/indique.png";
import imgBanner from "./assets/retangulo-1.png";
import logoWhite from "./assets/logo_blue.png";

import Avatar1 from "./assets/avatar/001.jpg";
import Avatar2 from "./assets/avatar/002.jpg";
import Avatar3 from "./assets/avatar/003.jpeg";
import Avatar4 from "./assets/avatar/004.jpg";

// Interface do Evento atualizada com todos os campos necessários
interface Event {
  id: string;
  title: string;
  address: string;
  imagem_do_evento: string;
  nome_do_evento: string;
  casa_do_evento: string;
  local_do_evento: string;
  data_do_evento: string;
  tipo_evento: string;
  dia_da_semana: number;
  hora_do_evento: string;
  preco?: number;
  place: {
    name: string;
    logo: string;
  };
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("introShown");
    }
    return true;
  });
  const [showFilter, setShowFilter] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;
  const router = useRouter();
  const hasFetched = useRef(false);

  const fetchEvents = useCallback(() => {
    if (!showIntro && !hasFetched.current) {
      hasFetched.current = true;
      setLoading(true);
      setEvents([]);

      fetch(`${API_URL}/api/events`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // Simulando os novos campos para teste
            const eventsWithDetails = data.map((event, index) => ({
              ...event,
              preco: index % 3 === 0 ? 0 : 25.00,
              dia_da_semana: (index % 7) + 1, // Simula um dia de 1 a 7
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

  // Converte o número no nome do dia da semana
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

  // <-- MUDANÇA: Nova função para formatar a hora -->
  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    // Pega apenas a parte de hora e minuto (ex: de "22:30:00" para "22:30")
    return timeString.split(':').slice(0, 2).join(':');
  };


  // CARD DE DESTAQUES (design original)
  const Card: React.FC<{ event: Event }> = ({ event }) => {
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

    // Função de formatação específica para este card
    const formatCardDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('pt-BR', options).replace('.', '');
        return (formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)).split(' ');
    };

    const [month, day] = formatCardDate(event.data_do_evento);

    return (
      <Link href={getEventPagePath(event.casa_do_evento)} onClick={handleClick}>
        <motion.div
          className="relative bg-white rounded-lg shadow-md overflow-hidden card-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="relative w-full h-[250px]">
            <Image
              src={`${API_URL}/uploads/events/${event.imagem_do_evento}`}
              alt={event.nome_do_evento}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold">{event.casa_do_evento}</h2>
            <p className="text-sm text-gray-400 mt-2">{event.local_do_evento}</p>
            <div className="flex items-center mt-2">
              <div className="flex -space-x-2 overflow-hidden">
                <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={Avatar1} alt="User 1" />
                <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={Avatar2} alt="User 2" />
                <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={Avatar3} alt="User 3" />
                <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={Avatar4} alt="User 4" />
              </div>
              <p className="text-sm text-gray-500 ml-2">+20 Seguindo</p>
            </div>
          </div>
          <div className="absolute top-2 left-2 bg-white rounded-lg p-2 flex flex-col items-center justify-center h-12 w-12">
            <span className="text-xs font-bold text-red-500">{month}</span>
            <span className="text-lg font-bold text-red-500">{day}</span>
          </div>
          <div className="absolute top-2 right-2 bg-white rounded-full p-2">
            <FaHeart className="text-red-500 text-2xl" />
          </div>
        </motion.div>
      </Link>
    );
  };

  // CARD DE EVENTOS SEMANAIS (novo design)
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
              <div className="absolute inset-0 w-full h-[450px] z-0 mt-[-100px] overflow-hidden">
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
                      className="bg-white rounded-t-3xl shadow-xl p-4 max-h-[85vh] overflow-y-auto w-full absolute bottom-[-800px] left-0 right-0 z-40"
                    >
                      <EventFilter />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex justify-between items-center px-6 mt-[30px] z-10">
                <p className="text-lg font-semibold text-white">Destaques</p>
                <Link
                  href="/eventos"
                  className="text-[#747688] hover:text-[#747688] text-[10px] font-medium"
                >
                  Ver todos
                </Link>
              </div>
              <div className="cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 px-4">
                {loading
                  ? [...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="border border-slate-700 shadow rounded-lg p-4 w-full h-[350px] mx-auto animate-pulse"
                      >
                        <div className="animate-pulse flex flex-col h-full">
                          <div className="bg-slate-700 h-3/5 w-full rounded-t-lg"></div>
                          <div className="flex-1 space-y-4 pt-4 px-2">
                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  : events.map((event) => <Card key={event.id} event={event} />)}
              </div>

              <div className="flex justify-between items-center px-6 z-10">
                <p className="text-lg font-semibold text-black">Por categorias</p>
                <Link
                  href="/eventos"
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



             {/* Seção de Eventos Semanais - 2 por linha */}
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
              {/* Fim da Seção de Eventos Semanais */}


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