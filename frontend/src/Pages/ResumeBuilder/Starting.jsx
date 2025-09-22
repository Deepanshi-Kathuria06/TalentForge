import React, { useState, useEffect, useRef } from 'react';
import "../ResumeBuilder/starting.css"

const ResumeBuilderLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    const cleanup = setupCanvasAnimation();
    return cleanup;
  }, []);

  const setupCanvasAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    let animationFrame;
    let progress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawRobotScene(ctx, progress);
      progress += 0.01;
      if (progress > 1) progress = 0;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  };

  const drawRobotScene = (ctx, progress) => {
    const width = 800;
    const height = 500;

    // Background with gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f8f5e6');
    gradient.addColorStop(1, '#fff9e5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Desk
    ctx.fillStyle = '#d6c9a1';
    ctx.fillRect(100, 350, 600, 20);
    ctx.fillRect(150, 370, 500, 10);

    // Robot body
    ctx.fillStyle = '#4A9782';
    ctx.fillRect(350, 250, 100, 100);
    ctx.fillRect(330, 230, 140, 20);

    // Robot eyes with glow effect
    ctx.fillStyle = '#004030';
    ctx.fillRect(360, 235, 10, 10);
    ctx.fillRect(430, 235, 10, 10);
    
    // Eye glow
    ctx.fillStyle = 'rgba(0, 64, 48, 0.4)';
    ctx.fillRect(358, 233, 14, 14);
    ctx.fillRect(428, 233, 14, 14);

    // Robot arms with animation
    ctx.fillStyle = '#4A9782';
    const armMovement = Math.sin(progress * Math.PI * 2) * 5;
    ctx.fillRect(320, 260 + armMovement, 30, 10);
    ctx.fillRect(450, 260 - armMovement, 30, 10);

    // Form elements animation
    const elements = [
      { x: 200, y: 280, width: 120, height: 25, text: 'Name:' },
      { x: 200, y: 310, width: 120, height: 25, text: 'Experience:' },
      { x: 200, y: 340, width: 120, height: 25, text: 'Education:' }
    ];
    
    elements.forEach((el, i) => {
      const appearProgress = Math.min(1, progress * 3 - i * 0.3);
      if (appearProgress > 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(el.x, el.y, el.width * appearProgress, el.height);
        ctx.strokeStyle = '#004030';
        ctx.strokeRect(el.x, el.y, el.width * appearProgress, el.height);
        
        if (appearProgress > 0.5) {
          ctx.fillStyle = '#004030';
          ctx.font = '10px Arial';
          ctx.fillText(el.text, el.x + 5, el.y + 15);
        }
      }
    });

    // Portfolio screen
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(550, 200, 200, 120);
    ctx.fillStyle = '#e9e1c8';
    ctx.fillRect(555, 205, 190, 110);
    
    // Screen content
    ctx.fillStyle = '#4A9782';
    ctx.font = '12px Arial';
    ctx.fillText('Portfolio', 570, 220);
    ctx.fillStyle = '#2D3748';
    ctx.fillRect(565, 230, 180, 2);
    ctx.fillText('• Resume.pdf', 570, 250);
    ctx.fillText('• Cover_Letter.docx', 570, 270);
    ctx.fillText('• Portfolio.pdf', 570, 290);
  };

  return (
    <div className="rb-landing-page">
      <div className="rb-background-shapes">
        <div className="rb-shape rb-shape-1"></div>
        <div className="rb-shape rb-shape-2"></div>
        <div className="rb-shape rb-shape-3"></div>
        <div className="rb-shape rb-shape-4"></div>
      </div>

      <div className={`rb-main-content ${isVisible ? 'rb-visible' : ''}`}>
        <div className="rb-tagline">
          <div className="rb-tagline-line">Craft Your Professional Story</div>
          <div className="rb-tagline-line">With Intelligent Resume Builder</div>
        </div>

        <div className="rb-animation-container">
          <canvas ref={canvasRef} className="rb-robot-animation"></canvas>
        </div>

        <div className="rb-cta-section">
          <button 
  className="rb-floating-cta"
  onClick={() => window.location.href = "../resume-builder/saveddesign"}
>
  <span className="rb-cta-text">
    Start Building Your Resume
  </span>
  <span className="rb-cta-arrow">→</span>
</button>

        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderLanding;