# 🌀 Fourier SVG Approximation

An interactive web application that visualizes how any SVG shape can be drawn using rotating circles (epicycles) through Fourier series approximation.

## ✨ Features

- **SVG Upload**: Load any SVG file and watch it being decomposed into rotating circles
- **Interactive Controls**: Adjust the number of epicycles, animation speed, and trail length in real-time
- **Beautiful Visualization**: See the epicycles rotate and trace out your shape with smooth animations
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple SVG Elements**: Supports paths, circles, rectangles, polygons, and more

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
2. Click "Choose SVG File" and select an SVG file
3. Watch the magic happen!

### Using a Local Server (Recommended)

For the best experience, run a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎮 Controls

- **Number of Epicycles**: Control how many rotating circles are used (1-1000)
  - More circles = more accurate approximation
  - Fewer circles = see the fundamental frequencies
  - Up to 1000 epicycles for extremely detailed shapes like portraits!
  
- **Animation Speed**: Adjust how fast the animation plays (0.1x - 5x)

- **Trail Length**: Control how much of the traced path is visible (0-1000%)
  - Values over 100% create longer persistent trails
  - Great for complex shapes that need multiple cycles to appreciate

- **Show Epicycles**: Toggle visibility of the rotating circles

- **Show Vectors**: Toggle visibility of the radius vectors connecting circles

- **Play/Pause**: Pause and resume the animation

- **Reset**: Restart the animation from the beginning

## 📐 How It Works

The Fourier series is a mathematical technique that decomposes any periodic function into a sum of simple sine and cosine waves. When applied to a closed curve:

1. **Path Sampling**: The SVG path is sampled into discrete points
2. **Complex Representation**: Each point is converted to a complex number (x + yi)
3. **Discrete Fourier Transform (DFT)**: The DFT calculates the frequency components
4. **Epicycle Visualization**: Each frequency becomes a rotating circle
5. **Reconstruction**: The circles rotate at different speeds, and their combined motion traces the original shape

### Mathematical Background

For a closed curve parameterized by complex numbers z(t), the Fourier series is:

```
z(t) = Σ c_n * e^(2πint)
```

Where:
- `c_n` are the Fourier coefficients (calculated by DFT)
- `n` is the frequency (how many rotations per cycle)
- `t` is time (0 to 1 for one complete cycle)

Each term `c_n * e^(2πint)` represents a rotating circle (epicycle) with:
- Radius = |c_n| (amplitude)
- Angular velocity = 2πn
- Initial phase = arg(c_n)

## 📁 Project Structure

```
Fourir/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── fourier.js          # Fourier transform and SVG parsing
├── app.js              # Main application logic and animation
└── README.md           # This file
```

## 🎨 Creating SVG Files

You can create SVG files using:

- **Vector Graphics Editors**: Inkscape (free), Adobe Illustrator, Figma
- **Online Tools**: SVG-edit, Method Draw
- **Code**: Write SVG paths manually

### Tips for Best Results

- **Simple shapes work best**: Start with simple shapes like hearts, stars, or letters
- **Closed paths**: The algorithm works best with closed curves
- **Single color**: The tool focuses on shape, not colors or fills
- **Reasonable complexity**: Very complex shapes may need more epicycles

### Example SVG Files to Try

Create a simple heart SVG:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M50,80 C20,60 10,40 10,25 C10,15 15,10 25,10 C35,10 45,20 50,30 C55,20 65,10 75,10 C85,10 90,15 90,25 C90,40 80,60 50,80 Z" fill="red"/>
</svg>
```

Save this as `heart.svg` and upload it!

## 🔧 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Opera: ✅ Full support

Requires a modern browser with ES6+ support.

## 🎓 Educational Use

This project is perfect for:

- Learning about Fourier transforms
- Understanding frequency domain analysis
- Visualizing complex mathematical concepts
- Teaching signal processing fundamentals
- Exploring the connection between circles and waves

## 🐛 Troubleshooting

**SVG not loading?**
- Make sure the file is a valid SVG
- Check that it contains path elements or basic shapes
- Try a simpler SVG first

**Animation is slow?**
- Reduce the number of epicycles
- Try a simpler SVG with fewer points
- Close other browser tabs

**Circles look wrong?**
- Some SVG files may have transforms or unusual coordinate systems
- Try exporting the SVG with "flatten transforms" option
- Simplify the path in your vector editor

## 📚 Further Reading

- [Fourier Transform (Wikipedia)](https://en.wikipedia.org/wiki/Fourier_transform)
- [3Blue1Brown - But what is a Fourier series?](https://www.youtube.com/watch?v=r6sGWTCMz2k)
- [The Coding Train - Fourier Series](https://thecodingtrain.com/challenges/130-fourier-transform-drawing)

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Inspired by the beautiful mathematical visualizations of:
- 3Blue1Brown's Fourier series videos
- The Coding Train's creative coding tutorials
- The mathematical beauty of Jean-Baptiste Joseph Fourier's work

---

Made with ❤️ and mathematics

