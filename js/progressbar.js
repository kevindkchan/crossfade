function updateSliderTrack(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value);
    const percent = ((val - min) / (max - min)) * 100;
  
    const color = slider.matches(':hover') ? '#1db954' : '#ffffff';
  
    slider.style.backgroundImage = `
      linear-gradient(to right,
        ${color} 0%,
        ${color} ${percent}%,
        rgba(255, 255, 255, 0.1) ${percent}%,
        rgba(255, 255, 255, 0.1) 100%)
    `;
  }
  
  // Apply the gradient logic to all range sliders
  document.querySelectorAll('input[type="range"]').forEach(slider => {
    // Initial paint
    updateSliderTrack(slider);
  
    // Live update
    slider.addEventListener('input', () => updateSliderTrack(slider));
    slider.addEventListener('mousemove', () => updateSliderTrack(slider));
    slider.addEventListener('mouseenter', () => updateSliderTrack(slider));
    slider.addEventListener('mouseleave', () => updateSliderTrack(slider));
  });
  