import React, { useState, useRef, useEffect } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  onResize?: (width: number) => void;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  initialWidth = 300,
  minWidth = 200,
  maxWidth = 600,
  className = '',
  onResize
}) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    
    // Add global mouse events
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidthRef.current + deltaX));
    
    setWidth(newWidth);
    onResize?.(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className={`relative ${className}`}
      style={{ width: `${width}px` }}
    >
      {children}
      
      {/* Resize handle */}
      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-300 hover:bg-orange-500 transition-colors ${
          isResizing ? 'bg-orange-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizablePanel;