import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Upload, X } from "lucide-react";

interface ImageUploadProps {
    label: string;
    selectedFile: File | null;
    onChange: (file: File | null) => void;
    existingImage?: string | null;
    enableCamera?: boolean;
}

const ImageUpload = ({
    label,
    selectedFile,
    onChange,
    existingImage,
    enableCamera = false,
}: ImageUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [imageLoadFailed, setImageLoadFailed] = useState(false);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);

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

    useEffect(() => {
        if (!cameraOpen) return;

        let isActive = true;
        setCameraReady(false);
        const startCamera = async () => {
            if (!navigator.mediaDevices?.getUserMedia) {
                setCameraError("Este navegador no permite acceder a la cámara. Usa «Seleccionar imagen» para cargar una foto.");
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                if (!isActive) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                cameraStreamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
                setCameraError(null);
            } catch (error) {
                if (!isActive) return;
                cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
                cameraStreamRef.current = null;
                const errorObject = typeof error === "object" && error !== null ? error : null;
                const errorName = errorObject && "name" in errorObject ? String(errorObject.name) : "";
                const errorMessage = errorObject && "message" in errorObject ? String(errorObject.message) : "";
                const message = errorName === "NotAllowedError" || errorName === "SecurityError"
                    ? "No se concedió permiso para usar la cámara. Revisa los permisos del navegador."
                    : errorName === "NotFoundError"
                        ? "No se encontró una cámara conectada a este dispositivo."
                        : errorName === "NotReadableError"
                            ? "La cámara está ocupada por otra aplicación. Ciérrala e inténtalo de nuevo."
                            : errorMessage
                                ? `No se pudo iniciar la cámara: ${errorMessage}`
                                : "No se pudo iniciar la cámara. Comprueba que esté disponible e inténtalo de nuevo.";
                setCameraError(message);
            }
        };

        void startCamera();
        return () => {
            isActive = false;
            cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
            cameraStreamRef.current = null;
            if (videoRef.current) videoRef.current.srcObject = null;
        };
    }, [cameraOpen]);

    const capturePhoto = () => {
        const video = videoRef.current;
        if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
            setCameraError("La cámara todavía no está lista. Espera un momento e inténtalo de nuevo.");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) {
            setCameraError("No se pudo capturar la imagen. Inténtalo de nuevo.");
            return;
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (!blob) {
                setCameraError("No se pudo crear el archivo de imagen. Inténtalo de nuevo.");
                return;
            }
            onChange(new File([blob], `producto-${Date.now()}.jpg`, { type: "image/jpeg" }));
            setCameraOpen(false);
        }, "image/jpeg", 0.92);
    };

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
                            onChange={(event) => {
                                onChange(event.target.files?.[0] ?? null);
                                event.currentTarget.value = "";
                            }}
                        />
                    </label>
                    {enableCamera && (
                        <button
                            type="button"
                            onClick={() => {
                                setCameraError(null);
                                setCameraOpen(true);
                            }}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-teal-600 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:text-teal-300 dark:hover:bg-dark-base dark:focus:ring-offset-dark-elevated sm:ml-2 sm:mt-3"
                        >
                            <Camera size={16} />
                            Tomar foto
                        </button>
                    )}
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
            {cameraOpen && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setCameraOpen(false);
                    }}
                >
                    <div className="w-full max-w-xl rounded-xl bg-white p-4 shadow-2xl dark:bg-dark-card" role="dialog" aria-modal="true" aria-label="Tomar foto del producto">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-dark-primary">Tomar foto</h3>
                            <button
                                type="button"
                                onClick={() => setCameraOpen(false)}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-gray-300 dark:hover:bg-dark-elevated"
                                aria-label="Cerrar cámara"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            onPlaying={() => setCameraReady(true)}
                            className="aspect-video w-full rounded-lg bg-black object-contain"
                        />
                        {!cameraReady && !cameraError && (
                            <p className="mt-2 text-center text-sm text-gray-500 dark:text-dark-muted" role="status">
                                Conectando con la cámara...
                            </p>
                        )}
                        {cameraError && (
                            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200" role="alert">
                                {cameraError}
                            </p>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setCameraOpen(false)}
                                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:text-dark-primary dark:hover:bg-dark-elevated"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={capturePhoto}
                                disabled={!cameraReady || !!cameraError}
                                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-dark-card"
                            >
                                <Camera size={16} />
                                Capturar foto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
