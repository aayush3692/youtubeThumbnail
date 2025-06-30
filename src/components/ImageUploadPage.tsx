import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface ImageUploadPageProps {
  onImageUpload: (imageDataUrl: string) => void;
}

const ImageUploadPage: React.FC<ImageUploadPageProps> = ({ onImageUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(imageFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleNext = () => {
    if (previewImage) {
      onImageUpload(previewImage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo Header */}
      <div className="w-full py-6 px-8 border-b border-gray-800">
        <div className="flex items-center justify-center">
          <img 
            src="/white_circle_360x360.png" 
            alt="Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5A588C] rounded-full mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#F2F2F2] tracking-tight">
              YouTube Thumbnail Creator
            </h1>
            <p className="text-lg text-gray-400 max-w-md mx-auto">
              Upload your base image to start creating professional thumbnails
            </p>
          </div>

          {/* Upload Area */}
          <div className="relative">
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                ${dragActive 
                  ? 'border-[#5A588C] bg-[#5A588C]/10 scale-105' 
                  : 'border-gray-600 hover:border-[#5A588C]/50 hover:bg-[#5A588C]/5'
                }
                ${previewImage ? 'border-[#5A588C] bg-[#5A588C]/5' : ''}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {previewImage ? (
                <div className="space-y-6">
                  <div className="relative mx-auto max-w-md">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-auto rounded-lg shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#F2F2F2] font-medium">Image uploaded successfully!</p>
                    <p className="text-gray-400 text-sm">Ready to add text and effects</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="mx-auto w-20 h-20 bg-[#5A588C]/20 rounded-full flex items-center justify-center">
                    <Upload className="w-10 h-10 text-[#5A588C]" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-[#F2F2F2]">
                      Drop your image here
                    </p>
                    <p className="text-gray-400">
                      or <span className="text-[#5A588C] font-medium">browse</span> to choose a file
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Supports JPG, PNG, WEBP • Max 10MB
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Next Button */}
          {previewImage && (
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="
                  group flex items-center gap-3 px-8 py-4 bg-[#5A588C] hover:bg-[#5A588C]/80 
                  rounded-full font-semibold text-white transition-all duration-300 
                  hover:scale-105 hover:shadow-xl hover:shadow-[#5A588C]/25
                "
              >
                Continue to Editor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPage;