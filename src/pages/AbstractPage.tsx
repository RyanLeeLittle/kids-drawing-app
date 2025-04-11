import { useState } from 'react';
import { motion } from 'framer-motion';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const AbstractPage = () => {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const handleColorChange = (color: string) => {
    setBrushColor(color);
  };

  const handleBrushSizeChange = (size: number) => {
    setBrushSize(size);
  };

  const handleClearCanvas = () => {
    // This will be passed to the Canvas component
  };

  const handleSaveClick = () => {
    if (!canvasRef) return;
    
    try {
      // Create a download link for the canvas image
      const link = document.createElement('a');
      link.download = `추상화-${new Date().toLocaleDateString()}.png`;
      link.href = canvasRef.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
      alert('그림을 저장하는 중 오류가 발생했습니다.');
    }
  };

  // Additional tools specific to abstract drawing
  const abstractTools = (
    <div className="abstract-tools">
      <h3 className="text-sm font-bold mb-2">추상화 도구</h3>
      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary text-sm">랜덤 색상</button>
        <button className="btn-secondary text-sm">드립 효과</button>
        <button className="btn-secondary text-sm">물감 튀김</button>
        <button className="btn-secondary text-sm">대칭 그리기</button>
      </div>
      <div className="mt-4">
        <p className="text-sm">
          추상화는 현실의 모습을 그대로 표현하지 않고, 
          색상과 모양, 선을 사용해 감정이나 생각을 표현하는 그림입니다.
          자유롭게 마음껏 표현해보세요!
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="abstract-page"
    >
      <h2 className="text-3xl font-bold text-center mb-6">추상화 그리기</h2>
      
      <Toolbar
        onColorChange={handleColorChange}
        onBrushSizeChange={handleBrushSizeChange}
        onClearCanvas={handleClearCanvas}
        onSaveClick={handleSaveClick}
        additionalTools={abstractTools}
      />
      
      <div className="mt-6">
        <Canvas
          width={800}
          height={600}
          brushColor={brushColor}
          brushSize={brushSize}
          guidelines={{ enabled: false }}
        />
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold mb-4">추상화 예시</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
          <div className="example-item">
            <div className="bg-yellow-100 w-32 h-32 rounded-lg flex items-center justify-center">
              색점 추상화
            </div>
            <p className="text-sm mt-2">색상의 점들로 감정 표현</p>
          </div>
          <div className="example-item">
            <div className="bg-blue-100 w-32 h-32 rounded-lg flex items-center justify-center">
              선 추상화
            </div>
            <p className="text-sm mt-2">다양한 선으로 움직임 표현</p>
          </div>
          <div className="example-item">
            <div className="bg-red-100 w-32 h-32 rounded-lg flex items-center justify-center">
              면 추상화
            </div>
            <p className="text-sm mt-2">색 면으로 공간감 표현</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AbstractPage; 