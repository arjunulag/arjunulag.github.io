# 🚀 Quick Start Guide

## Running the Application

### Option 1: Direct File Opening
Simply open `index.html` in your web browser by double-clicking it.

### Option 2: Local Server (Recommended)

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js:**
```bash
npx serve
```

Then visit: `http://localhost:8000`

## First Steps

1. **Open the application** in your browser
2. **Click "Choose SVG File"**
3. **Select one of the example SVGs** from the `examples/` folder:
   - `heart.svg` - A simple heart shape
   - `star.svg` - A five-pointed star
   - `circle.svg` - A perfect circle (uses only 1 epicycle!)
   - `spiral.svg` - A spiral pattern
   - `letter-a.svg` - The letter "A"
   - `leo.svg` - A portrait with curly hair (try 500-1000 epicycles!)

4. **Watch the animation!** You'll see rotating circles (epicycles) trace out your shape

## Experiment with Controls

- **Drag the "Number of Epicycles" slider**
  - Try 1 circle: See the fundamental frequency
  - Try 5 circles: See a rough approximation
  - Try 50+ circles: See a detailed reconstruction
  - Try 500-1000 circles: For complex shapes like portraits!

- **Adjust the speed** to slow down or speed up the animation

- **Toggle "Show Epicycles"** off to see just the traced path

- **Reduce trail length** to see only the current drawing position

## Tips for Best Experience

- Start with simple shapes (heart, star, circle)
- Use 20-50 epicycles for most shapes
- Slow down the animation (0.5x) to see the circles clearly
- Watch a full cycle to see the complete drawing

## Creating Your Own SVGs

Use any vector graphics editor:
- **Inkscape** (free): File → Save As → Plain SVG
- **Figma**: Select object → Export → SVG
- **Adobe Illustrator**: File → Export → SVG

Keep shapes simple for best results!

---

Enjoy exploring the beauty of Fourier transforms! 🌀

