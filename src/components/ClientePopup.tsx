import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  onClose: () => void;
  onSave: () => void;
  clienteEdicao?: any | null;
}

const formatCNPJ = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const formatCurrency = (value: string) => {
  const numeric = value.replace(/[^\d]/g, "");
  return (Number(numeric) / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const formatHour = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(\d{2})(\d{2})/, "$1:$2");
};

const ClientePopup: React.FC<Props> = ({ onClose, onSave, clienteEdicao }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nome: clienteEdicao?.nome || "",
      cnpj: clienteEdicao?.cnpj || "",
      contato: clienteEdicao?.contato || "",
      telefone: clienteEdicao?.telefone || "",
      email: clienteEdicao?.email || "",
      endereco: clienteEdicao?.endereco || "",
      contratos: clienteEdicao?.contratos || [],
    },
    
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contratos",
  });

  const watchCNPJ = watch("cnpj");

  useEffect(() => {
    if (clienteEdicao) {
      reset(clienteEdicao);
    }
  }, [clienteEdicao, reset]);

  useEffect(() => {
    const buscarDados = async () => {
      if (clienteEdicao) return; // Não buscar se for edição
  
      const cnpjLimpo = watchCNPJ.replace(/\D/g, "");
      if (cnpjLimpo.length === 14) {
        try {
          const res = await fetch(`https://open.cnpja.com/office/${cnpjLimpo}`);
          if (!res.ok) throw new Error("Erro na API CNPJá");
          const data = await res.json();
  
          setValue("nome", data.company?.name || "");
  
          const endereco = data.address;
          if (endereco) {
            const enderecoFormatado = [
              endereco.street,
              endereco.number,
              endereco.district,
              endereco.city,
              endereco.state,
              endereco.zip ? `CEP: ${endereco.zip}` : ""
            ].filter(Boolean).join(", ");
            setValue("endereco", enderecoFormatado);
          }
        } catch (e) {
          console.error("Erro ao buscar CNPJ:", e);
        }
      }
    };
    buscarDados();
  }, [watchCNPJ, setValue, clienteEdicao]);
  

  const onSubmit = async () => {
    const values = getValues();
    try {
      const res = await fetch(`http://localhost:3001/api/clientes${clienteEdicao?.id ? `/${clienteEdicao.id}` : ''}`, {
        method: clienteEdicao?.id ? "PUT" : "POST",
      
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Erro ao salvar cliente");
      alert("Cliente salvo com sucesso!");
      onSave();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar cliente");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-4xl mt-10 mb-10">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            {clienteEdicao ? "Editar Cliente" : "Cadastrar Novo Cliente"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>CNPJ</label>
                <Input
                  {...register("cnpj")}
                  onChange={(e) => setValue("cnpj", formatCNPJ(e.target.value))}
                  value={watch("cnpj") || ""}

                />
              </div>
              <div>
                <label>Razão Social</label>
                <Input {...register("nome")} />
              </div>
            </div>

            <div>
              <label>Endereço</label>
              <Input {...register("endereco")} disabled />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label>Contato</label>
                <Input {...register("contato")} />
              </div>
              <div>
                <label>Telefone</label>
                <Input
                  {...register("telefone")}
                  onChange={(e) => setValue("telefone", formatPhone(e.target.value))}
                  value={watch("telefone") || ""}

                />
              </div>
              <div>
                <label>Email</label>
                <Input type="email" {...register("email")} />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="font-semibold mb-2">Contratos</h3>
              {fields.map((field, index) => {
                const tipo = watch(`contratos.${index}.tipo`);
                return (
                  <div key={field.id} className="border p-4 mb-4 rounded-md">
                    <label>Nome do Contrato</label>
                    <Input {...register(`contratos.${index}.nome_interno`)} className="mb-2" />

                    <label>Tipo</label>
                    <select defaultValue="" {...register(`contratos.${index}.tipo`)} className="mb-2 w-full border p-2 rounded">
                      <option value="">Selecione um tipo</option>
                      <option value="acionamento">Acionamento + Franquia</option>
                      <option value="fixo">Valor Fixo</option>
                    </select>

                    {tipo === "acionamento" && (
                      <>
                        <label>Região</label>
                        <select {...register(`contratos.${index}.regiao`)} className="mb-2 w-full border p-2 rounded">
                          <option value="sp">São Paulo e Grande São Paulo</option>
                          <option value="interior">Interior</option>
                          <option value="outros">Outros Estados</option>
                          <option value="brasil">Nível Brasil</option>
                        </select>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <Input placeholder="Valor Acionamento"
                            {...register(`contratos.${index}.valor_acionamento`)}
                            onChange={(e) => setValue(`contratos.${index}.valor_acionamento`, formatCurrency(e.target.value))} />

                          <Input placeholder="Hora Extra (R$)"
                            {...register(`contratos.${index}.valor_hora_extra`)}
                            onChange={(e) => setValue(`contratos.${index}.valor_hora_extra`, formatCurrency(e.target.value))} />

                          <Input placeholder="KM Extra (R$)"
                            {...register(`contratos.${index}.valor_km_extra`)}
                            onChange={(e) => setValue(`contratos.${index}.valor_km_extra`, formatCurrency(e.target.value))} />

                          <Input placeholder="Franquia Horas"
                            {...register(`contratos.${index}.franquia_horas`)}
                            onChange={(e) => setValue(`contratos.${index}.franquia_horas`, formatHour(e.target.value))} />

                          <Input placeholder="Franquia KM"
                            {...register(`contratos.${index}.franquia_km`)} />
                        </div>
                      </>
                    )}

                    {tipo === "fixo" && (
                      <Input placeholder="Valor Fixo"
                        {...register(`contratos.${index}.valor_acionamento`)}
                        onChange={(e) => setValue(`contratos.${index}.valor_acionamento`, formatCurrency(e.target.value))} />
                    )}

                    <div className="flex justify-end mt-2">
                      <Button type="button" variant="destructive" onClick={() => remove(index)}>Remover</Button>
                    </div>
                  </div>
                );
              })}
              <Button type="button" onClick={() => append({})} className="mt-2">+ Adicionar Contrato</Button>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" onClick={onClose} variant="default">
                Cancelar
              </Button>
              <Button type="submit" variant="destructive">
                Salvar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientePopup;