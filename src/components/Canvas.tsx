import { useRef, useEffect, useState } from 'react';

interface CanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  brushColor?: string;
  brushSize?: number;
  guidelines?: {
    enabled: boolean;
    type?: 'grid' | 'squares' | 'circles' | 'none';
    color?: string;
  };
}

const Canvas = ({
  width = 800,
  height = 600,
  backgroundColor = '#FFFFFF',
  brushColor = '#000000',
  brushSize = 5,
  guidelines = { enabled: false, type: 'none', color: '#DDDDDD' }
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBrushColor, setCurrentBrushColor] = useState(brushColor);
  const [currentBrushSize, setCurrentBrushSize] = useState(brushSize);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    // Draw guidelines if enabled
    if (guidelines.enabled && guidelines.type !== 'none') {
      drawGuidelines(context);
    }

    setCtx(context);
  }, [backgroundColor, width, height, guidelines]);

  // Draw guidelines based on type
  const drawGuidelines = (context: CanvasRenderingContext2D) => {
    context.strokeStyle = guidelines.color || '#DDDDDD';
    context.lineWidth = 1;

    if (guidelines.type === 'grid') {
      // Draw grid lines
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
      // Draw square outlines
      const squareSize = 100;
      for (let x = 0; x < width; x += squareSize) {
        for (let y = 0; y < height; y += squareSize) {
          context.beginPath();
          context.rect(x, y, squareSize, squareSize);
          context.stroke();
        }
      }
    } else if (guidelines.type === 'circles') {
      // Draw circle guides
      const circleRadius = 100;
      context.beginPath();
      context.arc(width / 2, height / 2, circleRadius, 0, 2 * Math.PI);
      context.stroke();
      context.beginPath();
      context.arc(width / 2, height / 2, circleRadius / 2, 0, 2 * Math.PI);
      context.stroke();
    }
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
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

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!ctx) return;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Redraw guidelines if enabled
    if (guidelines.enabled && guidelines.type !== 'none') {
      drawGuidelines(ctx);
    }
  };

  // Set color
  const changeColor = (color: string) => {
    setCurrentBrushColor(color);
  };

  // Set brush size
  const changeBrushSize = (size: number) => {
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

export default Canvas; 