import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadService } from '../services/uploadService';
import toast from 'react-hot-toast';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    onRemove?: () => void;
    currentImage?: string;
    tipo?: 'evento' | 'produto' | 'categoria' | 'geral';
    eventoId?: string;
    maxWidth?: number;
    maxHeight?: number;
    className?: string;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onUpload,
    onRemove,
    currentImage,
    tipo = 'geral',
    eventoId,
    maxWidth = 800,
    maxHeight = 600,
    className = '',
    disabled = false
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
        if (disabled) return;

        // Validar arquivo
        const validacao = uploadService.validarImagem(file);
        if (!validacao.valido) {
            toast.error(validacao.erro || 'Arquivo inválido');
            return;
        }

        setIsUploading(true);

        try {
            // Redimensionar imagem se necessário
            const fileRedimensionado = await uploadService.redimensionarImagem(file, maxWidth, maxHeight);

            // Fazer upload
            let response;
            if (tipo === 'evento') {
                response = await uploadService.uploadEventoLogo(fileRedimensionado);
            } else if (tipo === 'produto' && eventoId) {
                response = await uploadService.uploadProdutoImagem(fileRedimensionado, eventoId);
            } else {
                response = await uploadService.uploadImagem(fileRedimensionado, tipo);
            }

            if (response.success && response.data) {
                onUpload(response.data.url);
                toast.success('Imagem enviada com sucesso!');
            } else {
                throw new Error(response.message || 'Erro no upload');
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao fazer upload da imagem');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleRemoveImage = async () => {
        if (disabled || !currentImage) return;

        try {
            await uploadService.removerImagem(currentImage);
            onRemove?.();
            toast.success('Imagem removida com sucesso!');
        } catch (error: any) {
            toast.error(error.message || 'Erro ao remover imagem');
        }
    };

    const openFileDialog = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={disabled}
            />

            {currentImage ? (
                <div className="relative group">
                    <img
                        src={currentImage}
                        alt="Imagem atual"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    {!disabled && (
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-sm text-gray-600">Enviando imagem...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="p-3 bg-gray-100 rounded-full mb-4">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Clique para selecionar ou arraste uma imagem aqui
                            </p>
                            <p className="text-xs text-gray-500">
                                JPG, PNG, GIF ou WebP (máx. 5MB)
                            </p>
                        </div>
                    )}
                </div>
            )}

            {isUploading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Enviando...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
