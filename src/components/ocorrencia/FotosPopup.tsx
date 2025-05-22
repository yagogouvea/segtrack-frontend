
// FotosPopup com melhorias aplicadas: tipagem corrigida, preview garantido, otimização de chamadas e UX aprimorada
import React, { useRef, useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/cropImage";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const stripHtml = (html: string) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

const convertUrlToObjectUrl = async (url: string) => {
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};

const API_URL = (import.meta as any).env.VITE_API_URL;

interface FotoItem {
  id?: number;
  file?: File;
  url: string;
  legenda: string;
  preview?: string;
}

interface FotosPopupProps {
  ocorrencia: any;
  onUpdate: (ocorrenciaAtualizada: any) => void;
  onClose: () => void;
}

const FotosPopup: React.FC<FotosPopupProps> = ({ ocorrencia, onUpdate, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreas, setCroppedAreas] = useState<Record<number, Area>>({});
  const [modoRevisao, setModoRevisao] = useState(false);
  const [croppedPreviews, setCroppedPreviews] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editandoCropIndex, setEditandoCropIndex] = useState<number | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFotos(prev => {
        const updated = [...prev];
        if (updated[currentIndex]) updated[currentIndex].legenda = html;
        return updated;
      });
    },
  });

  useEffect(() => {
    if (editandoCropIndex !== null && fotos[editandoCropIndex]) {
      setCurrentIndex(editandoCropIndex);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [editandoCropIndex, fotos]);

  const saveCurrentLegenda = () => {
    if (!editor) return;
    const html = editor.getHTML();
    setFotos((prev) => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = {
          ...updated[currentIndex],
          legenda: html,
        };
      }
      return updated;
    });
  };

  const handleAnterior = () => {
    if (currentIndex === 0) return;
    saveCurrentLegenda();
    const prev = currentIndex - 1;
    setCurrentIndex(prev);
    editor?.commands.setContent(fotos[prev]?.legenda || '');
  };

  const handleProxima = () => {
    if (currentIndex >= fotos.length - 1) return;
    saveCurrentLegenda();
    const next = currentIndex + 1;
    setCurrentIndex(next);
    editor?.commands.setContent(fotos[next]?.legenda || '');
  };

  const previousIndex = useRef(0);

  useEffect(() => {
    if (!editor) return;
    setFotos((prev) => {
      const updated = [...prev];
      if (updated[previousIndex.current]) {
        updated[previousIndex.current].legenda = editor.getHTML();
      }
      return updated;
    });
    if (fotos[currentIndex]) {
      editor.commands.setContent(fotos[currentIndex].legenda || '');
    }
    previousIndex.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const res = await fetch(`${API_URL}/ocorrencias/${ocorrencia.id}/fotos`);
        const data: FotoItem[] = await res.json();
        const baseURL = API_URL.replace('/api', '');

        const fotosCorrigidas = await Promise.all(
          data.map(async (f) => {
            const fullUrl = f.url.startsWith('/uploads') ? `${baseURL}${f.url}` : f.url;
            const objectUrl = await convertUrlToObjectUrl(fullUrl);
            return {
              ...f,
              url: objectUrl,
            };
          })
        );

        setFotos(fotosCorrigidas);
        setCurrentIndex(0);
        previousIndex.current = 0;

        if (editor && fotosCorrigidas.length > 0) {
          editor.commands.setContent(fotosCorrigidas[0].legenda || '');
        }

        setCroppedPreviews(fotosCorrigidas.map(f => f.url));
      } catch (err) {
        console.error("Erro ao carregar fotos:", err);
      }
    };

    fetchFotos();
  }, [ocorrencia.id, editor]);

  const updateCroppedPreview = async (foto: FotoItem, index: number) => {
    if (croppedAreas[index]) {
      const croppedDataUrl = await getCroppedImg(foto.url, croppedAreas[index], 'dataUrl') as string;
      setCroppedPreviews(prev => {
        const copy = [...prev];
        copy[index] = croppedDataUrl;
        return copy;
      });
    }
  };

  const generateAllPreviews = async () => {
    const previews = await Promise.all(fotos.map(async (foto, i) => {
      if (croppedAreas[i]) {
        return await getCroppedImg(foto.url, croppedAreas[i]);
      }
      return foto.url;
    }));
    setCroppedPreviews(previews as string[]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file): file is File => file instanceof File && file.type.startsWith("image/")
    );
    const previews = await Promise.all(files.map(async (file) => {
      const objectUrl = URL.createObjectURL(file);
      return {
        file,
        url: objectUrl,
        legenda: ""
      };
    }));

    if (previews.length > 0) {
      setFotos(prev => [...prev, ...previews]);
      setCroppedPreviews(prev => [...prev, ...previews.map(p => p.url)]);
      if (fotos.length === 0) {
        editor?.commands.setContent(previews[0].legenda || '');
        setCurrentIndex(0);
      }
      setModoRevisao(false);
    }
  };

  const handleRemover = async (index?: number) => {
    const removeIndex = index !== undefined ? index : currentIndex;
    const foto = fotos[removeIndex];

    if (foto.id) {
      try {
        await fetch(`${API_URL}/fotos/${foto.id}`, { method: 'DELETE' });
      } catch (err) {
        console.error('Erro ao deletar foto no backend:', err);
      }
    }

    const atualizadas = fotos.filter((_, i) => i !== removeIndex);
    setFotos(atualizadas);
    setCroppedPreviews(prev => prev.filter((_, i) => i !== removeIndex));
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleSalvar = async () => {
    if (fotos.length === 0) return;
    setIsSaving(true);

    try {
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        if (foto.id) {
          await fetch(`${API_URL}/fotos/${foto.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ legenda: foto.legenda }),
          });
        }
      }

      const formData = new FormData();
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        if (foto.file) {
          let blob: Blob = foto.file;
          if (croppedAreas[i]) {
            blob = await getCroppedImg(foto.url, croppedAreas[i], 'blob') as unknown as Blob;
          }
          formData.append("imagens", blob);
          formData.append("legendas", foto.legenda);
        }
      }

      if (formData.has("imagens")) {
        const response = await fetch(`${API_URL}/ocorrencias/${ocorrencia.id}/fotos`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Falha ao enviar imagens.");
      }

      const res = await fetch(`${API_URL}/ocorrencias/${ocorrencia.id}`);
      const ocorrenciaAtualizada = await res.json();
      onUpdate(ocorrenciaAtualizada);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar fotos:", err);
      alert("Erro ao processar as fotos.");
    } finally {
      setIsSaving(false);
    }
  };

  const onCropComplete = useCallback(async (_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreas(prev => ({ ...prev, [currentIndex]: croppedPixels }));
    await updateCroppedPreview(fotos[currentIndex], currentIndex);
  }, [currentIndex, fotos]);

  const currentFoto = fotos[currentIndex];


 return (
  <div className="fotos-popup w-full max-w-[1000px] h-auto bg-white rounded-lg shadow-lg flex flex-col mx-auto">
    <DialogTitle className="sr-only">Editor de Fotos</DialogTitle>
    <DialogDescription className="sr-only">
      Editor para adicionar, remover ou visualizar fotos da ocorrência
    </DialogDescription>

    <div className="p-6 border-b text-center flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-gray-800">📸 Anexar Fotos da Ocorrência</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="px-6 py-3 text-lg font-semibold bg-black text-white hover:bg-gray-800"
      >
        Selecionar Fotos
      </Button>
    </div>

    {currentFoto?.url && !modoRevisao && (
      <div className="flex flex-col md:flex-row px-6 py-4 gap-6 items-center justify-center">
        <div className="w-full md:w-[400px] h-[300px] flex items-center justify-center bg-gray-100 rounded-xl shadow-inner">
          <div className="relative w-full h-full">
            <Cropper
              key={currentFoto.url}
              image={currentFoto.url}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>

        <div className="w-full md:w-[400px] flex flex-col gap-4">
          <label className="text-center text-base font-semibold text-gray-800">Legenda</label>
          <div className="border-2 border-gray-400 rounded-lg bg-gray-50 px-3 py-2 shadow-inner min-h-[160px] cursor-text">
            <EditorContent
              editor={editor}
              className="min-h-[140px] [&_div]:min-h-[120px] [&_div]:py-2"
            />
          </div>

          <Button
            variant="destructive"
            className="w-full mt-6"
            onClick={() => handleRemover()}
          >
            Remover
          </Button>
        </div>
      </div>
    )}

    <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
      <div className="space-x-2">
        <Button
          disabled={currentIndex === 0}
          onClick={() => {
            saveCurrentLegenda();
            const prev = currentIndex - 1;
            setCurrentIndex(prev);
            editor?.commands.setContent(fotos[prev]?.legenda || '');
          }}
        >
          Anterior
        </Button>

        <Button
          disabled={currentIndex >= fotos.length - 1}
          onClick={() => {
            saveCurrentLegenda();
            const next = currentIndex + 1;
            setCurrentIndex(next);
            editor?.commands.setContent(fotos[next]?.legenda || '');
          }}
        >
          Próxima
        </Button>
      </div>

      <div className="flex gap-2">
        {fotos.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              saveCurrentLegenda();
              generateAllPreviews();
              setModoRevisao(true);
            }}
          >
            Pré-visualizar
          </Button>
        )}
        <DialogClose asChild>
          <Button variant="default" onClick={handleSalvar} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogClose>
      </div>
    </div>

    {modoRevisao && editandoCropIndex === null && (
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold">🔍 Pré-visualização das Fotos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fotos.map((foto, index) => (
            <div key={index} className="border p-2 rounded shadow bg-gray-50">
              <img
                src={croppedPreviews[index] || foto.url}
                alt={`Foto ${index + 1}`}
                className="w-full h-auto mb-2 rounded"
              />

              <Button
                size="sm"
                variant="ghost"
                className="w-full mb-2"
                onClick={() => {
                  setCurrentIndex(index);
                  setEditandoCropIndex(index);
                  setModoRevisao(false);
                }}
              >
                ✂️ Editar Crop
              </Button>

              <textarea
                className="w-full p-2 border rounded text-sm"
                placeholder="Digite a legenda da imagem..."
                value={stripHtml(foto.legenda || '')}
                onChange={(e) => {
                  const novasFotos = [...fotos];
                  novasFotos[index].legenda = e.target.value;
                  setFotos(novasFotos);
                }}
              />

              <div className="flex justify-between mt-2 text-sm">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCurrentIndex(index);
                    editor?.commands.setContent(foto.legenda || '');
                    setModoRevisao(false);
                  }}
                >
                  Editar com Rich Text
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemover(index)}
                >
                  🗑️ Remover
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={() => setModoRevisao(false)}>Voltar</Button>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
          <Button variant="default" onClick={handleSalvar} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
    )}
  </div>
);

};

export default FotosPopup;
