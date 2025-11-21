/**
 * Main Application - Fourier SVG Approximation
 */

class FourierApp {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Animation state
        this.isPlaying = true;
        this.time = 0;
        this.speed = 1;
        this.trail = [];
        this.maxTrailLength = 100;
        
        // Fourier data
        this.coefficients = null;
        this.scaledCoefficients = null;
        this.numCircles = 50;
        this.scale = 300; // Display scale
        
        // Display options
        this.showCircles = true;
        this.showVectors = true;
        
        // Check if running on file:// protocol
        if (window.location.protocol === 'file:') {
            const note = document.getElementById('server-note');
            if (note) note.style.display = 'block';
        }
        
        // Canvas setup
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize controls
        this.initializeControls();
        
        // Start animation loop
        this.animate();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas size with device pixel ratio for crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const width = Math.min(rect.width - 40, 1000);
        const height = Math.min(rect.height - 40, 800);
        
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        this.ctx.scale(dpr, dpr);
        
        this.centerX = width / 2;
        this.centerY = height / 2;
    }

    initializeControls() {
        // File upload
        const fileInput = document.getElementById('svg-upload');
        const fileName = document.getElementById('file-name');
        
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                fileName.textContent = `Loaded: ${file.name}`;
                try {
                    const text = await file.text();
                    this.loadSVG(text);
                } catch (error) {
                    alert('Error loading SVG: ' + error.message);
                    console.error(error);
                }
            }
        });

        // Number of circles
        const numCirclesSlider = document.getElementById('num-circles');
        const circlesValue = document.getElementById('circles-value');
        
        numCirclesSlider.addEventListener('input', (e) => {
            this.numCircles = parseInt(e.target.value);
            circlesValue.textContent = this.numCircles;
            this.updateStats();
        });

        // Speed control
        const speedSlider = document.getElementById('speed');
        const speedValue = document.getElementById('speed-value');
        
        speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            speedValue.textContent = this.speed.toFixed(1) + 'x';
        });

        // Trail length
        const trailSlider = document.getElementById('trail-length');
        const trailValue = document.getElementById('trail-value');
        
        trailSlider.addEventListener('input', (e) => {
            this.maxTrailLength = parseInt(e.target.value);
            trailValue.textContent = this.maxTrailLength + '%';
        });

        // Show circles checkbox
        const showCirclesCheckbox = document.getElementById('show-circles');
        showCirclesCheckbox.addEventListener('change', (e) => {
            this.showCircles = e.target.checked;
        });

        // Show vectors checkbox
        const showVectorsCheckbox = document.getElementById('show-vectors');
        showVectorsCheckbox.addEventListener('change', (e) => {
            this.showVectors = e.target.checked;
        });

        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause');
        playPauseBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            playPauseBtn.textContent = this.isPlaying ? '⏸️ Pause' : '▶️ Play';
        });

        // Reset button
        const resetBtn = document.getElementById('reset');
        resetBtn.addEventListener('click', () => {
            this.reset();
        });

        // Sample SVGs button and menu
        const sampleBtn = document.getElementById('sample-svgs-btn');
        const sampleMenu = document.getElementById('sample-menu');
        
        sampleBtn.addEventListener('click', () => {
            sampleMenu.classList.toggle('hidden');
        });

        // Sample SVG items
        const sampleItems = document.querySelectorAll('.sample-item');
        sampleItems.forEach(item => {
            item.addEventListener('click', () => {
                const filename = item.getAttribute('data-file');
                fileName.textContent = `Loading: ${filename}`;
                sampleMenu.classList.add('hidden');
                
                // Use XMLHttpRequest for better compatibility with file:// protocol
                const xhr = new XMLHttpRequest();
                xhr.open('GET', `examples/${filename}`, true);
                
                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 0) { // 0 for file:// protocol
                        fileName.textContent = `Loaded: ${filename}`;
                        this.loadSVG(xhr.responseText);
                    } else {
                        fileName.textContent = 'Error loading file';
                        alert('Error loading sample SVG. Please run this app on a local server.\n\nTry: python -m http.server 8000');
                    }
                };
                
                xhr.onerror = () => {
                    fileName.textContent = 'Error loading file';
                    alert('Error loading sample SVG. Please run this app on a local server.\n\nQuick fix:\n1. Open terminal in this folder\n2. Run: python -m http.server 8000\n3. Open: http://localhost:8000');
                };
                
                xhr.send();
            });
        });

        // Close sample menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!sampleBtn.contains(e.target) && !sampleMenu.contains(e.target)) {
                sampleMenu.classList.add('hidden');
            }
        });
    }

    loadSVG(svgContent) {
        try {
            // Extract points from SVG
            const points = FourierTransform.extractPointsFromSVG(svgContent, 500);
            document.getElementById('points-count').textContent = points.length;
            
            // Convert to complex numbers
            const complexSignal = FourierTransform.pointsToComplex(points);
            
            // Calculate Fourier coefficients
            this.coefficients = FourierTransform.dft(complexSignal);
            this.scaledCoefficients = FourierTransform.scaleCoefficients(
                this.coefficients, 
                this.scale
            );
            
            // Reset animation
            this.reset();
            this.updateStats();
            
        } catch (error) {
            alert('Error processing SVG: ' + error.message);
            console.error(error);
        }
    }

    reset() {
        this.time = 0;
        this.trail = [];
        if (!this.isPlaying) {
            this.isPlaying = true;
            document.getElementById('play-pause').textContent = '⏸️ Pause';
        }
    }

    updateStats() {
        if (this.coefficients) {
            const epicyclesUsed = Math.min(this.numCircles, this.coefficients.length);
            document.getElementById('epicycles-count').textContent = epicyclesUsed;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.coefficients && this.scaledCoefficients) {
            // Update time
            if (this.isPlaying) {
                this.time += 0.001 * this.speed;
                if (this.time > 1) {
                    this.time = 0;
                    // Don't clear trail - let it persist across cycles
                }
            }

            // Calculate epicycles
            const { circles, endpoint } = FourierTransform.calculateEpicycles(
                this.time,
                this.scaledCoefficients,
                this.numCircles
            );

            // Add point to trail
            if (this.isPlaying) {
                this.trail.push({ x: endpoint.x, y: endpoint.y });
                
                // Limit trail length
                const maxPoints = Math.floor((this.maxTrailLength / 100) * 1000);
                if (this.trail.length > maxPoints) {
                    this.trail.shift();
                }
            }

            // Draw
            this.drawEpicycles(circles);
            this.drawTrail();
            this.drawEndpoint(endpoint);

            // Update progress
            document.getElementById('progress').textContent = 
                Math.floor(this.time * 100) + '%';
        } else {
            // Draw instructions when no SVG is loaded
            this.drawInstructions();
        }

        requestAnimationFrame(() => this.animate());
    }

    drawEpicycles(circles) {
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);

        let prevX = 0;
        let prevY = 0;

        circles.forEach((circle, index) => {
            const { x, y, radius, angle } = circle;
            const nextX = x + radius * Math.cos(angle);
            const nextY = y + radius * Math.sin(angle);

            // Draw circle
            if (this.showCircles && radius > 0.5) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
                this.ctx.strokeStyle = `rgba(150, 150, 150, ${0.3 / Math.sqrt(index + 1)})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }

            // Draw vector (radius line)
            if (this.showVectors && radius > 0.5) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.ctx.lineTo(nextX, nextY);
                
                // Color gradient based on amplitude
                const hue = (index / circles.length) * 360;
                this.ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Draw small circle at the end
                this.ctx.beginPath();
                this.ctx.arc(nextX, nextY, 3, 0, 2 * Math.PI);
                this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.9)`;
                this.ctx.fill();
            }

            prevX = nextX;
            prevY = nextY;
        });

        this.ctx.restore();
    }

    drawTrail() {
        if (this.trail.length < 2) return;

        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);

        // Draw trail with gradient
        for (let i = 1; i < this.trail.length; i++) {
            const point = this.trail[i];
            const prevPoint = this.trail[i - 1];
            
            const alpha = i / this.trail.length;
            
            this.ctx.beginPath();
            this.ctx.moveTo(prevPoint.x, prevPoint.y);
            this.ctx.lineTo(point.x, point.y);
            this.ctx.strokeStyle = `rgba(102, 126, 234, ${alpha * 0.8})`;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawEndpoint(endpoint) {
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);

        // Draw glowing endpoint
        this.ctx.beginPath();
        this.ctx.arc(endpoint.x, endpoint.y, 6, 0, 2 * Math.PI);
        
        // Glow effect
        const gradient = this.ctx.createRadialGradient(
            endpoint.x, endpoint.y, 0,
            endpoint.x, endpoint.y, 10
        );
        gradient.addColorStop(0, 'rgba(255, 100, 100, 1)');
        gradient.addColorStop(1, 'rgba(255, 100, 100, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Solid center
        this.ctx.beginPath();
        this.ctx.arc(endpoint.x, endpoint.y, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ff6464';
        this.ctx.fill();

        this.ctx.restore();
    }

    drawInstructions() {
        this.ctx.save();
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.font = 'bold 24px sans-serif';
        this.ctx.fillStyle = '#999';
        this.ctx.fillText(
            '👆 Upload an SVG file to begin',
            this.centerX,
            this.centerY - 20
        );
        
        this.ctx.font = '16px sans-serif';
        this.ctx.fillStyle = '#bbb';
        this.ctx.fillText(
            'The animation will show how rotating circles can draw any shape',
            this.centerX,
            this.centerY + 20
        );
        
        this.ctx.restore();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FourierApp();
    });
} else {
    new FourierApp();
}

