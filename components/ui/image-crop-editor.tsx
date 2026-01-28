'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CyberButton } from '@/components/ui/cyber-button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, RotateCw, X } from 'lucide-react';

interface ImageCropEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onSave: (croppedImage: Blob) => void;
  aspectRatio?: number;
  shape?: 'rect' | 'round';
}

export function ImageCropEditor({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  aspectRatio = 1,
  shape = 'round'
}: ImageCropEditorProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Resetear posición cuando cambia la imagen
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    }
  }, [isOpen, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!containerRef.current || !imageRef.current) return;

    try {
      const container = containerRef.current;
      const img = imageRef.current;

      // Crear canvas temporal para cargar la imagen original
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      const originalImg = new Image();
      originalImg.crossOrigin = 'anonymous';
      originalImg.src = imageSrc;

      await new Promise((resolve, reject) => {
        originalImg.onload = resolve;
        originalImg.onerror = reject;
      });

      // Obtener dimensiones del contenedor y del área de recorte
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Calcular dimensiones del área de recorte
      let cropAreaWidth, cropAreaHeight;
      if (shape === 'round') {
        cropAreaWidth = cropAreaHeight = Math.min(containerWidth, containerHeight) * 0.75;
      } else {
        cropAreaWidth = containerWidth * 0.9;
        cropAreaHeight = containerHeight * 0.8;
      }

      // Calcular la escala entre la imagen mostrada y la original
      const displayedWidth = img.naturalWidth * zoom;
      const displayedHeight = img.naturalHeight * zoom;
      
      // Crear canvas final con las dimensiones del área de recorte
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = cropAreaWidth;
      finalCanvas.height = cropAreaHeight;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) return;

      // Calcular el centro del contenedor
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;

      // Calcular la posición de la imagen en el canvas final
      const imgX = centerX + position.x - displayedWidth / 2;
      const imgY = centerY + position.y - displayedHeight / 2;

      // Calcular el offset del área de recorte
      const cropX = (containerWidth - cropAreaWidth) / 2;
      const cropY = (containerHeight - cropAreaHeight) / 2;

      // Guardar contexto
      finalCtx.save();

      // Si es circular, crear máscara circular
      if (shape === 'round') {
        finalCtx.beginPath();
        finalCtx.arc(
          cropAreaWidth / 2,
          cropAreaHeight / 2,
          cropAreaWidth / 2,
          0,
          Math.PI * 2
        );
        finalCtx.clip();
      }

      // Trasladar al centro para rotación
      finalCtx.translate(cropAreaWidth / 2, cropAreaHeight / 2);
      finalCtx.rotate((rotation * Math.PI) / 180);
      finalCtx.translate(-cropAreaWidth / 2, -cropAreaHeight / 2);

      // Dibujar la imagen
      finalCtx.drawImage(
        originalImg,
        imgX - cropX,
        imgY - cropY,
        displayedWidth,
        displayedHeight
      );

      finalCtx.restore();

      // Convertir a blob
      finalCanvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
          onClose();
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full bg-gray-900 border-neon-green/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Ajustar Imagen</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Vista previa de la imagen */}
          <div 
            ref={containerRef}
            className="relative w-full bg-black overflow-hidden cursor-move border-2 border-neon-green/30 select-none"
            style={{
              height: shape === 'round' ? '400px' : '300px',
              borderRadius: shape === 'round' ? '0.5rem' : '0.5rem'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Preview"
              className="absolute pointer-events-none"
              style={{
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.1s',
                left: '50%',
                top: '50%',
                maxWidth: 'none',
                width: 'auto',
                height: 'auto',
                userSelect: 'none',
                WebkitUserDrag: 'none'
              }}
              draggable={false}
            />
            
            {/* Líneas guía para mostrar el área de recorte */}
            <div className="absolute inset-0 pointer-events-none">
              {shape === 'round' ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="border-4 border-neon-green border-dashed rounded-full"
                    style={{
                      width: '75%',
                      height: '75%',
                      aspectRatio: '1',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
                    }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="border-4 border-neon-green border-dashed"
                    style={{
                      width: '90%',
                      height: '80%',
                      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className="space-y-4">
            {/* Zoom */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300 flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  Zoom
                </label>
                <span className="text-sm text-gray-400">{zoom.toFixed(1)}x</span>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Rotación */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300 flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Rotación
                </label>
                <span className="text-sm text-gray-400">{rotation}°</span>
              </div>
              <Slider
                value={[rotation]}
                onValueChange={(value) => setRotation(value[0])}
                min={0}
                max={360}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <CyberButton
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </CyberButton>
            <CyberButton
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }}
              variant="outline"
              className="flex-1"
            >
              Restablecer
            </CyberButton>
            <CyberButton
              onClick={handleSave}
              className="flex-1 bg-neon-green text-black hover:bg-neon-green/80"
            >
              Guardar
            </CyberButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
