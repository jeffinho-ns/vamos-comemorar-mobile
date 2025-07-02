"use client";

import { useEffect, useState } from "react";
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

// Interface completa do Evento
interface Event {
  id: string | number;
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
  place?: { name: string; logo: string; };
}

// Interfaces e mocks para Promoter e Tipo de Lista
interface Promoter { id: string; name: string; }
interface ListType { id:string; name: "Pista" | "Área VIP" | "Camarote"; }
const mockPromoters: Promoter[] = [ { id: "promo1", name: "Ricardo Alves" }, { id: "promo2", name: "Juliana Costa" }, { id: "promo3", name: "Equipe NightSP" }, ];
const mockListTypes: ListType[] = [ { id: "lt1", name: "Pista" }, { id: "lt2", name: "Área VIP" }, { id: "lt3", name: "Camarote" }, ];

const NewListPage = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  // Estados do componente
  const [events, setEvents] = useState<Event[]>([]);
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [listTypes, setListTypes] = useState<ListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedListTypeId, setSelectedListTypeId] = useState<string>('');
  const [selectedPromoterId, setSelectedPromoterId] = useState<string>('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  // Efeito para buscar os dados da API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/events`);
        if (!response.ok) throw new Error('Falha ao buscar eventos da API');
        const data: Event[] = await response.json();
        setEvents(data);
        setPromoters(mockPromoters);
        setListTypes(mockListTypes);
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

  // Deriva o evento selecionado a partir do estado
  const selectedEvent = events.find(event => String(event.id) === selectedEventId);

  // Funções de manipulação
  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEventId(e.target.value);
  };

  const handleSubmitVipList = () => {
    if (!selectedEvent) return;
    const submissionData = { eventId: selectedEventId, listTypeId: selectedListTypeId, promoterId: selectedPromoterId, people: numberOfPeople, };
    console.log("Dados da Lista VIP Enviados:", submissionData);
    alert(`Nome na lista para o evento ${selectedEvent.nome_do_evento} enviado com sucesso!`);
    router.push('/');
  };

  // Renderização de estado de carregamento
  if (isLoading) {
    return (
      <div className="bg-gray-900 w-full h-screen flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 h-screen w-full overflow-hidden">
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            key={selectedEvent.id}
            className="absolute top-0 left-0 w-full h-3/4"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <Image
              src={`${API_URL}/uploads/events/${selectedEvent.imagem_do_evento}`}
              alt={selectedEvent.nome_do_evento}
              fill={true}
              className="object-cover opacity-60"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
        <button onClick={() => router.back()} className="bg-white/20 p-3 rounded-full text-white backdrop-blur-sm">
          <FaArrowLeft />
        </button>
      </header>

      {selectedEvent ? (
        <motion.div
          className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl z-10"
          initial={{ y: "75%" }}
          animate={{ y: isPanelOpen ? "5%" : "75%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(event, info) => {
            if (info.offset.y > 100) setIsPanelOpen(false);
            else if (info.offset.y < -100) setIsPanelOpen(true);
          }}
        >
          <div className="w-full py-4 flex justify-center cursor-grab touch-none">
            <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
  
          <div className="px-6 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">{selectedEvent.nome_do_evento}</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 text-gray-600">
              <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-blue-500" /><span>{selectedEvent.local_do_evento}</span></div>
              <div className="flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /><span>{new Date(selectedEvent.data_do_evento).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}</span></div>
            </div>
          </div>
  
          <div
            className="px-6 pb-32 h-[80vh] overflow-y-auto"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-800">Sobre o Evento</h3>
            <p className="text-gray-600 mb-6 text-sm">
              {selectedEvent.descricao || "Nenhuma descrição disponível para este evento."}
            </p>
  
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaClock className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Horário</h4><p className="font-semibold text-sm">{selectedEvent.hora_do_evento}</p></div></div>
              <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaTicketAlt className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Entrada</h4><p className="font-semibold text-sm">R$ {selectedEvent.valor_da_entrada}</p></div></div>
              <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaGift className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Brinde</h4><p className="font-semibold text-sm">{selectedEvent.brinde}</p></div></div>
              <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"><FaTag className="text-blue-500 text-xl" /><div><h4 className="text-xs text-gray-500">Categoria</h4><p className="font-semibold text-sm">{selectedEvent.categoria}</p></div></div>
            </div>
  
            {selectedEvent.imagem_do_combo && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Combo Especial</h3>
                <Image src={`${API_URL}/uploads/events/${selectedEvent.imagem_do_combo}`} alt="Imagem do Combo" width={600} height={300} className="w-full h-auto object-cover rounded-xl shadow-md" unoptimized />
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Entrar na Lista VIP</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Escolha o Evento</label>
                  <select value={selectedEventId} onChange={handleEventChange} className="p-3 rounded-lg border border-gray-300 bg-gray-50 appearance-none">
                    {events.map((event) => (<option key={event.id} value={event.id}>{event.nome_do_evento}</option>))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Tipo da Lista</label>
                  <select value={selectedListTypeId} onChange={(e) => setSelectedListTypeId(e.target.value)} className="p-3 rounded-lg border border-gray-300 bg-gray-50 appearance-none">
                    {listTypes.map((type) => (<option key={type.id} value={type.id}>{type.name}</option>))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Promoter</label>
                  <select value={selectedPromoterId} onChange={(e) => setSelectedPromoterId(e.target.value)} className="p-3 rounded-lg border border-gray-300 bg-gray-50 appearance-none">
                    {promoters.map((promoter) => (<option key={promoter.id} value={promoter.id}>{promoter.name}</option>))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Quantidade de Pessoas</label>
                  <select className="p-3 rounded-lg border border-gray-300 bg-gray-50 appearance-none" value={numberOfPeople} onChange={(e) => setNumberOfPeople(Number(e.target.value))}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (<option key={num} value={num}>{num} Pessoa{num > 1 ? "s" : ""}</option>))}
                  </select>
                </div>
                <button onClick={handleSubmitVipList} className="bg-green-600 text-white py-3 rounded-full text-center font-semibold mt-4 hover:bg-green-700 transition-colors">
                  Enviar Nome para a Lista
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-center p-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Nenhum evento para exibir</h2>
            <p className="text-sm text-gray-300">A busca na API pode ter falhado ou não há eventos disponíveis.</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedEvent && !isPanelOpen && (
          <motion.div className="absolute bottom-0 left-0 w-full p-4 z-20 bg-gradient-to-t from-white via-white to-transparent" initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }}>
            <button onClick={() => setIsPanelOpen(true)} className="w-full bg-blue-600 text-white py-4 rounded-full text-center font-bold text-lg shadow-lg hover:bg-blue-700">
              Entrar na Lista VIP
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewListPage;