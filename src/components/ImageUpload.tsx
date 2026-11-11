import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

interface ImageUploadProps {
    label: string;
    selectedFile: File | null;
    onChange: (file: File | null) => void;
    existingImage?: string | null;
}

const ImageUpload = ({
    label,
    selectedFile,
    onChange,
    existingImage,
}: ImageUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [imageLoadFailed, setImageLoadFailed] = useState(false);

    useEffect(() => {
        if (!selectedFile) {
            setSelectedImageUrl(null);
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        const imageUrl = URL.createObjectURL(selectedFile);
        setSelectedImageUrl(imageUrl);

        return () => URL.revokeObjectURL(imageUrl);
    }, [selectedFile]);

    const existingImageUrl = existingImage
        ? new URL(existingImage, import.meta.env.VITE_BASE_URL).toString()
        : null;
    const previewUrl = selectedImageUrl || existingImageUrl;

    useEffect(() => {
        setImageLoadFailed(false);
    }, [previewUrl]);

    return (
        <div className="md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-dark-primary">
                {label}
            </span>
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-dark-elevated sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-dark-card">
                    {previewUrl && !imageLoadFailed ? (
                        <img
                            src={previewUrl}
                            alt="Vista previa de imagen"
                            className="h-full w-full object-cover"
                            onError={() => setImageLoadFailed(true)}
                        />
                    ) : (
                        <ImagePlus className="text-gray-400 dark:text-gray-500" size={32} />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800 dark:text-dark-primary">
                        {selectedFile?.name || (existingImage ? "Imagen actual" : "Sin imagen seleccionada")}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Formatos de imagen compatibles. Selecciona una imagen para cargarla.
                    </p>
                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-dark-elevated">
                        <Upload size={16} />
                        {selectedFile ? "Cambiar imagen" : existingImage ? "Reemplazar imagen" : "Seleccionar imagen"}
                        <input
                            ref={inputRef}
                            className="sr-only"
                            type="file"
                            accept="image/*"
                            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                        />
                    </label>
                    {selectedFile && (
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="ml-2 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <X size={16} />
                            Quitar selección
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
