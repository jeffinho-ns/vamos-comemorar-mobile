"use client";

import Image from "next/image";
import logoWhite from "../../app/assets/logo_blue.png";
import { useState } from "react";
import Link from "next/link";
import ModalTermos from "../components/ModalTermos/ModalTermos";
import ModalPolitica from "../components/ModalPolitica/ModalPolitica";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_LOCAL;

export default function Register() {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOver18, setIsOver18] = useState(false);
  const [error, setError] = useState("");
  const [showTermos, setShowTermos] = useState(false);
  const [showPolitica, setShowPolitica] = useState(false);

  const handleSubmit = async () => {
    setError("");

    const cpfRegex = /^\d{11}$/;
const whatsappRegex = /^\d{10,11}$/;



    if (!name || !birthdate || !email || !cpf || !whatsapp || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    if (age < 18) {
      setError("Você precisa ter mais de 18 anos.");
      return;
    }

    const cleanCPF = cpf.replace(/\D/g, "");
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    if (cleanCPF.length !== 11) {
      setError("CPF inválido. Deve conter 11 dígitos.");
      return;
    }

    if (cleanWhatsapp.length < 10 || cleanWhatsapp.length > 11) {
      setError("Número de WhatsApp inválido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!isOver18) {
      setError("Você precisa aceitar os termos e a política.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthdate,
          email,
          cpf: cleanCPF,
          whatsapp: cleanWhatsapp,
          password,
        }),
      });

      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || "Erro ao cadastrar.");
        return;
      }

      alert("Cadastro realizado com sucesso!");
      // Redirecionar ou limpar formulário se quiser
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex justify-center">
          <Link href="/">
            <Image src={logoWhite} alt="Logo" className="h-16 w-auto" />
          </Link>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome completo"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="date"
            placeholder="Data de nascimento"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

<input
  type="text"
  placeholder="CPF"
  className="w-full p-3 border border-gray-300 rounded-lg"
  value={cpf}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
    setCpf(formatted);
  }}
/>

<input
  type="text"
  placeholder="WhatsApp"
  className="w-full p-3 border border-gray-300 rounded-lg"
  value={whatsapp}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const formatted = raw
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
    setWhatsapp(formatted);
  }}
/>


          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={isOver18}
              onChange={() => setIsOver18(!isOver18)}
              className="mt-1"
            />
            <span>
              Declaro ser maior de 18 anos e aceito os{" "}
              <button
                type="button"
                onClick={() => setShowTermos(true)}
                className="text-blue-600 underline"
              >
                Termos de Uso
              </button>{" "}
              e{" "}
              <button
                type="button"
                onClick={() => setShowPolitica(true)}
                className="text-blue-600 underline"
              >
                Política de Privacidade
              </button>
              .
            </span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700"
          >
            Cadastrar
          </button>

          <p className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-600 underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>

      {showTermos && <ModalTermos onClose={() => setShowTermos(false)} />}
      {showPolitica && <ModalPolitica onClose={() => setShowPolitica(false)} />}
    </div>
  );
}
