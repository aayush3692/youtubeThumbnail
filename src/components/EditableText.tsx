import React, { useState, useRef, useEffect } from 'react';
import { TextElement } from '../App';

interface EditableTextProps {
  element: TextElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextElement>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const EditableText: React.FC<EditableTextProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  containerRef,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const textRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    e.preventDefault();
    onSelect();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (element.x / 100) * (containerRef.current?.offsetWidth || 0),
      y: e.clientY - (element.y / 100) * (containerRef.current?.offsetHeight || 0),
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - dragStart.x) / containerRect.width) * 100;
    const newY = ((e.clientY - dragStart.y) / containerRect.height) * 100;

    onUpdate({
      x: Math.max(0, Math.min(100, newX)),
      y: Math.max(0, Math.min(100, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    onUpdate({ text: e.currentTarget.textContent || '' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  // Convert hex color to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Create enhanced text shadow for bold effect
  const createBoldShadow = () => {
    const shadows = [];
    
    // Main shadow
    if (element.shadow) {
      shadows.push(`${element.shadowOffsetX}px ${element.shadowOffsetY}px ${element.shadowBlur}px ${hexToRgba(element.shadowColor, element.opacity * 0.8)}`);
    }
    
    // Text stroke effect using multiple shadows
    if (element.strokeWidth > 0) {
      const strokeColor = hexToRgba(element.strokeColor, element.opacity);
      for (let i = 1; i <= element.strokeWidth; i++) {
        shadows.push(`0 0 ${i}px ${strokeColor}`);
        shadows.push(`${i}px 0 0 ${strokeColor}`);
        shadows.push(`-${i}px 0 0 ${strokeColor}`);
        shadows.push(`0 ${i}px 0 ${strokeColor}`);
        shadows.push(`0 -${i}px 0 ${strokeColor}`);
      }
    }
    
    return shadows.join(', ');
  };

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    fontSize: `${element.fontSize * 0.025}vw`,
    fontFamily: element.fontFamily,
    color: hexToRgba(element.color, element.opacity),
    fontWeight: element.bold ? '900' : 'normal',
    fontStyle: element.italic ? 'italic' : 'normal',
    textDecoration: element.underline ? 'underline' : 'none',
    textAlign: element.align,
    cursor: isDragging ? 'grabbing' : isEditing ? 'text' : 'grab',
    userSelect: isEditing ? 'text' : 'none',
    transform: 'translate(-50%, -50%)',
    minWidth: '2em',
    outline: isSelected && !isEditing ? '2px dashed #5A588C' : 'none',
    outlineOffset: '8px',
    textShadow: createBoldShadow(),
    whiteSpace: 'nowrap',
    opacity: element.opacity,
    letterSpacing: `${element.letterSpacing}px`,
    WebkitTextStroke: element.strokeWidth > 0 ? `${element.strokeWidth}px ${hexToRgba(element.strokeColor, element.opacity)}` : 'none',
  };

  return (
    <>
      <div
        ref={textRef}
        style={textStyle}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onInput={handleTextChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`
          transition-all duration-200
          ${isSelected ? 'ring-2 ring-[#5A588C] ring-opacity-50' : ''}
          ${isDragging ? 'scale-105' : ''}
        `}
      >
        {element.text}
      </div>
      
      {/* Position indicator when selected */}
      {isSelected && !isEditing && (
        <div
          className="absolute bg-[#5A588C] text-white text-xs px-2 py-1 rounded pointer-events-none z-10"
          style={{
            left: `${element.x}%`,
            top: `${Math.max(5, element.y - 8)}%`,
            transform: 'translateX(-50%)',
          }}
        >
          X: {Math.round(element.x)}% Y: {Math.round(element.y)}%
        </div>
      )}
    </>
  );
};

export default EditableText;