# 🚀 Deployment Guide

## GitHub Pages Deployment

### Quick Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy Fourier SVG Approximation"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be live at: `https://yourusername.github.io/Fourir/`

3. **Wait a few minutes** for GitHub to build and deploy

### Verify Deployment

After deployment, check:
- ✅ Main page loads: `https://yourusername.github.io/Fourir/`
- ✅ Sample SVGs work (click "📂 Sample SVGs")
- ✅ Upload functionality works
- ✅ All controls work properly

### Troubleshooting

**Sample SVGs not loading?**
- Check that the `examples/` folder is in your repository
- Verify all SVG files are committed and pushed
- Check browser console for 404 errors
- Make sure file names match exactly (case-sensitive on GitHub)

**Page not found?**
- Wait 5-10 minutes after enabling GitHub Pages
- Check that you selected the correct branch
- Verify the repository is public (or you have GitHub Pro for private repos)

**Styles not loading?**
- Check that `style.css` is in the root directory
- Verify it's committed and pushed
- Clear browser cache and reload

## Local Development

### Method 1: Batch File (Windows - Easiest)
```bash
# Just double-click:
START_SERVER.bat
```

### Method 2: Python Server
```bash
# In the project directory:
python -m http.server 8000

# Then open:
http://localhost:8000
```

### Method 3: Node.js
```bash
# Using npx (no installation needed):
npx serve

# Or with npm:
npm start
```

### Method 4: PHP
```bash
php -S localhost:8000
```

## File Structure for Deployment

Make sure these files/folders are included:

```
Fourir/
├── index.html          ✅ Required
├── style.css           ✅ Required
├── app.js              ✅ Required
├── fourier.js          ✅ Required
├── examples/           ✅ Required
│   ├── heart.svg
│   ├── star.svg
│   ├── circle.svg
│   ├── smiley.svg
│   ├── spiral.svg
│   ├── letter-a.svg
│   └── fourier.svg
├── README.md           ⚪ Optional
├── package.json        ⚪ Optional
└── START_SERVER.bat    ⚪ Optional (local only)
```

## Custom Domain (Optional)

To use a custom domain:

1. Create a `CNAME` file in the root:
   ```
   yourdomain.com
   ```

2. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```

3. In GitHub Settings → Pages, enter your custom domain

## Testing Before Deploy

Always test locally before deploying:

```bash
# Start local server
python -m http.server 8000

# Test these features:
✅ Upload SVG file
✅ Load sample SVGs
✅ All controls work
✅ Animation runs smoothly
✅ Reset button works
✅ Play/Pause works
```

## Continuous Deployment

Every time you push to `main`, GitHub automatically:
1. Detects the changes
2. Rebuilds the site
3. Deploys the new version
4. Usually takes 1-5 minutes

## Performance Tips

For best GitHub Pages performance:
- Keep SVG files under 500KB each
- Optimize images before uploading
- Minify CSS/JS for production (optional)
- Use browser caching

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all files are committed and pushed
3. Wait a few minutes after pushing
4. Try clearing browser cache
5. Check GitHub Pages build status in Settings

---

**Your site should now be live and fully functional!** 🎉

