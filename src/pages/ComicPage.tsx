import { useState } from 'react';
import { motion } from 'framer-motion';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const ComicPage = () => {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [currentPanel, setCurrentPanel] = useState(1);
  const totalPanels = 6;

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
      const link = document.createElement('a');
      link.download = `만화-패널${currentPanel}-${new Date().toLocaleDateString()}.png`;
      link.href = canvasRef.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
      alert('그림을 저장하는 중 오류가 발생했습니다.');
    }
  };

  const changePanel = (panelNumber: number) => {
    if (panelNumber >= 1 && panelNumber <= totalPanels) {
      setCurrentPanel(panelNumber);
      // In a real app, we would save the current panel and load the new one
    }
  };

  // Additional tools specific to comic drawing
  const comicTools = (
    <div className="comic-tools">
      <h3 className="text-sm font-bold mb-2">만화 패널 선택</h3>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalPanels }).map((_, index) => (
          <button
            key={index}
            onClick={() => changePanel(index + 1)}
            className={`btn-secondary text-sm ${
              currentPanel === index + 1 ? 'bg-secondary text-white' : ''
            }`}
          >
            패널 {index + 1}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        <p className="text-sm">
          6컷 만화를 그리고 있어요. 현재 <strong>패널 {currentPanel}</strong>을 그리는 중입니다.
          패널마다 이야기의 흐름이 있도록 그려보세요. 
          각 패널을 클릭하여 이동할 수 있습니다.
        </p>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-bold">만화 말풍선 팁</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          <div className="bg-gray-100 p-2 rounded text-xs text-center">
            타원형 말풍선<br/>
            (대화)
          </div>
          <div className="bg-gray-100 p-2 rounded text-xs text-center">
            구름형 말풍선<br/>
            (생각)
          </div>
          <div className="bg-gray-100 p-2 rounded text-xs text-center">
            뾰족한 말풍선<br/>
            (외침)
          </div>
          <div className="bg-gray-100 p-2 rounded text-xs text-center">
            네모 말풍선<br/>
            (내레이션)
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="comic-page"
    >
      <h2 className="text-3xl font-bold text-center mb-6">6컷 만화 그리기</h2>
      
      <Toolbar
        onColorChange={handleColorChange}
        onBrushSizeChange={handleBrushSizeChange}
        onClearCanvas={handleClearCanvas}
        onSaveClick={handleSaveClick}
        additionalTools={comicTools}
      />
      
      <div className="mt-6">
        <Canvas
          width={800}
          height={600}
          brushColor={brushColor}
          brushSize={brushSize}
          guidelines={{ enabled: true, type: 'squares', color: '#DDDDDD' }}
        />
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center">만화 이야기 아이디어</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-yellow-100 rounded-lg">
            <h4 className="font-bold">우주 모험</h4>
            <p className="text-sm">우주 비행사가 새로운 행성을 발견하는 이야기</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg">
            <h4 className="font-bold">학교 생활</h4>
            <p className="text-sm">친구들과의 재미있는 학교 에피소드</p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <h4 className="font-bold">슈퍼히어로</h4>
            <p className="text-sm">특별한 능력을 가진 주인공의 모험</p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg">
            <h4 className="font-bold">동물 친구들</h4>
            <p className="text-sm">동물들이 주인공인 이야기</p>
          </div>
          <div className="p-4 bg-purple-100 rounded-lg">
            <h4 className="font-bold">판타지 세계</h4>
            <p className="text-sm">마법이 있는 판타지 세계의 이야기</p>
          </div>
          <div className="p-4 bg-pink-100 rounded-lg">
            <h4 className="font-bold">타임 트래블</h4>
            <p className="text-sm">시간 여행을 하게 된 주인공의 이야기</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComicPage; 