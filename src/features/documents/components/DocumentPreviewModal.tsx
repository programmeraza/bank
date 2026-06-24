'use client';

import React from 'react';
import { X, FileText, Download } from 'lucide-react';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl: string; // В реальном приложении это может быть blob-url или ссылка на S3
  fileType: string;
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  fileName,
  fileUrl,
  fileType,
}: DocumentPreviewModalProps) {
  if (!isOpen) return null;

  const isImage = fileType.toLowerCase() === 'png' || fileType.toLowerCase() === 'jpeg' || fileType.toLowerCase() === 'jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Задний фон */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Контент модального окна */}
      <div className="relative w-full max-w-4xl h-[80vh] rounded-lg bg-zinc-900 text-white flex flex-col overflow-hidden shadow-2xl">
        {/* Шапка */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold truncate max-w-md">{fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Тело предпросмотра */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center p-6 overflow-auto">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded"
            />
          ) : fileType.toLowerCase() === 'pdf' ? (
            // Предпросмотр PDF через iframe (для демонстрации)
            <iframe
              src={fileUrl}
              title={fileName}
              className="w-full h-full rounded border-0 bg-white"
            />
          ) : (
            // Альтернативный экран, если формат не поддерживается для прямого вывода
            <div className="text-center space-y-4">
              <FileText className="mx-auto h-16 w-16 text-zinc-600" />
              <p className="text-sm text-zinc-400">Предпросмотр недоступен для этого формата</p>
              <a
                href={fileUrl}
                download={fileName}
                className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-xs font-semibold hover:bg-indigo-500"
              >
                <Download className="h-4 w-4" /> Скачать файл
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}