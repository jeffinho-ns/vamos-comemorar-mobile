"use client";

import Modal from "react-modal";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MdLocationOn,
  MdInfoOutline,
  MdEvent
} from "react-icons/md";
import "react-multi-carousel/lib/styles.css";
import HeaderLike from "../components/headerlike/headerlike";
import Footer from "./../components/footer/footer";
import Programacao from "../components/programacao/programacao";

// Importar o novo componente de modal de reserva
import PlaceReservationModal from "../components/PlaceReservationModal/PlaceReservationModal";

import Carousel from "react-multi-carousel";

// Imagens Oh Freguês
import logo from "../assets/ohfregues/logoOhfregues.png";
import imgBanner from "../assets/ohfregues/oh-fregues-capa.jpg";

import ambiente1 from "../assets/ohfregues/ambiente-1.jpg";
import ambiente2 from "../assets/ohfregues/ambiente-2.jpg";
import ambiente3 from "../assets/ohfregues/ambiente-3.jpg";
import ambiente4 from "../assets/ohfregues/ambiente-4.jpg";

import gastro1 from "../assets/ohfregues/gastronomia-1.jpg";
import gastro2 from "../assets/ohfregues/gastronomia-2.jpg";
import gastro3 from "../assets/ohfregues/gastronomia-3.jpg";
import gastro4 from "../assets/ohfregues/gastronomia-4.jpg";

import drink1 from "../assets/ohfregues/bebidas-1.jpg";
import drink2 from "../assets/ohfregues/bebidas-2.jpg";
import drink3 from "../assets/ohfregues/bebidas-3.jpg";
import drink4 from "../assets/ohfregues/bebidas-4.jpg";

import icon1 from "../assets/icones/area.png";
import icon2 from "../assets/icones/acessivel.png";
import icon3 from "../assets/icones/estacionamento.png";
import icon4 from "../assets/icones/18.png";
import icon5 from "../assets/icones/mesa.png";

// Carousel settings
const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

// <--- DEFINA O NOME DA CASA AQUI! --->
const CASA_DO_EVENTO = "Oh Freguês";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_URL_LOCAL;

if (!API_URL) {
  throw new Error("API_URL não está definida nas variáveis de ambiente.");
}



