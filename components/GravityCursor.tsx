import React, { useEffect, useRef } from 'react';

const GravityCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let mouseDown = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Direct update for dot
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onMouseDown = () => {
      mouseDown = true;
      ring.style.width = '50px';
      ring.style.height = '50px';
      ring.style.backgroundColor = 'rgba(11, 87, 208, 0.1)';
    };

    const onMouseUp = () => {
      mouseDown = false;
      ring.style.width = '30px';
      ring.style.height = '30px';
      ring.style.backgroundColor = 'transparent';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Physics loop for ring
    const loop = () => {
      // Linear interpolation (Lerp) for smooth trailing
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ring) {
        ring.style.transform = `translate3d(${ringX - (mouseDown ? 25 : 15)}px, ${ringY - (mouseDown ? 25 : 15)}px, 0)`;
      }
      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <>
      <style>{`
        body { cursor: none; }
        a, button, input, select, textarea { cursor: none; }
        .custom-cursor {
          pointer-events: none;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
          mix-blend-mode: difference;
        }
        .cursor-dot {
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        .cursor-ring {
          width: 30px;
          height: 30px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          transition: width 0.2s, height 0.2s, background-color 0.2s;
        }
      `}</style>
      <div ref={cursorRef} className="custom-cursor cursor-dot hidden md:block" />
      <div ref={ringRef} className="custom-cursor cursor-ring hidden md:block" />
    </>
  );
};

export default GravityCursor;