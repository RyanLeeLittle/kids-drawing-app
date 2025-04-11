// React, ReactDOM, react-router-dom 전역 변수 사용
const { useState, useEffect, useRef } = React;
const { BrowserRouter, Routes, Route, Link } = ReactRouterDOM;
const { motion, AnimatePresence } = Motion;

// Canvas 컴포넌트
const Canvas = ({
  width = 800,
  height = 600,
  backgroundColor = '#FFFFFF',
  brushColor = '#000000',
  brushSize = 5,
  guidelines = { enabled: false, type: 'none', color: '#DDDDDD' }
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBrushColor, setCurrentBrushColor] = useState(brushColor);
  const [currentBrushSize, setCurrentBrushSize] = useState(brushSize);
  const [ctx, setCtx] = useState(null);

  // 캔버스 초기화
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 캔버스 배경 설정
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    // 가이드라인 그리기
    if (guidelines.enabled && guidelines.type !== 'none') {
      drawGuidelines(context);
    }

    setCtx(context);
  }, [backgroundColor, width, height, guidelines]);

  // 가이드라인 타입별 그리기
  const drawGuidelines = (context) => {
    context.strokeStyle = guidelines.color || '#DDDDDD';
    context.lineWidth = 1;

    if (guidelines.type === 'grid') {
      // 격자 그리기
      const gridSize = 20;
      for (let x = 0; x <= width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
    } else if (guidelines.type === 'squares') {
      // 사각형 가이드라인 그리기
      const squareSize = 100;
      for (let x = 0; x < width; x += squareSize) {
        for (let y = 0; y < height; y += squareSize) {
          context.beginPath();
          context.rect(x, y, squareSize, squareSize);
          context.stroke();
        }
      }
    } else if (guidelines.type === 'circles') {
      // 원형 가이드라인 그리기
      const circleRadius = 100;
      context.beginPath();
      context.arc(width / 2, height / 2, circleRadius, 0, 2 * Math.PI);
      context.stroke();
      context.beginPath();
      context.arc(width / 2, height / 2, circleRadius / 2, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  // 그리기 시작
  const startDrawing = (e) => {
    if (!ctx) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = currentBrushColor;
    ctx.lineWidth = currentBrushSize;
    
    setIsDrawing(true);
  };

  // 그리기
  const draw = (e) => {
    if (!isDrawing || !ctx) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // 그리기 종료
  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  // 캔버스 지우기
  const clearCanvas = () => {
    if (!ctx) return;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 가이드라인 다시 그리기
    if (guidelines.enabled && guidelines.type !== 'none') {
      drawGuidelines(ctx);
    }
  };

  // 색상 변경
  const changeColor = (color) => {
    setCurrentBrushColor(color);
  };

  // 브러시 크기 변경
  const changeBrushSize = (size) => {
    setCurrentBrushSize(size);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair"
        />
      </div>
      <div className="toolbar mt-4 flex items-center justify-center gap-4">
        <div className="color-picker flex gap-2">
          {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map(
            (color) => (
              <button
                key={color}
                onClick={() => changeColor(color)}
                className={`w-8 h-8 rounded-full border ${
                  currentBrushColor === color ? 'border-black' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color} color`}
              />
            )
          )}
        </div>
        <div className="brush-size flex items-center gap-2">
          <button onClick={() => changeBrushSize(2)} className={`p-1 ${currentBrushSize === 2 ? 'bg-gray-200' : ''}`}>
            <div className="w-2 h-2 bg-black rounded-full" />
          </button>
          <button onClick={() => changeBrushSize(5)} className={`p-1 ${currentBrushSize === 5 ? 'bg-gray-200' : ''}`}>
            <div className="w-3 h-3 bg-black rounded-full" />
          </button>
          <button onClick={() => changeBrushSize(10)} className={`p-1 ${currentBrushSize === 10 ? 'bg-gray-200' : ''}`}>
            <div className="w-4 h-4 bg-black rounded-full" />
          </button>
          <button onClick={() => changeBrushSize(20)} className={`p-1 ${currentBrushSize === 20 ? 'bg-gray-200' : ''}`}>
            <div className="w-5 h-5 bg-black rounded-full" />
          </button>
        </div>
        <button onClick={clearCanvas} className="btn-primary">
          지우기
        </button>
      </div>
    </div>
  );
};

// Toolbar 컴포넌트
const Toolbar = ({
  onColorChange,
  onBrushSizeChange,
  onClearCanvas,
  onUndoClick,
  onRedoClick,
  onSaveClick,
  hasUndoHistory = false,
  hasRedoHistory = false,
  additionalTools
}) => {
  const [activeColor, setActiveColor] = useState('#000000');
  const [activeBrushSize, setActiveBrushSize] = useState(5);

  const colors = [
    { color: '#000000', name: '검정' },
    { color: '#FF0000', name: '빨강' },
    { color: '#00FF00', name: '초록' },
    { color: '#0000FF', name: '파랑' },
    { color: '#FFFF00', name: '노랑' },
    { color: '#FF00FF', name: '핑크' },
    { color: '#00FFFF', name: '하늘' },
    { color: '#FFFFFF', name: '하양' },
  ];

  const brushSizes = [
    { size: 2, name: '얇은 펜' },
    { size: 5, name: '중간 펜' },
    { size: 10, name: '굵은 펜' },
    { size: 20, name: '매우 굵은 펜' },
  ];

  const handleColorClick = (color) => {
    setActiveColor(color);
    onColorChange(color);
  };

  const handleBrushSizeClick = (size) => {
    setActiveBrushSize(size);
    onBrushSizeChange(size);
  };

  return (
    <div className="toolbar p-4 bg-gray-100 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="color-section">
          <h3 className="text-sm font-bold mb-2">색상</h3>
          <div className="colors flex flex-wrap gap-2">
            {colors.map((item) => (
              <button
                key={item.color}
                onClick={() => handleColorClick(item.color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  activeColor === item.color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: item.color }}
                title={item.name}
                aria-label={`${item.name} 색상 선택`}
              />
            ))}
          </div>
        </div>

        <div className="brush-section">
          <h3 className="text-sm font-bold mb-2">붓 크기</h3>
          <div className="brush-sizes flex items-center gap-2">
            {brushSizes.map((item) => (
              <button
                key={item.size}
                onClick={() => handleBrushSizeClick(item.size)}
                className={`p-1 rounded ${activeBrushSize === item.size ? 'bg-gray-300' : ''}`}
                title={item.name}
                aria-label={`${item.name} 선택`}
              >
                <div
                  className="rounded-full bg-black"
                  style={{ width: item.size * 2, height: item.size * 2 }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="actions-section">
          <h3 className="text-sm font-bold mb-2">동작</h3>
          <div className="actions flex flex-wrap gap-2">
            {onUndoClick && (
              <button
                onClick={onUndoClick}
                disabled={!hasUndoHistory}
                className={`btn-secondary text-sm px-3 py-1 ${!hasUndoHistory ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="실행취소"
              >
                ↩️ 실행취소
              </button>
            )}
            {onRedoClick && (
              <button
                onClick={onRedoClick}
                disabled={!hasRedoHistory}
                className={`btn-secondary text-sm px-3 py-1 ${!hasRedoHistory ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="다시실행"
              >
                ↪️ 다시실행
              </button>
            )}
            {onSaveClick && (
              <button
                onClick={onSaveClick}
                className="btn-primary text-sm px-3 py-1"
                aria-label="저장하기"
              >
                💾 저장하기
              </button>
            )}
            <button
              onClick={onClearCanvas}
              className="btn-primary text-sm px-3 py-1 bg-red-500"
              aria-label="모두 지우기"
            >
              🗑️ 모두 지우기
            </button>
          </div>
        </div>
      </div>

      {additionalTools && (
        <div className="additional-tools mt-4 pt-4 border-t border-gray-300">
          {additionalTools}
        </div>
      )}
    </div>
  );
};

// 추상화 그리기 페이지
const AbstractPage = () => {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasRef, setCanvasRef] = useState(null);

  const handleColorChange = (color) => {
    setBrushColor(color);
  };

  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
  };

  const handleClearCanvas = () => {
    // Canvas 컴포넌트로 전달
  };

  const handleSaveClick = () => {
    if (!canvasRef) return;
    
    try {
      const link = document.createElement('a');
      link.download = `추상화-${new Date().toLocaleDateString()}.png`;
      link.href = canvasRef.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다:', error);
      alert('그림을 저장하는 중 오류가 발생했습니다.');
    }
  };

  // 추상화 도구
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

// 크로키 그리기 페이지
const CroquisPage = () => {
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasRef, setCanvasRef] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60초 기본값
  const [selectedDuration, setSelectedDuration] = useState(60);
  const timerRef = useRef(null);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleColorChange = (color) => {
    setBrushColor(color);
  };

  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
  };

  const handleClearCanvas = () => {
    // Canvas 컴포넌트로 전달
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

  const startTimer = (seconds) => {
    // 기존 타이머 정리
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
    setTimerRunning(true);
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // 타이머 완료
          clearInterval(timerRef.current);
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 크로키 전용 도구
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

// 메인 App 컴포넌트
const App = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary text-center mb-4">초등학생을 위한 그리기 웹앱</h1>
        <nav className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">홈</Link>
          <Link to="/abstract" className="btn-secondary">추상화</Link>
          <Link to="/croquis" className="btn-secondary">크로키</Link>
          <Link to="/character" className="btn-secondary">캐릭터</Link>
          <Link to="/emoticon" className="btn-secondary">이모티콘</Link>
          <Link to="/portrait" className="btn-secondary">인물화</Link>
          <Link to="/landscape" className="btn-secondary">풍경화</Link>
          <Link to="/comic" className="btn-secondary">6컷 만화</Link>
        </nav>
      </header>

      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-secondary mb-6">그리기 주제를 선택해주세요!</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: '추상화 그리기', path: '/abstract', color: 'bg-red-100' },
                    { title: '크로키 그리기', path: '/croquis', color: 'bg-blue-100' },
                    { title: '캐릭터 그리기', path: '/character', color: 'bg-green-100' },
                    { title: '카카오 이모티콘', path: '/emoticon', color: 'bg-yellow-100' },
                    { title: '인물화 그리기', path: '/portrait', color: 'bg-purple-100' },
                    { title: '풍경화 그리기', path: '/landscape', color: 'bg-indigo-100' },
                    { title: '6컷 만화 그리기', path: '/comic', color: 'bg-pink-100' },
                  ].map((item, index) => (
                    <Link 
                      key={index} 
                      to={item.path} 
                      className={`${item.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <h3 className="text-xl font-bold">{item.title}</h3>
                    </Link>
                  ))}
                </div>
              </motion.div>
            } />
            <Route path="/abstract" element={<AbstractPage />} />
            <Route path="/croquis" element={<CroquisPage />} />
            <Route path="/character" element={<div>캐릭터 그리기 페이지 (작업 중)</div>} />
            <Route path="/emoticon" element={<div>이모티콘 그리기 페이지 (작업 중)</div>} />
            <Route path="/portrait" element={<div>인물화 그리기 페이지 (작업 중)</div>} />
            <Route path="/landscape" element={<div>풍경화 그리기 페이지 (작업 중)</div>} />
            <Route path="/comic" element={<div>6컷 만화 그리기 페이지 (작업 중)</div>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

// 앱 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
); 