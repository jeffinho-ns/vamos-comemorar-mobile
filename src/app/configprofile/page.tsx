"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiSave, FiEdit } from "react-icons/fi";
import Header from "../components/headernotification/headernotification";
import Footer from "../components/footer/footer";
import { useRouter } from "next/navigation";

type EditableField = "nome" | "endereco" | "telefone" | "senha";

interface User {
  name: string;
  telefone: string;
  endereco?: string;
  foto_perfil?: string;
}

const ConfigProfile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState({
    nome: "",
    localizacao: "BR (Brasil - SP)",
    endereco: "",
    telefone: "(11) 9 4350-1097",
    foto_perfil: "",
    senha: "",
  });
  const [isEditing, setIsEditing] = useState<Record<EditableField, boolean>>({
    nome: false,
    endereco: false,
    telefone: false,
    senha: false,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const fetchUserData = useCallback(async (token: string) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const fotoUrl = userData.foto_perfil
          ? `${API_URL}${userData.foto_perfil.startsWith("/") ? userData.foto_perfil : `/uploads/${userData.foto_perfil}`}`
          : "";

        setUser(userData);
        setUserInfo({
          nome: userData.name,
          localizacao: "BR (Brasil - SP)",
          endereco: userData.endereco || "",
          telefone: userData.telefone || "(11) 9 4350-1097",
          foto_perfil: fotoUrl,
          senha: "",
        });
      } else {
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      localStorage.removeItem("authToken");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return router.push("/login");
    fetchUserData(token);
  }, [fetchUserData, router]);

  const handleEditClick = (field: EditableField) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (field: EditableField, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const formData = new FormData();

    if (user) {
      if (userInfo.nome !== user.name) formData.append("name", userInfo.nome);
      if (userInfo.telefone !== user.telefone) formData.append("telefone", userInfo.telefone);
      if (userInfo.senha) formData.append("password", userInfo.senha);
    }

    if (file) formData.append("foto_perfil", file);

    if (formData.entries().next().done) {
      setMessage("Nenhuma alteração para salvar.");
      return;
    }

    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        setMessage("Atualizado com sucesso!");
        setIsEditing({ nome: false, endereco: false, telefone: false, senha: false });
        setFile(null);
        setPreviewUrl(null);
      } else {
        const errData = await res.json();
        setMessage(`Erro: ${errData.error || res.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setMessage("Erro ao atualizar perfil.");
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-grow flex flex-col items-center py-8">
          <h2 className="text-lg font-semibold self-start px-4">Configurações</h2>
          {message && <p className="text-sm text-green-600 mt-2">{message}</p>}

          <div className="flex flex-col items-center mt-6">
            <label className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden cursor-pointer relative">
              {previewUrl || userInfo.foto_perfil ? (
                <Image
                  src={previewUrl || userInfo.foto_perfil}
                  alt="Foto de perfil"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-500 flex items-center justify-center w-full h-full">Foto</span>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {file && (
              <button className="mt-2" onClick={handleSaveClick}>
                <FiSave className="text-teal-600 text-xl" />
              </button>
            )}
          </div>

          <div className="w-full max-w-md px-4 mt-6">
            {(["nome", "endereco", "telefone", "senha"] as EditableField[]).map(field => (
              <div key={field} className="flex items-center justify-between border-b border-gray-200 py-3">
                <label className="capitalize w-1/3 text-gray-600">{field}</label>
                {isEditing[field] ? (
                  <div className="flex w-2/3 items-center">
                    <input
                      type={field === "senha" ? "password" : "text"}
                      value={userInfo[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      className="w-full border p-1 rounded text-sm"
                    />
                    <button onClick={handleSaveClick}>
                      <FiSave className="text-teal-600 text-lg ml-2" />
                    </button>
                  </div>
                ) : (
                  <div className="flex w-2/3 justify-between items-center">
                    <span className="text-sm text-gray-700 truncate">{userInfo[field]}</span>
                    <button onClick={() => handleEditClick(field)}>
                      <FiEdit className="text-gray-500 text-lg ml-2" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ConfigProfile;
