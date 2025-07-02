"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaTicketAlt,
    FaClock,
    FaGift,
    FaTag
} from "react-icons/fa";
import clsx from 'clsx';

// Interfaces e Mocks
interface Event { id: string | number; title: string; address: string; imagem_do_evento: string; hora_do_evento: string; categoria: string; valor_da_mesa: string; brinde: string; numero_de_convidados: string; valor_da_entrada: string; imagem_do_combo: string; observacao: string; nome_do_evento: string; casa_do_evento: string; local_do_evento: string; data_do_evento: string; descricao?: string; place?: { name: string; logo: string; }; }
interface Promoter { id: string; name: string; }
interface ListType { id: string; name: "Pista" | "Área VIP" | "Camarote"; }
const mockPromoters: Promoter[] = [{ id: "promo1", name: "Ricardo Alves" }, { id: "promo2", name: "Juliana Costa" }, { id: "promo3", name: "Equipe NightSP" },];
const mockListTypes: ListType[] = [{ id: "lt1", name: "Pista" }, { id: "lt2", name: "Área VIP" }, { id: "lt3", name: "Camarote" },];

// Instale o clsx com: npm install clsx
// Para o scrollbar-hide: npm install -D tailwind-scrollbar-hide

const NewListPage = () => {
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Estados
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [selectedListTypeId, setSelectedListTypeId] = useState<string>('');
    const [selectedPromoterId, setSelectedPromoterId] = useState<string>('');
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [isDraggable, setIsDraggable] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    // Efeito para buscar dados
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/events`);
                if (!response.ok) throw new Error('Falha ao buscar eventos da API');
                const data: Event[] = await response.json();
                setEvents(data);
                if (data.length > 0) {
                    setSelectedEventId(String(data[0].id));
                    setSelectedListTypeId(mockListTypes[0].id);
                    setSelectedPromoterId(mockPromoters[0].id);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setEvents([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [API_URL]);

    const selectedEvent = events.find(event => String(event.id) === selectedEventId);

    const handleSelectEvent = (eventId: string) => {
        setSelectedEventId(eventId);
    };

    const handleContentScroll = () => {
        if (contentRef.current) {
            const { scrollTop } = contentRef.current;
            setIsDraggable(scrollTop === 0);
        }
    };

    useEffect(() => {
        if (!isPanelOpen) {
            setIsDraggable(true);
        }
    }, [isPanelOpen]);

    const handleSubmitVipList = () => {
        if (!selectedEvent) return;
        const submissionData = { eventId: selectedEventId, listTypeId: selectedListTypeId, promoterId: selectedPromoterId, people: numberOfPeople, };
        console.log("Dados da Lista VIP Enviados:", submissionData);
        alert(`Nome na lista para o evento ${selectedEvent.nome_do_evento} enviado com sucesso!`);
        router.push('/');
      };

    if (isLoading) {
        return <div className="bg-gray-900 w-full h-screen flex items-center justify-center text-white">Carregando...</div>;
    }

    return (
        <div className="bg-gray-900 h-screen w-full overflow-hidden">
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div key={selectedEvent.id} className="absolute top-0 left-0 w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
                        <Image src={`${API_URL}/uploads/events/${selectedEvent.imagem_do_evento}`} alt={selectedEvent.nome_do_evento} fill={true} className="object-cover opacity-50" unoptimized />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-30">
                <button onClick={() => router.back()} className="bg-white/10 p-3 rounded-full text-white backdrop-blur-sm"><FaArrowLeft /></button>
            </header>
            
            <div className="absolute top-20 left-0 w-full z-20">
                <div className="px-4 flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                    {events.map((event) => (
                        <button
                            key={event.id}
                            onClick={() => handleSelectEvent(String(event.id))}
                            className={clsx(
                                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 backdrop-blur-sm",
                                {
                                    "bg-white text-gray-900 shadow-lg": String(event.id) === selectedEventId,
                                    "bg-white/10 text-white": String(event.id) !== selectedEventId,
                                }
                            )}
                        >
                            {event.nome_do_evento}
                        </button>
                    ))}
                </div>
            </div>

            {selectedEvent ? (
                <motion.div
                    className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl z-20"
                    initial={{ y: "88%" }}
                    animate={{ y: isPanelOpen ? "5%" : "88%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag={isDraggable ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(event, info) => {
                        if (info.offset.y > 100) {
                            setIsPanelOpen(false);
                        } else if (info.offset.y < -100) {
                            setIsPanelOpen(true);
                        }
                    }}
                >
                    <div className="w-full py-4 flex justify-center cursor-grab touch-none"><div className="w-16 h-1.5 bg-gray-300 rounded-full"></div></div>
                    
                    <div className="px-6 pb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{selectedEvent.nome_do_evento}</h1>
                        <div className="flex items-center gap-4 mt-2 text-gray-600"><FaMapMarkerAlt className="text-blue-500" /><span>{selectedEvent.local_do_evento}</span></div>
                    </div>
                    
                    <div
                        ref={contentRef}
                        onScroll={handleContentScroll}
                        className="px-6 pb-32 h-[80vh] overflow-y-auto"
                    >
                        <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">Sobre o Evento</h3>
                        <p className="text-gray-600 mb-6 text-sm">{selectedEvent.descricao || "Nenhuma descrição."}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaClock className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Horário</h4><p className="font-semibold text-sm">{selectedEvent.hora_do_evento}</p></div></div>
                            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaTicketAlt className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Entrada</h4><p className="font-semibold text-sm">R$ {selectedEvent.valor_da_entrada}</p></div></div>
                            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaGift className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Brinde</h4><p className="font-semibold text-sm">{selectedEvent.brinde}</p></div></div>
                            <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaTag className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Categoria</h4><p className="font-semibold text-sm">{selectedEvent.categoria}</p></div></div>
                        </div>

                        {selectedEvent.imagem_do_combo && (
                            <div className="mb-6"><h3 className="text-lg font-semibold mb-2 text-gray-800">Combo Especial</h3><Image src={`${API_URL}/uploads/events/${selectedEvent.imagem_do_combo}`} alt="Imagem do Combo" width={600} height={300} className="w-full h-auto object-cover rounded-xl shadow-md" unoptimized /></div>
                        )}
                        
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Entrar na Lista VIP</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-gray-700">Tipo da Lista</label><select value={selectedListTypeId} onChange={(e) => setSelectedListTypeId(e.target.value)} className="p-3 rounded-lg border border-gray-300 bg-gray-50 appearance-none">{mockListTypes.map((type) => (<option key={type.id} value={type.id}>{type.name}</option>))}</select></div>
                                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-gray-700">Promoter</label><select value={selectedPromoterId} onChange={(e) => setSelectedPromoterId(e.target.value)} className="p-3 rounded-lg border border-gray-300 bg-gray-50 appearance-none">{mockPromoters.map((promoter) => (<option key={promoter.id} value={promoter.id}>{promoter.name}</option>))}</select></div>
                                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-gray-700">Quantidade de Pessoas</label><select className="p-3 rounded-lg border border-gray-300 bg-gray-50 appearance-none" value={numberOfPeople} onChange={(e) => setNumberOfPeople(Number(e.target.value))}>{Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num} Pessoa{num > 1 ? "s" : ""}</option>))}</select></div>
                                <button onClick={handleSubmitVipList} className="bg-green-600 text-white py-3 rounded-full text-center font-semibold mt-4 hover:bg-green-700">Enviar Nome para a Lista</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-center p-4"><div><h2 className="text-2xl font-bold mb-2">Nenhum evento para exibir</h2><p className="text-sm text-gray-300">A busca na API pode ter falhado.</p></div></div>
            )}

            <AnimatePresence>
                {selectedEvent && !isPanelOpen && (
                    <motion.div className="absolute bottom-0 left-0 w-full p-4 z-30" initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }}>
                        <button onClick={() => setIsPanelOpen(true)} className="w-full bg-blue-600 text-white py-4 rounded-full text-center font-bold text-lg shadow-lg hover:bg-blue-700 transition-colors">Ver Detalhes e Entrar na Lista</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NewListPage;