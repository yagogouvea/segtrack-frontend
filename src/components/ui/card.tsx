import React from "react";

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  return <div className={`bg-white rounded shadow ${className}`}>{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};