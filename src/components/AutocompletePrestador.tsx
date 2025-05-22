import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jxwnhwksqasyzdcdzguc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4d25od2tzcWFzeXpkY2R6Z3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjM0MzYsImV4cCI6MjA2MTYzOTQzNn0.lrgDMOvSdtiswoe5r6i8f4gsgOLK2_Z2ES_-V90CeL4"
);

interface AutocompletePrestadorProps {
  onSelect: (nome: string) => void;
}

const AutocompletePrestador: React.FC<AutocompletePrestadorProps> = ({ onSelect }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (input.length < 2) return;

      const { data, error } = await supabase
        .from("prestadores")
        .select("nome, codinome")
        .or(`nome.ilike.%${input}%,codinome.ilike.%${input}%`);

      const mock = [
        { nome: "Yago Gouvea", codinome: "manoel" }
      ];

      if (!error) {
        const combined = [...mock, ...(data || [])];
        setResults(combined);
      } else {
        setResults(mock);
      }
    };

    fetchData();
  }, [input]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Buscar prestador..."
        className="w-full border p-2 rounded"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 bg-white shadow border rounded w-full max-h-48 overflow-y-auto mt-1">
          {results.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                onSelect(item.nome);
                setInput("");
                setResults([]);
              }}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {item.nome} – {item.codinome}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompletePrestador;
