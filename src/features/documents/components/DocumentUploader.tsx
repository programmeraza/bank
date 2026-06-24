'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatFileSize } from '../utils/fileHelpers';

interface DocumentUploaderProps {
  onFileUploaded: (fileData: { name: string; size: string; type: string; url: string }) => void;
  maxSizeMB?: number;
}

export default function DocumentUploader({
  onFileUploaded,
  maxSizeMB = 5,
}: DocumentUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateAndUpload = (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];

    // 1. Валидация типа файла
    if (!allowedTypes.includes(file.type)) {
      toast.error('Неверный формат файла. Разрешены только PDF, PNG и JPEG.');
      return;
    }

    // 2. Валидация размера файла
    if (file.size > maxSizeBytes) {
      toast.error(`Файл слишком большой. Максимальный размер: ${maxSizeMB} MB.`);
      return;
    }

    // Симуляция успешной загрузки и генерации локального URL
    const fileUrl = URL.createObjectURL(file);
    const fileExtension = file.name.split('.').pop() || 'PDF';

    onFileUploaded({
      name: file.name,
      size: formatFileSize(file.size),
      type: fileExtension.toUpperCase(),
      url: fileUrl,
    });

    toast.success('Файл успешно загружен в буфер');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/50'
            : 'border-zinc-300 hover:border-indigo-500 hover:bg-zinc-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileInput}
        />
        <Upload className="h-8 w-8 text-zinc-400 mb-2" />
        <p className="text-sm font-semibold text-zinc-800">Перетащите файл сюда или нажмите для выбора</p>
        <p className="text-xs text-zinc-500 mt-1">Форматы: PDF, PNG, JPEG. Макс. размер: {maxSizeMB} MB</p>
      </div>
    </div>
  );
}