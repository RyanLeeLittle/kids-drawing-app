import { useState } from 'react';

interface ToolbarProps {
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: number) => void;
  onClearCanvas: () => void;
  onUndoClick?: () => void;
  onRedoClick?: () => void;
  onSaveClick?: () => void;
  hasUndoHistory?: boolean;
  hasRedoHistory?: boolean;
  additionalTools?: React.ReactNode;
}

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
}: ToolbarProps) => {
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

  const handleColorClick = (color: string) => {
    setActiveColor(color);
    onColorChange(color);
  };

  const handleBrushSizeClick = (size: number) => {
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

export default Toolbar; 