const OhFregues = () => {
  const [showSobre, setShowSobre] = useState(true);
  // Removido o estado profileModalIsOpen, pois Profile não é mais usado para a reserva principal
  // const [profileModalIsOpen, setProfileModalIsOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const router = useRouter();

  // ESTADO PARA CONTROLAR A VISIBILIDADE DO PlaceReservationModal
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("lastPageLogo", logo.src);
    localStorage.setItem("lastPageBanner", imgBanner.src);

    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const openImage = (src: string) => setExpandedImage(src);
  const closeImage = () => setExpandedImage(null);

  return (
    <main className="min-h-screen bg-white">
      <HeaderLike />

      {/* Banner fixo */}
      <div className="fixed top-0 left-0 w-full h-[300px] sm:h-[400px] z-0">
        <Image src={imgBanner} alt="Banner" fill className="object-cover" />
      </div>

      {/* Conteúdo sobreposto */}
      <section className="relative z-1 px-4 pt-[320px] sm:pt-[420px] pb-6 space-y-4">
        <div className="bg-white rounded-t-2xl shadow-md p-4">
          {/* Header e logo */}
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src={logo} alt={`Logo ${CASA_DO_EVENTO}`} width={100} height={100} />
            <h1 className="text-2xl font-bold">{CASA_DO_EVENTO}</h1>
          </div>

          {/* Botões sobre / eventos */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setShowSobre(true)}
              className={`flex items-center gap-1 px-4 py-2 text-sm rounded-full ${showSobre ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              <MdInfoOutline />
              Sobre
            </button>
            <button
              onClick={() => setShowSobre(false)}
              className={`flex items-center gap-1 px-4 py-2 text-sm rounded-full ${!showSobre ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              <MdEvent />
              Eventos
            </button>
          </div>

          {/* Descrição */}
          {showSobre ? (
            <>
              <p className="text-sm text-center">
                O Oh Freguês é o lugar certo para quem busca diversão, gastronomia e música boa em um só espaço. Com um ambiente moderno e descontraído, é perfeito para todas as ocasiões.
              </p>

              {/* Ambientes */}
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-center">Ambientes</h2>
                <Carousel responsive={responsive} arrows={false} showDots swipeable itemClass="px-2">
                  {[ambiente1, ambiente2, ambiente3, ambiente4].map((img, i) => (
                    <div key={i} onClick={() => openImage(img.src)} className="cursor-pointer">
                      <Image
                        src={img}
                        alt={`Ambiente ${i + 1}`}
                        className="rounded-lg object-cover w-full h-[200px]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Gastronomia */}
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-center">Gastronomia</h2>
                <Carousel responsive={responsive} arrows={false} showDots swipeable itemClass="px-2">
                  {[gastro1, gastro2, gastro3, gastro4].map((img, i) => (
                    <div key={i} onClick={() => openImage(img.src)} className="cursor-pointer">
                      <Image
                        src={img}
                        alt={`Gastronomia ${i + 1}`}
                        className="rounded-lg object-cover w-full h-[200px]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Drinks */}
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-center">Drinks</h2>
                <Carousel responsive={responsive} arrows={false} showDots swipeable itemClass="px-2">
                  {[drink1, drink2, drink3, drink4].map((img, i) => (
                    <div key={i} onClick={() => openImage(img.src)} className="cursor-pointer">
                      <Image
                        src={img}
                        alt={`Drink ${i + 1}`}
                        className="rounded-lg object-cover w-full h-[200px]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              {/* Ícones */}
              <div className="flex flex-wrap justify-center gap-6 mt-6">
                {[icon1, icon2, icon3, icon4, icon5].map((icon, i) => (
                  <div key={i} className="flex flex-col items-center text-xs">
                    <Image src={icon} width={32} height={32} alt="Ícone" />
                    <span className="mt-1">Texto</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Programacao />
          )}

          {/* Localização */}
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-700">
            <MdLocationOn />
            Avenida Central, 456 - Centro
          </div>

          {/* Mapa */}
          <div className="mt-4">
            <iframe
              // Ajustando o src para ser mais genérico ou apontar para um local real se tiver um.
              // Para 'Oh Freguês', você pode querer um novo iframe src específico para ele.
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.452932204797!2d-46.65756048866164!3d-23.55187766107386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce583f706d871f%3A0xc3b8a1c97a22a363!2sAv.%20Central%2C%20456%20-%20Consola%C3%A7%C3%A3o%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001306-000!5e0!3m2!1spt-BR!2sbr!4v1701392683935!5m2!1spt-BR!2sbr"
              width="100%"
              height="250"
              loading="lazy"
              className="rounded-lg"
            />
          </div>

          {/* Reservar */}
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold">
              R$ 80,00 <span className="text-sm font-normal">/ pessoa</span>
            </p>
            {/* Botão de Reserva: abre o modal de reserva reutilizável */}
            <button
              onClick={() => setIsReservationModalOpen(true)}
              className="px-6 py-2 mt-2 text-white bg-black rounded-full"
            >
              Reservar
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Removido o componente Profile pois a funcionalidade de reserva foi movida */}
      {/* <Profile isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} /> */}

      {/* Modal de imagem ampliada */}
      <Modal
        isOpen={!!expandedImage}
        onRequestClose={closeImage}
        className="fixed top-1/2 left-1/2 w-5/6 max-w-xl -translate-x-1/2 -translate-y-1/2 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-80 z-50"
      >
        {expandedImage && (
          <Image
            src={expandedImage}
            alt="Imagem ampliada"
            width={800}
            height={600}
            className="object-contain rounded-lg"
          />
        )}
      </Modal>

      {/* RENDERIZAÇÃO DO COMPONENTE DE MODAL DE RESERVA REUTILIZÁVEL */}
      <PlaceReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        casaDoEvento={CASA_DO_EVENTO} // Passa o nome da casa (ex: "Oh Freguês")
        API_URL={API_URL} // Passa a URL da API
      />
    </main>
  );
};

export default OhFregues;