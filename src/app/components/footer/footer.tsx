import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 z-10 w-full bg-white shadow-md py-3 flex justify-around items-center border-t border-gray-200">
      {/* Ícone Explore */}
      <Link href="/" className="flex flex-col items-center text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/" ? "text-blue-500" : "text-gray-400"}`}>
          <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" fill="currentColor" />
        </svg>
        <span className={`text-xs mt-1 ${pathname === "/" ? "text-blue-500 font-semibold" : "text-gray-400"}`}>Explore</span>
      </Link>

      {/* Ícone de Eventos */}
      <Link href="/events" className="flex flex-col items-center text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/events" ? "text-blue-500" : "text-gray-400"}`}>
          <path d="M7 10h10M7 14h5M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={`text-xs mt-1 ${pathname === "/events" ? "text-blue-500 font-semibold" : "text-gray-400"}`}>Eventos</span>
      </Link>

      {/* Botão central destacado */}
      <div className="absolute -top-6 bg-blue-500 p-3 rounded-full shadow-lg border-4 border-white">
        <Link href="/novo-evento">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Ícone de Mapas */}
      <Link href="/map" className="flex flex-col items-center text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/map" ? "text-blue-500" : "text-gray-400"}`}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 3.25 3.5 8.45 6.5 11.5a1.5 1.5 0 002 0C15.5 17.45 19 12.25 19 9c0-3.87-3.13-7-7-7z" fill="currentColor" />
        </svg>
        <span className={`text-xs mt-1 ${pathname === "/map" ? "text-blue-500 font-semibold" : "text-gray-400"}`}>Mapa</span>
      </Link>

      {/* Ícone de Perfil */}
      <Link href="/profile" className="flex flex-col items-center text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${pathname === "/profile" ? "text-blue-500" : "text-gray-400"}`}>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
        </svg>
        <span className={`text-xs mt-1 ${pathname === "/profile" ? "text-blue-500 font-semibold" : "text-gray-400"}`}>Perfil</span>
      </Link>
    </footer>
  );
}
