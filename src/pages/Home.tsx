import React from "react";
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const Home = () => {
  const cards = [
    {
      title: "Ocorrências Hoje",
      value: 12,
      icon: <Clock size={20} />,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Veículos Recuperados",
      value: 9,
      icon: <ShieldCheck size={20} />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Ocorrências em Aberto",
      value: 3,
      icon: <AlertTriangle size={20} />,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-5 rounded-2xl text-white shadow-lg hover:shadow-xl transition bg-gradient-to-br ${card.color}`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-light tracking-wide">{card.title}</h3>
            <div className="opacity-80">{card.icon}</div>
          </div>
          <p className="text-3xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
