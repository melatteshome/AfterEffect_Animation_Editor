// AnimationEditor.js
import React, { useState, useRef, useEffect } from 'react';
import lottie from 'lottie-web';

function AnimationEditor({ animationData }) {
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(400); // Set default canvas size
  const [canvasHeight, setCanvasHeight] = useState(400);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current = lottie.loadAnimation({
      container: canvasRef.current,
      renderer: 'canvas',
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
    return () => {
      animationRef.current.destroy();
    };
  }, [animationData]);

  const handleEditAnimation = () => {
    animationRef.current.goToAndStop(0); // Reset animation to the first frame
    animationRef.current.play(); // Restart animation

    // Code to modify animation properties based on user inputs
    animationRef.current.goToAndStop(0); // Reset animation to the first frame
    animationRef.current.renderer.elements[0].updateDocumentData({
      p: { x: positionX, y: positionY }, // Update position
      // Add more properties to update
    });
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw animation onto canvas
    animationRef.current.goToAndStop(0); // Reset animation to the first frame
    animationRef.current.renderFrame();
    context.drawImage(animationRef.current.renderer.elements[0].canvas, 0, 0, canvas.width, canvas.height);

    // Export canvas as HTML/JS
    const html = `
      <html>
      <body>
        <canvas id="exportedCanvas" width="${canvas.width}" height="${canvas.height}"></canvas>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.10/lottie.min.js"></script>
        <script>
          var animationData = ${JSON.stringify(animationData)};
          var canvas = document.getElementById('exportedCanvas');
          var ctx = canvas.getContext('2d');
          var anim = lottie.loadAnimation({
            container: canvas,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            animationData: animationData,
          });
        </script>
      </body>
      </html>
    `;

    // Create a blob and download the file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_animation.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div>
        <input type="range" value={positionX} onChange={(e) => setPositionX(e.target.value)} />
        <input type="range" value={positionY} onChange={(e) => setPositionY(e.target.value)} />
        {/* Add more controls for other properties */}
        <button onClick={handleEditAnimation}>Apply Changes</button>
        <button onClick={handleExport}>Export</button>
      </div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }} />
    </div>
  );
}

export default AnimationEditor;
