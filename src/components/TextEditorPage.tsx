import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Plus, Download, Type } from 'lucide-react';
import { TextElement } from '../App';
import TextControls from './TextControls';
import EditableText from './EditableText';

interface TextEditorPageProps {
  image: string;
  textElements: TextElement[];
  setTextElements: (elements: TextElement[]) => void;
  onBack: () => void;
}

const TextEditorPage: React.FC<TextEditorPageProps> = ({
  image,
  textElements,
  setTextElements,
  onBack,
}) => {
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addTextElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: 'Your Text Here',
      x: 50,
      y: 50,
      fontSize: 48,
      fontFamily: 'Inter',
      color: '#FFFFFF',
      opacity: 1,
      bold: true,
      italic: false,
      underline: false,
      shadow: true,
      align: 'center',
      strokeWidth: 1,
      strokeColor: '#000000',
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      shadowColor: '#000000',
      letterSpacing: 0,
    };
    setTextElements([...textElements, newElement]);
    setSelectedTextId(newElement.id);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(textElements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    ));
  };

  const deleteTextElement = (id: string) => {
    setTextElements(textElements.filter(element => element.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  // Convert hex color to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const exportThumbnail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to standard YouTube thumbnail dimensions
    canvas.width = 1280;
    canvas.height = 720;

    // Create and load the image
    const img = new Image();
    img.onload = () => {
      // Draw the background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw each text element
      textElements.forEach(element => {
        ctx.save();
        
        // Set font properties
        let fontStyle = '';
        if (element.italic) fontStyle += 'italic ';
        if (element.bold) fontStyle += '900 ';
        ctx.font = `${fontStyle}${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = hexToRgba(element.color, element.opacity);
        ctx.textAlign = element.align;
        ctx.globalAlpha = element.opacity;

        // Calculate position relative to canvas size
        const x = (element.x / 100) * canvas.width;
        const y = (element.y / 100) * canvas.height;

        // Add shadow if enabled
        if (element.shadow) {
          ctx.shadowColor = hexToRgba(element.shadowColor, element.opacity * 0.8);
          ctx.shadowBlur = element.shadowBlur;
          ctx.shadowOffsetX = element.shadowOffsetX;
          ctx.shadowOffsetY = element.shadowOffsetY;
        }

        // Add stroke if enabled
        if (element.strokeWidth > 0) {
          ctx.strokeStyle = hexToRgba(element.strokeColor, element.opacity);
          ctx.lineWidth = element.strokeWidth * 2;
          ctx.strokeText(element.text, x, y);
        }

        // Draw text
        ctx.fillText(element.text, x, y);

        // Add underline if enabled
        if (element.underline) {
          const textWidth = ctx.measureText(element.text).width;
          let underlineX = x;
          if (element.align === 'center') underlineX -= textWidth / 2;
          else if (element.align === 'right') underlineX -= textWidth;
          
          ctx.beginPath();
          ctx.moveTo(underlineX, y + 5);
          ctx.lineTo(underlineX + textWidth, y + 5);
          ctx.strokeStyle = hexToRgba(element.color, element.opacity);
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      });

      // Download the image
      const link = document.createElement('a');
      link.download = 'youtube-thumbnail.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = image;
  }, [image, textElements]);

  const selectedElement = textElements.find(el => el.id === selectedTextId);

  return (
    <div className="min-h-screen flex">
      {/* Canvas Area */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Upload
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={addTextElement}
              className="flex items-center gap-2 px-4 py-2 bg-[#5A588C] hover:bg-[#5A588C]/80 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Text
            </button>
            
            <button
              onClick={exportThumbnail}
              className="flex items-center gap-2 px-6 py-2 bg-[#F2F2F2] text-[#0B0A0D] hover:bg-white rounded-lg font-semibold transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex justify-center">
          <div 
            ref={containerRef}
            className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
            style={{ aspectRatio: '16/9', width: '100%', maxWidth: '800px' }}
          >
            <img
              src={image}
              alt="Thumbnail base"
              className="w-full h-full object-cover"
            />
            
            {/* Text Elements */}
            {textElements.map(element => (
              <EditableText
                key={element.id}
                element={element}
                isSelected={selectedTextId === element.id}
                onSelect={() => setSelectedTextId(element.id)}
                onUpdate={(updates) => updateTextElement(element.id, updates)}
                containerRef={containerRef}
              />
            ))}
          </div>
        </div>

        {/* Hidden canvas for export */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls Panel */}
      {selectedElement && (
        <TextControls
          textElement={selectedElement}
          onUpdate={(updates) => updateTextElement(selectedElement.id, updates)}
          onDelete={() => deleteTextElement(selectedElement.id)}
        />
      )}

      {/* Empty State Panel */}
      {!selectedElement && (
        <div className="w-80 bg-[#1A1B23] border-l border-gray-800 p-6">
          <div className="text-center space-y-4 mt-20">
            <div className="w-16 h-16 bg-[#5A588C]/20 rounded-full flex items-center justify-center mx-auto">
              <Type className="w-8 h-8 text-[#5A588C]" />
            </div>
            <h3 className="text-lg font-semibold text-[#F2F2F2]">Add Text to Get Started</h3>
            <p className="text-gray-400 text-sm">
              Click "Add Text" to create your first text element, then select it to customize
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditorPage;