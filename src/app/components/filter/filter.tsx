'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Evento {
  id: number;
  casa_do_evento: string;
  nome_do_evento: string;
  data_do_evento: string;
  categoria: string;
  valor_da_mesa: string;
  brinde: string;
  imagem_do_evento: string;
}

const bairrosSP = [
  'Aclimação', 'Bela Vista', 'Butantã', 'Campo Belo', 'Campo Limpo', 'Consolação',
  'Freguesia do Ó', 'Ipiranga', 'Itaim Bibi', 'Jabaquara', 'Liberdade', 'Moema',
  'Morumbi', 'Penha', 'Pinheiros', 'Santana', 'Tatuapé', 'Vila Mariana'
];

export default function EventFilter() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtros, setFiltros] = useState({ casa: '', bairro: '' });
  const [range, setRange] = useState<[number, number]>([30, 500]);
  const [showCalendar, setShowCalendar] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchEventos = async () => {
      const res = await fetch('https://vamos-comemorar-api.onrender.com/api/events');
      const data = await res.json();
      setEventos(data);
    };
    fetchEventos();
  }, []);

  const casas = [...new Set(eventos.map(e => e.casa_do_evento))];

  const aplicarFiltro = () => {
    const query = new URLSearchParams();
    if (filtros.casa) query.append('casa', filtros.casa);
    if (filtros.bairro) query.append('bairro', filtros.bairro);
    router.push(`/eventos?${query.toString()}`);
  };

  return (
    <div className="p-4 min-h-screen bg-white flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-black">Filter</h1>

      <div className="flex flex-wrap gap-3">
        {casas.map((casa, index) => (
          <button
            key={index}
            onClick={() => setFiltros({ ...filtros, casa })}
            className={`px-4 py-2 rounded-xl border text-sm font-medium ${
              filtros.casa === casa ? 'bg-[#6D6AFF] text-white' : 'bg-white text-black border-gray-300'
            }`}
          >
            {casa}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-4 py-2 border rounded-xl border-gray-300"
        >
          <Calendar className="text-[#6D6AFF]" size={18} />
          <span className="text-sm font-medium text-black">Mostrar Calendário</span>
        </button>
      </div>

      {showCalendar && (
        <input
          type="date"
          className="border border-gray-300 rounded-xl p-2 text-sm w-full"
        />
      )}

      <div>
        <label htmlFor="bairro-input" className="text-sm font-medium text-gray-700 block mb-2">Localização</label>
        <div className="flex items-center gap-3 px-4 py-3 border rounded-xl border-gray-200">
          <MapPin className="text-[#6D6AFF]" size={18} />
          <input
            id="bairro-input"
            type="text"
            list="bairros"
            placeholder="Digite seu bairro em São Paulo"
            className="flex-1 border-none outline-none text-sm font-medium text-black bg-transparent"
            value={filtros.bairro}
            onChange={(e) => setFiltros({ ...filtros, bairro: e.target.value })}
          />
          <datalist id="bairros">
            {bairrosSP.map((bairro, idx) => (
              <option key={idx} value={bairro} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="w-full">
        <label className="text-sm font-medium text-gray-700 block mb-2">Selecione o Preço</label>
        <Slider
          range
          min={30}
          max={500}
          defaultValue={range}
          onChange={(value: number | number[]) => {
            if (Array.isArray(value) && value.length === 2) {
              setRange([value[0], value[1]]);
            }
          }}
          trackStyle={[{ backgroundColor: '#6D6AFF' }]}
          handleStyle={[{ borderColor: '#6D6AFF' }, { borderColor: '#6D6AFF' }]}
        />
        <div className="w-full flex justify-between text-sm font-medium text-black mt-2">
          <span>R${range[0]}</span>
          <span>R${range[1]}</span>
        </div>
      </div>

      <div className="flex justify-between mt-6 gap-3">
        <button
          onClick={() => setFiltros({ casa: '', bairro: '' })}
          className="flex-1 py-3 border border-gray-300 text-black font-medium text-sm rounded-xl"
        >
          RESET
        </button>
        <button
          onClick={aplicarFiltro}
          className="flex-1 py-3 bg-[#6D6AFF] text-white font-medium text-sm rounded-xl"
        >
          BUSCAR
        </button>
      </div>
    </div>
  );
}
