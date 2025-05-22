
import React from "react";
import { Input } from "@/components/ui/input";

interface CampoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

const CampoInput = React.forwardRef<HTMLInputElement, CampoInputProps>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <Input ref={ref} className={error ? "border-red-500" : ""} {...props} />
      {error && <span className="text-xs text-red-500">Campo obrigatório</span>}
    </div>
  )
);

export default CampoInput;
