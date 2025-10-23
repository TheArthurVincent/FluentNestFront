# PWA Assets Guide

## Issues Fixed

The following PWA configuration issues have been resolved in the `vite.config.js`:

1. ✅ Added proper icon configuration with square icons (144px+)
2. ✅ Added screenshot configuration for both mobile (narrow) and desktop (wide)
3. ✅ Set proper icon purposes ('any' and 'maskable')
4. ✅ Created manifest.webmanifest file

## Required Assets

### Icons Needed (Square PNG format)

You need to create the following square icons in the `public/icons/` directory:

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels ⚠️ **Required minimum**
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels
- `icon-maskable-192x192.png` - 192x192 pixels (maskable version)
- `icon-maskable-512x512.png` - 512x512 pixels (maskable version)

### Screenshots Needed

You need to create the following screenshots in the `public/screenshots/` directory:

#### Mobile Screenshots (narrow form factor)
- `screenshot-mobile-1.png` - 640x1136 pixels or similar mobile aspect ratio
- `screenshot-mobile-2.png` - 640x1136 pixels or similar mobile aspect ratio

#### Desktop Screenshots (wide form factor)
- `screenshot-desktop-1.png` - 1920x1080 pixels or similar desktop aspect ratio
- `screenshot-desktop-2.png` - 1920x1080 pixels or similar desktop aspect ratio

## How to Generate Icons

### Option 1: Using Online Tools
1. Visit [RealFaviconGenerator](https://realfavicongenerator.net/) or [PWA Asset Generator](https://www.pwabuilder.com/)
2. Upload your logo/icon (minimum 512x512px, square)
3. Download the generated icons
4. Place them in `public/icons/` directory

### Option 2: Using PWA Asset Generator (npm package)
```bash
npx @vite-pwa/assets-generator --preset minimal public/your-logo.png
```

### Option 3: Manual Creation
- Create a square logo at 512x512px
- Use an image editor (Photoshop, GIMP, Figma) to resize to all required sizes
- For maskable icons, ensure your logo has adequate padding (20% safe zone)

## How to Create Screenshots

1. **Mobile Screenshots:**
   - Open your app in Chrome DevTools mobile view
   - Set viewport to 640x1136 or similar
   - Take screenshots of key app screens
   - Save as PNG in `public/screenshots/`

2. **Desktop Screenshots:**
   - Open your app in desktop browser
   - Set window to 1920x1080 or similar
   - Take screenshots of key app screens
   - Save as PNG in `public/screenshots/`

## Verification

After adding all assets, rebuild your app and check:
```bash
npm run build
npm run preview
```

Then open Chrome DevTools → Application → Manifest to verify all icons and screenshots are properly loaded.

## Important Notes

- All icons must be **square** (same width and height)
- At least one icon must be 144px or larger with purpose='any'
- Maskable icons should have a 20% safe zone padding
- Screenshots enhance the install experience but are optional for basic PWA functionality
- The manifest file has been created at `public/manifest.webmanifest`

