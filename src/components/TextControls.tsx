import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Trash2, Palette, Type, Share as Shadow, Eye, Move, Zap, Circle } from 'lucide-react';
import { TextElement } from '../App';

interface TextControlsProps {
  textElement: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
  onDelete: () => void;
}

const TextControls: React.FC<TextControlsProps> = ({
  textElement,
  onUpdate,
  onDelete,
}) => {
  const fonts = [
    'Inter',
    'Arial Black',
    'Impact',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Trebuchet MS',
    'Oswald',
    'Roboto',
  ];

  const colors = [
    '#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#40E0D0',
  ];

  const boldPresets = [
    { name: 'Subtle', strokeWidth: 0, shadowBlur: 2, shadowOffsetX: 1, shadowOffsetY: 1 },
    { name: 'Medium', strokeWidth: 1, shadowBlur: 4, shadowOffsetX: 2, shadowOffsetY: 2 },
    { name: 'Strong', strokeWidth: 2, shadowBlur: 6, shadowOffsetX: 3, shadowOffsetY: 3 },
    { name: 'Extreme', strokeWidth: 3, shadowBlur: 8, shadowOffsetX: 4, shadowOffsetY: 4 },
  ];

  const applyBoldPreset = (preset: typeof boldPresets[0]) => {
    onUpdate({
      strokeWidth: preset.strokeWidth,
      shadowBlur: preset.shadowBlur,
      shadowOffsetX: preset.shadowOffsetX,
      shadowOffsetY: preset.shadowOffsetY,
      bold: true,
      shadow: true,
    });
  };

  return (
    <div className="w-80 bg-[#1A1B23] border-l border-gray-800 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#F2F2F2]">Text Settings</h3>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Bold Presets */}
        <div className="bg-[#2A2B35] rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Zap className="w-4 h-4" />
            Bold Presets
          </div>
          <div className="grid grid-cols-2 gap-2">
            {boldPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyBoldPreset(preset)}
                className="px-3 py-2 bg-[#0B0A0D] hover:bg-[#5A588C] text-white rounded text-sm transition-colors border border-gray-600 hover:border-[#5A588C]"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Position Display */}
        <div className="bg-[#2A2B35] rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Move className="w-4 h-4" />
            Position & Opacity
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">X Position</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(textElement.x)}
                  onChange={(e) => onUpdate({ x: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                  className="w-full px-2 py-1 bg-[#0B0A0D] text-white rounded text-sm border border-gray-600 focus:border-[#5A588C]"
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-gray-400">Y Position</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Math.round(textElement.y)}
                  onChange={(e) => onUpdate({ y: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                  className="w-full px-2 py-1 bg-[#0B0A0D] text-white rounded text-sm border border-gray-600 focus:border-[#5A588C]"
                />
                <span className="text-xs text-gray-400">%</span>
              </div>
            </div>
          </div>
          
          {/* Opacity Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Eye className="w-4 h-4" />
                Opacity
              </label>
              <span className="text-sm text-[#5A588C] font-medium">
                {Math.round(textElement.opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={textElement.opacity}
              onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#0B0A0D] rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Text Content</label>
          <textarea
            value={textElement.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            className="w-full px-3 py-2 bg-[#2A2B35] text-white rounded-lg border border-gray-600 focus:border-[#5A588C] focus:ring-1 focus:ring-[#5A588C] resize-none"
            rows={2}
          />
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Font</label>
          <select
            value={textElement.fontFamily}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 bg-[#2A2B35] text-white rounded-lg border border-gray-600 focus:border-[#5A588C] focus:ring-1 focus:ring-[#5A588C]"
          >
            {fonts.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Size: {textElement.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="120"
            value={textElement.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-[#2A2B35] rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Letter Spacing: {textElement.letterSpacing}px
          </label>
          <input
            type="range"
            min="-5"
            max="20"
            value={textElement.letterSpacing}
            onChange={(e) => onUpdate({ letterSpacing: parseInt(e.target.value) })}
            className="w-full h-2 bg-[#2A2B35] rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Color Picker */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Text Color</label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="color"
              value={textElement.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={textElement.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="flex-1 px-2 py-1 bg-[#2A2B35] text-white rounded border border-gray-600 focus:border-[#5A588C] text-sm"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => onUpdate({ color })}
                className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                  textElement.color === color ? 'border-[#5A588C]' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Stroke Settings */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">Text Stroke</label>
          
          <div className="space-y-2">
            <label className="block text-xs text-gray-400">
              Stroke Width: {textElement.strokeWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="5"
              value={textElement.strokeWidth}
              onChange={(e) => onUpdate({ strokeWidth: parseInt(e.target.value) })}
              className="w-full h-2 bg-[#2A2B35] rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {textElement.strokeWidth > 0 && (
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Stroke Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textElement.strokeColor}
                  onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                  className="w-6 h-6 rounded border border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={textElement.strokeColor}
                  onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                  className="flex-1 px-2 py-1 bg-[#2A2B35] text-white rounded border border-gray-600 focus:border-[#5A588C] text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Style Controls */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Style</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ bold: !textElement.bold })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                textElement.bold
                  ? 'bg-[#5A588C] border-[#5A588C] text-white'
                  : 'bg-[#2A2B35] border-gray-600 text-gray-300 hover:border-[#5A588C]'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdate({ italic: !textElement.italic })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                textElement.italic
                  ? 'bg-[#5A588C] border-[#5A588C] text-white'
                  : 'bg-[#2A2B35] border-gray-600 text-gray-300 hover:border-[#5A588C]'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdate({ underline: !textElement.underline })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                textElement.underline
                  ? 'bg-[#5A588C] border-[#5A588C] text-white'
                  : 'bg-[#2A2B35] border-gray-600 text-gray-300 hover:border-[#5A588C]'
              }`}
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alignment */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Alignment</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ align: 'left' })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                textElement.align === 'left'
                  ? 'bg-[#5A588C] border-[#5A588C] text-white'
                  : 'bg-[#2A2B35] border-gray-600 text-gray-300 hover:border-[#5A588C]'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdate({ align: 'center' })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                textElement.align === 'center'
                  ? 'bg-[#5A588C] border-[#5A588C] text-white'
                  : 'bg-[#2A2B35] border-gray-600 text-gray-300 hover:border-[#5A588C]'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdate({ align: 'right' })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                textElement.align === 'right'
                  ? 'bg-[#5A588C] border-[#5A588C] text-white'
                  : 'bg-[#2A2B35] border-gray-600 text-gray-300 hover:border-[#5A588C]'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shadow Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">Text Shadow</label>
            <button
              onClick={() => onUpdate({ shadow: !textElement.shadow })}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                textElement.shadow
                  ? 'bg-[#5A588C] text-white'
                  : 'bg-[#2A2B35] text-gray-300 border border-gray-600'
              }`}
            >
              {textElement.shadow ? 'ON' : 'OFF'}
            </button>
          </div>

          {textElement.shadow && (
            <div className="space-y-3 pl-4 border-l-2 border-[#5A588C]/30">
              <div className="space-y-2">
                <label className="block text-xs text-gray-400">
                  Shadow Blur: {textElement.shadowBlur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={textElement.shadowBlur}
                  onChange={(e) => onUpdate({ shadowBlur: parseInt(e.target.value) })}
                  className="w-full h-2 bg-[#2A2B35] rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">X Offset</label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={textElement.shadowOffsetX}
                    onChange={(e) => onUpdate({ shadowOffsetX: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[#2A2B35] rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">Y Offset</label>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    value={textElement.shadowOffsetY}
                    onChange={(e) => onUpdate({ shadowOffsetY: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[#2A2B35] rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-gray-400">Shadow Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textElement.shadowColor}
                    onChange={(e) => onUpdate({ shadowColor: e.target.value })}
                    className="w-6 h-6 rounded border border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textElement.shadowColor}
                    onChange={(e) => onUpdate({ shadowColor: e.target.value })}
                    className="flex-1 px-2 py-1 bg-[#2A2B35] text-white rounded border border-gray-600 focus:border-[#5A588C] text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextControls;