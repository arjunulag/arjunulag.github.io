/**
 * Fourier Transform and SVG Processing Module
 */

class FourierTransform {
    /**
     * Parse SVG path data and extract points
     * @param {string} pathData - SVG path data string
     * @param {number} numSamples - Number of points to sample from the path
     * @returns {Array<{x: number, y: number}>} Array of points
     */
    static parseSVGPath(pathData, numSamples = 500) {
        // Create a temporary SVG element to use the browser's path parsing
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.appendChild(path);
        document.body.appendChild(svg);

        const pathLength = path.getTotalLength();
        const points = [];

        // Sample points along the path
        for (let i = 0; i < numSamples; i++) {
            const distance = (i / numSamples) * pathLength;
            const point = path.getPointAtLength(distance);
            points.push({ x: point.x, y: point.y });
        }

        document.body.removeChild(svg);
        return points;
    }

    /**
     * Extract all paths from an SVG file
     * @param {string} svgContent - SVG file content as string
     * @param {number} numSamples - Number of points to sample
     * @returns {Array<{x: number, y: number}>} Combined points from all paths
     */
    static extractPointsFromSVG(svgContent, numSamples = 500) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        
        // Check for parsing errors
        const parserError = svgDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid SVG file');
        }

        const paths = svgDoc.querySelectorAll('path, polyline, polygon, circle, ellipse, rect, line');
        let allPoints = [];

        paths.forEach((element) => {
            let pathData = '';

            switch (element.tagName.toLowerCase()) {
                case 'path':
                    pathData = element.getAttribute('d');
                    break;
                case 'circle':
                    const cx = parseFloat(element.getAttribute('cx') || 0);
                    const cy = parseFloat(element.getAttribute('cy') || 0);
                    const r = parseFloat(element.getAttribute('r') || 0);
                    pathData = `M ${cx - r},${cy} A ${r},${r} 0 1,0 ${cx + r},${cy} A ${r},${r} 0 1,0 ${cx - r},${cy}`;
                    break;
                case 'ellipse':
                    const ecx = parseFloat(element.getAttribute('cx') || 0);
                    const ecy = parseFloat(element.getAttribute('cy') || 0);
                    const rx = parseFloat(element.getAttribute('rx') || 0);
                    const ry = parseFloat(element.getAttribute('ry') || 0);
                    pathData = `M ${ecx - rx},${ecy} A ${rx},${ry} 0 1,0 ${ecx + rx},${ecy} A ${rx},${ry} 0 1,0 ${ecx - rx},${ecy}`;
                    break;
                case 'rect':
                    const x = parseFloat(element.getAttribute('x') || 0);
                    const y = parseFloat(element.getAttribute('y') || 0);
                    const w = parseFloat(element.getAttribute('width') || 0);
                    const h = parseFloat(element.getAttribute('height') || 0);
                    pathData = `M ${x},${y} L ${x + w},${y} L ${x + w},${y + h} L ${x},${y + h} Z`;
                    break;
                case 'line':
                    const x1 = parseFloat(element.getAttribute('x1') || 0);
                    const y1 = parseFloat(element.getAttribute('y1') || 0);
                    const x2 = parseFloat(element.getAttribute('x2') || 0);
                    const y2 = parseFloat(element.getAttribute('y2') || 0);
                    pathData = `M ${x1},${y1} L ${x2},${y2}`;
                    break;
                case 'polyline':
                case 'polygon':
                    const points = element.getAttribute('points');
                    if (points) {
                        const coords = points.trim().split(/[\s,]+/);
                        pathData = 'M ' + coords[0] + ',' + coords[1];
                        for (let i = 2; i < coords.length; i += 2) {
                            pathData += ' L ' + coords[i] + ',' + coords[i + 1];
                        }
                        if (element.tagName.toLowerCase() === 'polygon') {
                            pathData += ' Z';
                        }
                    }
                    break;
            }

            if (pathData) {
                try {
                    const points = this.parseSVGPath(pathData, numSamples);
                    allPoints = allPoints.concat(points);
                } catch (e) {
                    console.warn('Could not parse path:', e);
                }
            }
        });

        if (allPoints.length === 0) {
            throw new Error('No valid paths found in SVG');
        }

        return allPoints;
    }

    /**
     * Convert points to complex numbers (centered and normalized)
     * @param {Array<{x: number, y: number}>} points
     * @returns {Array<{re: number, im: number}>} Complex numbers
     */
    static pointsToComplex(points) {
        if (points.length === 0) return [];

        // Find bounding box
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        points.forEach(p => {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        });

        // Center and scale
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const scale = Math.max(maxX - minX, maxY - minY);

        return points.map(p => ({
            re: (p.x - centerX) / scale,
            im: (p.y - centerY) / scale
        }));
    }

    /**
     * Discrete Fourier Transform
     * @param {Array<{re: number, im: number}>} signal - Complex signal
     * @returns {Array<{re: number, im: number, freq: number, amp: number, phase: number}>}
     */
    static dft(signal) {
        const N = signal.length;
        const coefficients = [];

        // Calculate frequency range (centered around 0)
        const freqStart = -Math.floor(N / 2);
        const freqEnd = Math.ceil(N / 2);

        for (let k = freqStart; k < freqEnd; k++) {
            let re = 0;
            let im = 0;

            for (let n = 0; n < N; n++) {
                const phi = (2 * Math.PI * k * n) / N;
                re += signal[n].re * Math.cos(phi) + signal[n].im * Math.sin(phi);
                im += signal[n].im * Math.cos(phi) - signal[n].re * Math.sin(phi);
            }

            re /= N;
            im /= N;

            const amp = Math.sqrt(re * re + im * im);
            const phase = Math.atan2(im, re);

            coefficients.push({
                re: re,
                im: im,
                freq: k,
                amp: amp,
                phase: phase
            });
        }

        // Sort by amplitude (descending) for better approximation
        coefficients.sort((a, b) => b.amp - a.amp);

        return coefficients;
    }

    /**
     * Calculate epicycle positions at time t
     * @param {number} t - Time parameter (0 to 1)
     * @param {Array} coefficients - Fourier coefficients
     * @param {number} numCircles - Number of circles to use
     * @returns {Array<{x: number, y: number, radius: number}>} Epicycle data
     */
    static calculateEpicycles(t, coefficients, numCircles) {
        const circles = [];
        let x = 0;
        let y = 0;

        const numToUse = Math.min(numCircles, coefficients.length);

        for (let i = 0; i < numToUse; i++) {
            const coef = coefficients[i];
            const freq = coef.freq;
            const radius = coef.amp;
            const phase = coef.phase;
            const angle = 2 * Math.PI * freq * t + phase;

            circles.push({
                x: x,
                y: y,
                radius: radius,
                angle: angle
            });

            x += radius * Math.cos(angle);
            y += radius * Math.sin(angle);
        }

        return { circles, endpoint: { x, y } };
    }

    /**
     * Normalize and scale coefficients for display
     * @param {Array} coefficients - Fourier coefficients
     * @param {number} scale - Display scale
     * @returns {Array} Scaled coefficients
     */
    static scaleCoefficients(coefficients, scale) {
        return coefficients.map(c => ({
            ...c,
            amp: c.amp * scale
        }));
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FourierTransform;
}

