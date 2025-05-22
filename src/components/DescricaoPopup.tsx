import React, { useState } from "react";

interface Props {
  descricaoExistente: string;
  onSave: (descricao: string) => void;
  onClose: () => void;
}

const DescricaoPopup: React.FC<Props> = ({ descricaoExistente, onSave, onClose }) => {
  const [descricao, setDescricao] = useState(descricaoExistente);

  const handleSave = () => {
    if (typeof onSave === "function") {
      onSave(descricao);
    } else {
      console.error("onSave não é uma função!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Descrição da Ocorrência</h3>
        <textarea
          className="w-full h-40 border p-2 rounded resize-none"
          placeholder="Digite aqui a descrição..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default DescricaoPopup;