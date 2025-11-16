const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const image_url = 'https://picsum.photos/200/300?grayscale';

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

// Helper function to load image
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const sketch = async ({ context, width, height }) => {
  // Load the image
  const image = await loadImage(image_url);
  
  // Create a temporary canvas to get image data
  const tempCanvas = document.createElement('canvas');
  const tempContext = tempCanvas.getContext('2d');
  tempCanvas.width = width;
  tempCanvas.height = height;
  
  // Draw and scale image to fit canvas
  tempContext.drawImage(image, 0, 0, width, height);
  
  // Get pixel data from the image
  const imageData = tempContext.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  // Matrix characters
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
  
  // Grid setup
  const fontSize = 10;
  const cols = Math.floor(width / fontSize);
  const rows = Math.floor(height / fontSize);
  
  return ({ context, width, height, frame }) => {
    // Black background
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    context.font = `${fontSize}px monospace`;
    
    // Draw the entire image as Matrix characters
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const pixelX = x * fontSize;
        const pixelY = y * fontSize;
        
        // Get pixel data at this position
        const pixelIndex = (pixelY * width + pixelX) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        
        // Calculate brightness (0-255)
        const brightness = (r + g + b) / 3;
        
        // Only draw if pixel is bright enough
        if (brightness > 30) {
          // Map brightness to green value
          const greenValue = Math.floor(brightness);
          context.fillStyle = `rgb(0, ${greenValue}, 0)`;
          
          // Pick a random character that changes over time
          random.setSeed(x * 1000 + y + Math.floor(frame / 10));
          const charIndex = Math.floor(random.value() * chars.length);
          const char = chars[charIndex];
          
          context.fillText(char, pixelX, pixelY + fontSize);
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
