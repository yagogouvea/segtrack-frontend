import React, { useState, useEffect } from "react";
import {
  Pencil,
  Clock,
  MapPin,
  User,
  Camera,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AutocompletePrestador from "../components/AutocompletePrestador";
import DespesasPopup from "../components/DespesasPopup"; // Novo import

const OcorrenciasDashboard = () => {
  const [ocorrencias, setOcorrencias] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [popupData, setPopupData] = useState<{ id: number; type: string } | null>(null);
  const [form, setForm] = useState<any>({ inicio: "", chegada: "", termino: "", kmInicial: "", kmFinal: "", prestador: "" });

  useEffect(() => {
    setOcorrencias([
      {
        id: 1,
        placa: "ABC-1234",
        cliente: "JBS",
        status: "Em andamento",
        inicio: "01/05/2025 12:00",
        chegada: "",
        termino: "",
        km: "",
        prestador: "",
        despesas: 0,
        fotos: false,
        descricao: false,
      },
      {
        id: 2,
        placa: "DEF-5678",
        cliente: "Marfrig",
        status: "Em andamento",
        inicio: "",
        chegada: "",
        termino: "",
        km: "",
        prestador: "",
        despesas: 0,
        fotos: false,
        descricao: false,
      },
    ]);
    setHistorico([
      {
        id: 3,
        placa: "XYZ-9999",
        cliente: "Coamo",
        status: "Recuperado",
        inicio: "01/05/2025 08:00",
        chegada: "01/05/2025 08:30",
        termino: "01/05/2025 09:30",
        km: "20",
        prestador: "José",
        despesas: 50,
        fotos: true,
        descricao: true,
      },
    ]);
  }, []);

  const parseDateTime = (input: string) => {
    if (!input) return "";
    const [date, time] = input.split(" ");
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}T${time}`;
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["kmInicial", "kmFinal"].includes(name)) {
      setForm((prev: any) => ({ ...prev, [name]: value }));
      return;
    }
    const dateObj = new Date(value);
    if (!isNaN(dateObj.getTime())) {
      const formatted = `${dateObj.toLocaleDateString("pt-BR")} ${dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
      setForm((prev: any) => ({ ...prev, [name]: formatted }));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const savePopupData = () => {
    if (!popupData) return;
    setOcorrencias((prev) =>
      prev.map((oc) => {
        if (oc.id !== popupData.id) return oc;
        switch (popupData.type) {
          case "horarios":
            return { ...oc, inicio: form.inicio, chegada: form.chegada, termino: form.termino };
          case "km":
            const km = form.kmInicial && form.kmFinal ? `${parseInt(form.kmFinal) - parseInt(form.kmInicial)}` : "";
            return { ...oc, km };
          case "prestador":
            return { ...oc, prestador: form.prestador };
          default:
            return oc;
        }
      })
    );
    setPopupData(null);
    setForm({ inicio: "", chegada: "", termino: "", kmInicial: "", kmFinal: "", prestador: "" });
  };

  const renderOcorrencias = (data: any[]) => (
    <table className="min-w-full text-sm">
      <thead className="text-gray-600 text-xs uppercase border-b">
        <tr>
          <th className="px-4 py-2 text-left">Placa</th>
          <th className="px-4 py-2 text-left">Cliente</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Início</th>
          <th className="px-4 py-2 text-left">Chegada</th>
          <th className="px-4 py-2 text-left">Término</th>
          <th className="px-4 py-2 text-left">Km</th>
          <th className="px-4 py-2 text-left">Prestador</th>
          <th className="px-4 py-2 text-left">Despesas</th>
          <th className="px-4 py-2 text-left">Etapas</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((oc) => (
          <tr key={oc.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 font-semibold text-gray-900">{oc.placa}</td>
            <td className="px-4 py-3 text-gray-700">{oc.cliente}</td>
            <td className="px-4 py-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300 ${oc.status === "Em andamento" ? "bg-yellow-100 text-yellow-800" : oc.status === "Recuperado" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{oc.status}</span>
            </td>
            <td className="px-4 py-3">{oc.inicio || "–"}</td>
            <td className="px-4 py-3">{oc.chegada || "–"}</td>
            <td className="px-4 py-3">{oc.termino || "–"}</td>
            <td className="px-4 py-3">{oc.km || "–"}</td>
            <td className="px-4 py-3">{oc.prestador || "–"}</td>
            <td className="px-4 py-3">{oc.despesas ? `R$ ${oc.despesas}` : "–"}</td>
            <td className="px-4 py-3 flex gap-2 flex-wrap">
              <button title="Horários" onClick={() => { setPopupData({ id: oc.id, type: "horarios" }); setForm({ ...form, inicio: oc.inicio, chegada: oc.chegada, termino: oc.termino }); }} className="text-blue-600 hover:text-blue-800"><Clock size={18} /></button>
              <button title="Odômetro" onClick={() => { setPopupData({ id: oc.id, type: "km" }); setForm({ ...form, kmInicial: "", kmFinal: "" }); }} className="text-blue-600 hover:text-blue-800"><MapPin size={18} /></button>
              <button title="Prestador" onClick={() => { setPopupData({ id: oc.id, type: "prestador" }); setForm({ ...form, prestador: "" }); }} className="text-blue-600 hover:text-blue-800"><User size={18} /></button>
              <DespesasPopup id={oc.id} setOcorrencias={setOcorrencias} />
              <button title="Fotos" className={`hover:text-blue-800 ${oc.fotos ? "text-green-600" : "text-blue-600"}`}><Camera size={18} /></button>
              <button title="Descrição" className={`hover:text-blue-800 ${oc.descricao ? "text-green-600" : "text-blue-600"}`}><Pencil size={18} /></button>
              <button title="Recuperado" className="text-green-600 hover:text-green-800"><CheckCircle size={18} /></button>
              <button title="Não Recuperado" className="text-red-600 hover:text-red-800"><XCircle size={18} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-gray-800">Ocorrências em Andamento</h1>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        {renderOcorrencias(ocorrencias)}
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-2">Finalizadas (últimas 24h)</h2>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow border border-gray-200">
        {renderOcorrencias(historico)}
      </div>

      {popupData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {popupData.type === "horarios" ? "Horários" : popupData.type === "km" ? "Odômetro" : "Selecionar Prestador"}
            </h3>
            <div className="space-y-3">
              {popupData.type === "horarios" && (
                <>
                  <input type="datetime-local" name="inicio" value={parseDateTime(form.inicio)} onChange={handleFieldChange} className="w-full border p-2 rounded" />
                  <input type="datetime-local" name="chegada" value={parseDateTime(form.chegada)} onChange={handleFieldChange} className="w-full border p-2 rounded" />
                  <input type="datetime-local" name="termino" value={parseDateTime(form.termino)} onChange={handleFieldChange} className="w-full border p-2 rounded" />
                </>
              )}
              {popupData.type === "km" && (
                <>
                  <input type="number" name="kmInicial" placeholder="KM Inicial" value={form.kmInicial} onChange={handleFieldChange} className="w-full border p-2 rounded" />
                  <input type="number" name="kmFinal" placeholder="KM Final" value={form.kmFinal} onChange={handleFieldChange} className="w-full border p-2 rounded" />
                </>
              )}
              {popupData.type === "prestador" && (
                <AutocompletePrestador onSelect={(nome: string) => setForm((prev: any) => ({ ...prev, prestador: nome }))} />
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPopupData(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancelar</button>
              <button onClick={savePopupData} className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcorrenciasDashboard;
