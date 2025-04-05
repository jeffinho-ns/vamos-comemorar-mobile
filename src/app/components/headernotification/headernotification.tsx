"use client";

import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { Bell } from "lucide-react";

const HeaderNotification = () => {
  const router = useRouter();

  const handleBackClick = () => {
    window.history.back();
  };

  const handleNotificationClick = () => {
    router.push("/notifications");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 bg-white shadow-md">
      <button
        onClick={handleBackClick}
        className="text-gray-800 hover:text-gray-600 transition-colors"
      >
        <MdArrowBack size={24} />
      </button>

      <button
        onClick={handleNotificationClick}
        className="text-gray-800 hover:text-gray-600 transition-colors"
      >
        <Bell size={24} />
      </button>
    </div>
  );
};

export default HeaderNotification;
