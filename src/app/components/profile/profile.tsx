'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProfileProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isOpen, onRequestClose }) => {
  const [profile, setProfile] = useState({
    nome: '',
    email: '',
    telefone: '',
    sexo: '',
    nascimento: '',
    cpf: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    complemento: '',
    foto: null as string | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, foto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(profile);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-[95%] max-w-3xl bg-white rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex flex-col items-center">
          <label
            htmlFor="fotoInput"
            className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer text-gray-500 mb-6 hover:shadow-md transition"
          >
            <input
              type="file"
              id="fotoInput"
              accept="image/*"
              onChange={handleFotoChange}
              className="hidden"
            />
            {profile.foto ? (
              <Image
                src={profile.foto}
                alt="Foto de perfil"
                fill
                className="object-cover rounded-full"
                unoptimized
              />
            ) : (
              'Adicionar foto'
            )}
          </label>

          <form onSubmit={handleSubmit} className="w-full animate-fade-in">
            <div className="flex flex-wrap gap-4 mb-4">
              <Input name="nome" value={profile.nome} onChange={handleChange} placeholder="Nome e sobrenome" />
              <Input name="email" value={profile.email} onChange={handleChange} placeholder="E-mail" />
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <Input name="telefone" value={profile.telefone} onChange={handleChange} placeholder="Telefone" />
              <Input name="sexo" value={profile.sexo} onChange={handleChange} placeholder="Sexo" />
              <Input type="date" name="nascimento" value={profile.nascimento} onChange={handleChange} placeholder="Nascimento" />
            </div>

            <div className="mb-4">
              <Input name="cpf" value={profile.cpf} onChange={handleChange} placeholder="CPF" />
            </div>

            <div className="mb-4">
              <Input name="endereco" value={profile.endereco} onChange={handleChange} placeholder="Endereço" />
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              <Input name="numero" value={profile.numero} onChange={handleChange} placeholder="Número" />
              <Input name="bairro" value={profile.bairro} onChange={handleChange} placeholder="Bairro" />
              <Input name="cidade" value={profile.cidade} onChange={handleChange} placeholder="Cidade" />
              <Input name="estado" value={profile.estado} onChange={handleChange} placeholder="Estado" />
            </div>

            <div className="mb-6">
              <Input name="complemento" value={profile.complemento} onChange={handleChange} placeholder="Complemento" />
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
              >
                Atualizar
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </Modal>
  );
};

export default Profile;

// Reusable input component (pode ser movido pra um arquivo separado se quiser)
const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="flex-1 min-w-[45%] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
  />
);
