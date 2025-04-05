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
import Profile from "../components/profile/profile";
import Carousel from "react-multi-carousel";

// Imagens Pracinha
import logo from "../assets/pracinha/logo-pracinha.png";
import imgBanner from "../assets/pracinha/capa-pracinha.jpg";

import ambiente1 from "../assets/pracinha/ambiente-1.jpg";
import ambiente2 from "../assets/pracinha/ambiente-2.jpg";
import ambiente3 from "../assets/pracinha/ambiente-3.jpg";
import ambiente4 from "../assets/pracinha/ambiente-4.jpg";

import gastro1 from "../assets/pracinha/gastronomia-1.jpg";
import gastro2 from "../assets/pracinha/gastronomia-2.jpg";
import gastro3 from "../assets/pracinha/gastronomia-3.jpg";
import gastro4 from "../assets/pracinha/gastronomia-4.jpg";

import drink1 from "../assets/pracinha/bebida-1.jpg";
import drink2 from "../assets/pracinha/bebida-2.jpg";
import drink3 from "../assets/pracinha/bebida-3.jpg";
import drink4 from "../assets/pracinha/bebida-4.jpg";

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

const Pracinha = () => {
  const [showSobre, setShowSobre] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const router = useRouter();

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
            <Image src={logo} alt="Logo Pracinha" width={100} height={100} />
            <h1 className="text-2xl font-bold">Pracinha</h1>
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
                A Pracinha é um espaço acolhedor com clima descontraído e muita música boa. Perfeita para encontrar os amigos e curtir o melhor da gastronomia e dos drinks da casa.
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
            Rua da Alegria, 123 - Vila Urbana
          </div>

          {/* Mapa */}
          <div className="mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=..."
              width="100%"
              height="250"
              loading="lazy"
              className="rounded-lg"
            />
          </div>

          {/* Reservar */}
          <div className="mt-6 text-center">
            <p className="text-xl font-semibold">
              R$ 100,00 <span className="text-sm font-normal">/ pessoa</span>
            </p>
            <button
              onClick={() => setModalIsOpen(true)}
              className="px-6 py-2 mt-2 text-white bg-black rounded-full"
            >
              Reservar
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <Profile isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} />

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
    </main>
  );
};

export default Pracinha;
