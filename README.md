# Gulp Starter

Modern frontend starter built with **Gulp 5**, **Sass**, **PostCSS**, **esbuild**, **Sharp**, **SVGO** and native Node.js development server.

The project is designed for building static websites with a simple and maintainable development workflow.

## Features

* ⚡ Gulp 5 task runner
* 🎨 SCSS/Sass compilation
* 🧩 PostCSS + Autoprefixer
* 📦 JavaScript bundling with esbuild
* 🖼️ Image optimization with Sharp
* 🌐 Responsive images with multiple widths
* 🚀 WebP and AVIF generation
* 🧹 SVG optimization with SVGO
* 🔤 Automatic TTF/OTF → WOFF/WOFF2 conversion
* 📝 Automatic `@font-face` generation
* 🧹 HTML minification in production
* 🗂️ Static assets copying
* 🔄 Native development server with automatic reload
* 👀 File watching
* 🧽 Automatic `dist` cleanup
* 🔒 Source maps in development
* 📦 Production minification
* 🟢 Node.js 24+

---

## Requirements

* Node.js `>=24 <25`
* npm

Check your versions:

```bash
node -v
npm -v
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/pasha-z25/gulp-2026.git
```

Enter the project directory:

```bash
cd gulp-2026
```

Install dependencies:

```bash
npm install
```

---

## Commands

### Development

Start the development server:

```bash
npm run dev
```

The project will be available at:

```text
http://localhost:3000
```

The development workflow:

1. Cleans `dist`
2. Builds HTML
3. Compiles SCSS
4. Bundles JavaScript
5. Optimizes images
6. Processes fonts
7. Copies assets
8. Starts the development server
9. Watches source files
10. Reloads the browser after changes

### Production build

Create a production build:

```bash
npm run build
```

Production mode enables:

* HTML minification
* CSS compression
* JavaScript minification
* Image optimization
* Production image quality settings
* No development source maps

---

## Project structure

```text
.
├── src/
│   ├── assets/
│   ├── fonts/
│   ├── html/
│   ├── images/
│   ├── js/
│   └── scss/
│
├── dist/
│   ├── assets/
│   ├── css/
│   ├── fonts/
│   ├── images/
│   ├── js/
│   └── index.html
│
├── gulp/
│   ├── server/
│   │   ├── serve.js
│   │   └── watch.js
│   │
│   ├── tasks/
│   │   ├── assets.js
│   │   ├── clean.js
│   │   ├── fonts.js
│   │   ├── html.js
│   │   ├── images.js
│   │   ├── scripts.js
│   │   └── styles.js
│   │
│   ├── utils/
│   │   ├── environment.js
│   │   └── fonts.js
│   │
│   ├── config.js
│   └── index.js
│
├── gulpfile.js
├── package.json
└── README.md
```

The `src` directory contains source files.

The `dist` directory contains generated production/development output and should not be edited manually.

---

# HTML

HTML files are stored in:

```text
src/html/
```

All HTML files are copied to:

```text
dist/
```

In production, HTML is minified.

The minifier preserves structured data such as:

```html
<script type="application/ld+json">
    ...
</script>
```

---

# SCSS

The main stylesheet is:

```text
src/scss/main.scss
```

It is compiled into:

```text
dist/css/main.css
```

The pipeline uses:

* Dart Sass
* PostCSS
* Autoprefixer

Development output is expanded.

Production output is compressed.

Example:

```scss
.example {
    display: flex;
    user-select: none;
}
```

Autoprefixer adds required vendor prefixes according to its browser support configuration.

---

# JavaScript

The main JavaScript entry point is:

```text
src/js/main.js
```

JavaScript is bundled with **esbuild**.

Output:

```text
dist/js/
```

The current configuration uses:

```text
format: esm
target: es2020
```

Source maps are generated during development.

JavaScript is minified in production.

---

# Images

Source images are stored in:

```text
src/images/
```

Raster images are processed with **Sharp**.

SVG files are optimized with **SVGO**.

## Responsive images

Raster images can be generated at multiple widths:

```text
480
768
1024
1440
1920
```

For example:

