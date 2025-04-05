"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdArrowBack, MdFavorite } from "react-icons/md";
import { motion } from "framer-motion";

const HeaderLike = () => {
  const [likes, setLikes] = useState(0);
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const handleLikeClick = () => {
    setLikes((prev) => prev + 1);
  };

  return (
    <div className="absolute top-0 left-0 z-10 w-full flex justify-between items-center p-4">
      {/* Botão Voltar */}
      <motion.button
        onClick={handleBackClick}
        whileTap={{ scale: 0.9 }}
        aria-label="Voltar"
        className="bg-white rounded-full p-2 shadow-md text-gray-800 hover:bg-gray-100 transition"
      >
        <MdArrowBack size={24} />
      </motion.button>

      {/* Botão Curtir */}
      <motion.button
        onClick={handleLikeClick}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        aria-label="Curtir"
        className="bg-white rounded-full p-2 shadow-md flex items-center gap-2 text-red-600 hover:bg-gray-100 transition"
      >
        <MdFavorite size={24} />
        <motion.span
          key={likes}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-sm font-semibold text-slate-700"
        >
          {likes}
        </motion.span>
      </motion.button>
    </div>
  );
};

export default HeaderLike;
