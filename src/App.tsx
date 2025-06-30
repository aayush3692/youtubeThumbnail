import React, { useState } from 'react';
import ImageUploadPage from './components/ImageUploadPage';
import TextEditorPage from './components/TextEditorPage';
import { Analytics } from "@vercel/analytics/next"

export interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  shadow: boolean;
  align: 'left' | 'center' | 'right';
  strokeWidth: number;
  strokeColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  letterSpacing: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'editor'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setCurrentPage('editor');
  };

  const handleBackToUpload = () => {
    setCurrentPage('upload');
    setUploadedImage(null);
    setTextElements([]);
  };

  return (
    <div className="min-h-screen bg-[#0B0A0D] text-white font-inter transition-all duration-500">
      {currentPage === 'upload' ? (
        <ImageUploadPage onImageUpload={handleImageUpload} />
      ) : (
        <TextEditorPage 
          image={uploadedImage!} 
          textElements={textElements}
          setTextElements={setTextElements}
          onBack={handleBackToUpload}
        />
      )}

      <Analytics/>
    </div>
  );
}

export default App;