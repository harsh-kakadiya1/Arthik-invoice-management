import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiCheck, FiRotateCcw } from 'react-icons/fi';

const SignatureModal = ({ isOpen, onClose, onSave, initialSignature = null }) => {
  const [activeTab, setActiveTab] = useState('Draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [textSignature, setTextSignature] = useState('');
  const [selectedFont, setSelectedFont] = useState('Great Vibes');
  const [uploadedImage, setUploadedImage] = useState(null);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const signatureFonts = [
    'Great Vibes',
    'Dancing Script',
    'Allura',
    'Pacifico',
    'Kaushan Script',
    'Satisfy'
  ];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load initial signature if provided
      if (initialSignature && activeTab === 'Draw') {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = initialSignature;
      }
    }
  }, [isOpen, initialSignature, activeTab]);

  const getMousePos = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getTouchPos = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = e.type.includes('touch') ? getTouchPos(canvas, e) : getMousePos(canvas, e);
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = e.type.includes('touch') ? getTouchPos(canvas, e) : getMousePos(canvas, e);
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let signatureData = null;

    if (activeTab === 'Draw') {
      const canvas = canvasRef.current;
      signatureData = {
        type: 'draw',
        data: canvas.toDataURL(),
        color: strokeColor
      };
    } else if (activeTab === 'Type') {
      signatureData = {
        type: 'text',
        data: textSignature,
        fontFamily: selectedFont
      };
    } else if (activeTab === 'Upload') {
      signatureData = {
        type: 'upload',
        data: uploadedImage
      };
    }

    onSave(signatureData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Signature</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiX className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {['Draw', 'Type', 'Upload'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'Draw' && (
            <div className="space-y-4">
              {/* Drawing Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">Color:</span>
                    <div className="flex space-x-2">
                      {['#000000', '#0066cc', '#cc0000'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setStrokeColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            strokeColor === color ? 'border-white' : 'border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearCanvas}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiRotateCcw className="h-4 w-4" />
                  <span className="text-sm">Erase</span>
                </button>
              </div>

              {/* Drawing Canvas */}
              <div className="border-2 border-gray-600 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={300}
                  className="w-full h-64 cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </div>
          )}

          {activeTab === 'Type' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your signature
                </label>
                <input
                  type="text"
                  value={textSignature}
                  onChange={(e) => setTextSignature(e.target.value)}
                  placeholder="Type your signature"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Font
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {signatureFonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {textSignature && (
                <div className="mt-6 p-6 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div
                    className="text-3xl text-gray-900"
                    style={{ fontFamily: selectedFont }}
                  >
                    {textSignature}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Upload' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload signature image
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
                >
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Click to upload image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </button>
              </div>

              {/* Preview */}
              {uploadedImage && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={uploadedImage}
                    alt="Signature preview"
                    className="max-w-full h-32 object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              (activeTab === 'Draw' && !canvasRef.current) ||
              (activeTab === 'Type' && !textSignature.trim()) ||
              (activeTab === 'Upload' && !uploadedImage)
            }
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <FiCheck className="h-4 w-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;