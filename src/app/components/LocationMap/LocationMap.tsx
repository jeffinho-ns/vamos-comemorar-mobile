// components/LocationMap/LocationMap.tsx
import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface LocationMapProps {
  address: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ address }) => {
  const apiKey = process.env.NEXT_PUBLIC_Maps_API_KEY;
  
  // Codifica o endereço para ser usado em uma URL
  const encodedAddress = encodeURIComponent(address);

  // URL da API de Mapa Estático do Google
  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=15&size=600x300&markers=color:blue%7Clabel:S%7C${encodedAddress}&key=${apiKey}`;

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Localização</h3>
      
      {/* Endereço por escrito */}
      <div className="flex items-center gap-2 text-gray-700 mb-4">
        <FaMapMarkerAlt className="text-blue-500 text-xl" />
        <span>{address}</span>
      </div>

      {/* Imagem do Mapa */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        {apiKey ? (
          <Image
            src={mapImageUrl}
            alt={`Mapa mostrando ${address}`}
            width={600}
            height={300}
            className="w-full h-auto"
          />
        ) : (
          <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center text-gray-500">
            Configure a chave de API do Google Maps para exibir o mapa.
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationMap;