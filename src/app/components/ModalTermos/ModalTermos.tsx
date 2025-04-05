export default function ModalTermos({ onClose }: { onClose: () => void }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center px-4">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4">
          <h2 className="text-xl font-bold text-center">Termos de Uso</h2>
          <p className="text-sm text-gray-700 overflow-y-auto max-h-[60vh]">
            Aqui você pode adicionar seus termos de uso. Informe que o uso da plataforma é apenas para maiores de idade e que os dados cadastrados são verdadeiros, e que o uso indevido pode acarretar em punições, etc.
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
  