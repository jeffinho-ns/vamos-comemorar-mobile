"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiSettings, FiLogOut, FiLock, FiHelpCircle } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/headernotification/headernotification";
import Footer from "../components/footer/footer";

interface User {
  id: string;
  name: string;
  foto_perfil?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

  const fetchUserData = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [API_URL, router]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      fetchUserData(token);
    }
  }, [fetchUserData, router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <>
      <Header />
      <div className="flex flex-col items-center bg-white min-h-screen pt-8 px-4">
        <h1 className="text-lg font-semibold w-full mb-6">Perfil</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-2 overflow-hidden">
            {user?.foto_perfil ? (
              <Image
                src={
                  user.foto_perfil.startsWith("http")
                    ? user.foto_perfil
                    : `${API_URL}/uploads/${user.foto_perfil}`
                }
                alt="Foto de perfil"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-500">Adicionar foto</span>
            )}
          </div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-400 text-sm">ID: {user?.id}</p>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <Link
            href="/myreservations"
            className="flex items-center p-4 border-gray-300 rounded-lg"
          >
            <FiSettings className="text-teal-500 text-xl mr-4" />
            <span className="text-base">Minhas Reservas</span>
            <span className="ml-auto text-gray-400">{">"}</span>
          </Link>

          <Link
            href="/configprofile"
            className="flex items-center p-4  border-gray-300 rounded-lg"
          >
            <FiSettings className="text-teal-500 text-xl mr-4" />
            <span className="text-base">Configurações</span>
            <span className="ml-auto text-gray-400">{">"}</span>
          </Link>

          <Link
            href="/trocar-senha"
            className="flex items-center p-4  border-gray-300 rounded-lg"
          >
            <FiLock className="text-teal-500 text-xl mr-4" />
            <span className="text-base">Trocar senha</span>
            <span className="ml-auto text-gray-400">{">"}</span>
          </Link>

          <Link
            href="/ajuda"
            className="flex items-center p-4  border-gray-300 rounded-lg"
          >
            <FiHelpCircle className="text-teal-500 text-xl mr-4" />
            <span className="text-base">Ajuda e suporte</span>
            <span className="ml-auto text-gray-400">{">"}</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center p-4  border-gray-300 rounded-lg w-full text-left"
          >
            <FiLogOut className="text-teal-500 text-xl mr-4" />
            <span className="text-base">Sair</span>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
