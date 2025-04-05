export default function ModalPolitica({ onClose }: { onClose: () => void }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center px-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4">
          <h2 className="text-xl font-bold text-center">Política de Privacidade</h2>
          <p className="text-sm text-gray-700 overflow-y-auto max-h-[60vh]">
            Sua política de privacidade pode conter como os dados dos usuários são armazenados, quem tem acesso, se são compartilhados com terceiros, e como o usuário pode solicitar a exclusão dos seus dados, etc.
          </p>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }
  