import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

const CroquisPage = () => {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds by default
  const [selectedDuration, setSelectedDuration] = useState(60);
  const timerRef = useRef<number | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
      link.download = `크로키-${new Date().toLocaleDateString()}.png`;
      link.href = canvasRef.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
      alert('그림을 저장하는 중 오류가 발생했습니다.');
    }
  };

  const startTimer = (seconds: number) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setTimerRunning(true);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Timer complete
          clearInterval(timerRef.current!);
          setTimerRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Additional tools specific to croquis drawing
  const croquisTools = (
    <div className="croquis-tools">
      <h3 className="text-sm font-bold mb-2">크로키 타이머</h3>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => startTimer(30)} 
          className={`btn-secondary text-sm ${selectedDuration === 30 && timerRunning ? 'bg-green-500 text-white' : ''}`}
        >
          30초
        </button>
        <button 
          onClick={() => startTimer(60)} 
          className={`btn-secondary text-sm ${selectedDuration === 60 && timerRunning ? 'bg-green-500 text-white' : ''}`}
        >
          1분
        </button>
        <button 
          onClick={() => startTimer(180)} 
          className={`btn-secondary text-sm ${selectedDuration === 180 && timerRunning ? 'bg-green-500 text-white' : ''}`}
        >
          3분
        </button>
        <button 
          onClick={() => startTimer(300)} 
          className={`btn-secondary text-sm ${selectedDuration === 300 && timerRunning ? 'bg-green-500 text-white' : ''}`}
        >
          5분
        </button>
        {timerRunning && (
          <button onClick={stopTimer} className="btn-primary text-sm bg-red-500">
            중지
          </button>
        )}
      </div>
      
      <div className="mt-3 text-center">
        <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-500' : ''}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm">
          크로키는 짧은 시간 내에 빠르게 그리는 습작입니다.
          시간을 정해두고 최대한 빠르게 형태를 잡아보세요.
          세부적인 것보다는 전체적인 형태에 집중하는 것이 중요합니다.
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="croquis-page"
    >
      <h2 className="text-3xl font-bold text-center mb-6">크로키 그리기</h2>
      
      <Toolbar
        onColorChange={handleColorChange}
        onBrushSizeChange={handleBrushSizeChange}
        onClearCanvas={handleClearCanvas}
        onSaveClick={handleSaveClick}
        additionalTools={croquisTools}
      />
      
      <div className="mt-6">
        <Canvas
          width={800}
          height={600}
          brushColor={brushColor}
          brushSize={brushSize}
          guidelines={{ enabled: true, type: 'grid', color: '#DDDDDD' }}
        />
      </div>
      
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold mb-4">크로키 주제 아이디어</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h4 className="font-bold">동물</h4>
            <p className="text-sm">고양이, 강아지, 토끼 등</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-bold">사람</h4>
            <p className="text-sm">가족, 친구 등</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-bold">물건</h4>
            <p className="text-sm">장난감, 책, 가구 등</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-bold">자연</h4>
            <p className="text-sm">꽃, 나무, 산 등</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CroquisPage; 