"use client";

import Modal from "react-modal";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdLocationOn, MdInfoOutline, MdEvent } from "react-icons/md";
import "react-multi-carousel/lib/styles.css";
import HeaderLike from "../components/headerlike/headerlike";
import Footer from "../components/footer/footer";
import Programacao from "../components/programacao/programacao";
import Profile from "../components/profile/profile";
import Carousel from "react-multi-carousel";
// Você não precisa mais de `motion` e `AnimatePresence` diretamente aqui,
// pois eles estão no `PlaceReservationModal`
// import { motion, AnimatePresence } from "framer-motion";

// Você não precisa mais do DatePicker aqui, pois ele está no `PlaceReservationModal`
// import DatePicker from "react-datepicker";

// Importar o novo componente de modal de reserva
import PlaceReservationModal from "../components/PlaceReservationModal/PlaceReservationModal";

import logo from "../assets/justino/justinologo.png";
import imgBanner from "../assets/justino/capa-justino.png";

// Imagens
import ambiente1 from "../assets/justino/ambiente-1.jpeg";
import ambiente2 from "../assets/justino/ambiente-2.jpeg";
import ambiente3 from "../assets/justino/ambiente-3.jpeg";
import ambiente4 from "../assets/justino/ambiente-4.jpeg";

import gastro1 from "../assets/justino/gastronomia-1.jpeg";
import gastro2 from "../assets/justino/gastronomia-2.jpeg";
import gastro3 from "../assets/justino/gastronomia-3.jpeg";
import gastro4 from "../assets/justino/gastronomia-4.jpeg";

import drink1 from "../assets/justino/bebida-1.jpeg";
import drink2 from "../assets/justino/bebida-2.jpeg";
import drink3 from "../assets/justino/bebida-3.jpeg";
import drink4 from "../assets/justino/bebida-4.jpeg";

import icon1 from "../assets/icones/area.png";
import icon2 from "../assets/icones/acessivel.png";
import icon3 from "../assets/icones/estacionamento.png";
import icon4 from "../assets/icones/18.png";
import icon5 from "../assets/icones/mesa.png";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
};

// <--- DEFINA O NOME DA CASA AQUI! E PARA AS OUTRAS PÁGINAS! --->
const CASA_DO_EVENTO = "Seu Justino";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_URL_LOCAL;

if (!API_URL) {
  throw new Error("API_URL não está definida nas variáveis de ambiente.");
}



const Justino = () => {
  const [showSobre, setShowSobre] = useState(true);
  const [profileModalIsOpen, setProfileModalIsOpen] = useState(false);
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
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src={logo} alt={`Logo ${CASA_DO_EVENTO}`} width={100} height={100} />
            <h1 className="text-2xl font-bold">{CASA_DO_EVENTO}</h1>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setShowSobre(true)}
              className={`flex items-center gap-1 px-4 py-2 text-sm rounded-full ${
                showSobre ? "bg-black text-white" : "bg-gray-100"
              }`}
            >
              <MdInfoOutline /> Sobre
            </button>
            <button
              onClick={() => setShowSobre(false)}
              className={`flex items-center gap-1 px-4 py-2 text-sm rounded-full ${
                !showSobre ? "bg-black text-white" : "bg-gray-100"
              }`}
            >
              <MdEvent /> Eventos
            </button>
          </div>

          {showSobre ? (
            <>
              <p className="text-sm text-center">
                O {CASA_DO_EVENTO} é o lugar ideal para quem busca diversão, boa
                comida e bons drinks em um só lugar.
              </p>

              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-center">
                  Ambientes
                </h2>
                <Carousel
                  responsive={responsive}
                  arrows={false}
                  showDots
                  swipeable
                  itemClass="px-2"
                >
                  {[ambiente1, ambiente2, ambiente3, ambiente4].map((img, i) => (
                    <div
                      key={i}
                      onClick={() => openImage(img.src)}
                      className="cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`Ambiente ${i + 1}`}
                        className="rounded-lg object-cover w-full h-[200px]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-center">
                  Gastronomia
                </h2>
                <Carousel
                  responsive={responsive}
                  arrows={false}
                  showDots
                  swipeable
                  itemClass="px-2"
                >
                  {[gastro1, gastro2, gastro3, gastro4].map((img, i) => (
                    <div
                      key={i}
                      onClick={() => openImage(img.src)}
                      className="cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`Gastronomia ${i + 1}`}
                        className="rounded-lg object-cover w-full h-[200px]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-center">Drinks</h2>
                <Carousel
                  responsive={responsive}
                  arrows={false}
                  showDots
                  swipeable
                  itemClass="px-2"
                >
                  {[drink1, drink2, drink3, drink4].map((img, i) => (
                    <div
                      key={i}
                      onClick={() => openImage(img.src)}
                      className="cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`Drink ${i + 1}`}
                        className="rounded-lg object-cover w-full h-[200px]"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

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

          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-700">
            <MdLocationOn />
            Rua Harmonia, 77 - Vila Madalena
          </div>

          <div className="mt-4">
            <iframe
              src="https://www.google.com/maps/embed?..."
              width="100%"
              height="250"
              loading="lazy"
              className="rounded-lg"
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xl font-semibold">
              R$ 120,00 <span className="text-sm font-normal">/ pessoa</span>
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

      <Profile
        isOpen={profileModalIsOpen}
        onRequestClose={() => setProfileModalIsOpen(false)}
      />

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
        casaDoEvento={CASA_DO_EVENTO} // Passa o nome da casa (ex: "Seu Justino")
        API_URL={API_URL} // Passa a URL da API
      />
    </main>
  );
};

export default Justino;