```text
cat.jpg
```

can produce:

```text
cat-940x640-480.jpg
cat-940x640-768.jpg
cat-940x640-940.jpg

cat-940x640-480.webp
cat-940x640-768.webp
cat-940x640-940.webp

cat-940x640-480.avif
cat-940x640-768.avif
cat-940x640-940.avif
```

The original image dimensions are respected, so larger variants are not generated when they exceed the source dimensions.

## `<picture>`

The build system generates the image files but does **not** automatically modify HTML.

This allows complete control over the resulting markup.

Example:

```html
<picture>
    <source
        type="image/avif"
        srcset="
            /images/cat-940x640-480.avif 480w,
            /images/cat-940x640-768.avif 768w,
            /images/cat-940x640-940.avif 940w
        "
    >

    <source
        type="image/webp"
        srcset="
            /images/cat-940x640-480.webp 480w,
            /images/cat-940x640-768.webp 768w,
            /images/cat-940x640-940.webp 940w
        "
    >

    <img
        src="/images/cat-940x640-940.jpg"
        alt="Cat"
        width="940"
        height="640"
    >
</picture>
```

This approach keeps image processing and HTML presentation separate.

---

# Fonts

Source fonts are stored in:

```text
src/fonts/
```

TTF and OTF fonts are converted to:

```text
WOFF
WOFF2
```

The build system also generates:

```text
dist/css/fonts.css
```

For example:

```text
src/fonts/Roboto-Regular.ttf
```

produces:

```text
dist/fonts/Roboto-Regular.woff
dist/fonts/Roboto-Regular.woff2
```

and an appropriate `@font-face` declaration.

Example:

```css
@font-face {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src:
        url('../fonts/Roboto-Regular.woff2') format('woff2'),
        url('../fonts/Roboto-Regular.woff') format('woff');
}
```

Font metadata is extracted from the font itself and the filename.

Supported font weights include:

```text
100 Thin
200 ExtraLight
300 Light
400 Regular
500 Medium
600 SemiBold
700 Bold
800 ExtraBold
900 Black
```

Italic and oblique styles are supported.

---

# Assets

Static files that do not require processing should be placed in:

```text
src/assets/
```

They are copied directly to:

```text
dist/assets/
```

This is useful for:

* JSON files
* favicon files
* downloadable files
* miscellaneous static resources
* third-party assets

---

# Development server

The project uses a lightweight native Node.js development server.

It serves:

```text
dist/
```

at:

```text
http://localhost:3000
```

The server implements live reload using **Server-Sent Events (SSE)**.

No BrowserSync is required.

---

# File watching

During development, changes to the following files are watched:

```text
HTML
SCSS / CSS
JavaScript
Images
Fonts
Assets
```

After a relevant task completes, the browser is automatically reloaded.

---

# Configuration

Most project settings are centralized in:

```text
gulp/config.js
```

Main configuration sections:

```js
paths
server
html
styles
scripts
images
fonts
assets
watch
```

This makes the starter easy to adapt to another project.

For example:

```js
server: {
    port: 3000,
},
```

or responsive image widths:

```js
images: {
    responsive: {
        widths: [480, 768, 1024, 1440, 1920],
    },
},
```

---

# Build pipeline

The production build runs the following tasks in parallel:

```text
                 ┌── HTML
                 ├── Styles
                 ├── Scripts
Clean ───────────┼── Images
                 ├── Fonts
                 └── Assets
```

Development additionally starts:

```text
Dev Server
    +
File Watcher
    +
Live Reload
```

---

# Environment

The current environment is determined from:

```text
NODE_ENV
```

Development:

```bash
NODE_ENV=development
```

Production:

```bash
NODE_ENV=production
```

The npm scripts already set this automatically:

```bash
npm run dev
npm run build
```

---

# Recommended workflow

For development:

```bash
npm run dev
```

Work inside:

```text
src/
```

Do not edit generated files inside:

```text
dist/
```

When the project is ready for deployment:

```bash
npm run build
```

Deploy the contents of:

```text
dist/
```

---

# License

This project is intended to be used as a frontend starter/template.
