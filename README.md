# &lt;svga-player&gt; Custom Element Guide

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Project Views](https://h1dawood.com/github/view_counter.php?svga&label=views&color=blue&labelColor=555&logo=eye)

A self-contained, interactive guide and implementation of a `<svga-player>` custom HTML element. This project makes adding high-performance [SVGA animations](http://svga.io/) to your website as simple as using an `<img>` tag.

The entire project is a single HTML file that serves as both the documentation and the working code.

**[➡️ View the Live Demo Here](https://h1dawood.com/svga-player-element/)**
> **Note:** To make the live demo link work, you need to enable GitHub Pages in your repository's settings. Go to `Settings` > `Pages` and select the `main` branch as the source.

## ✨ Key Features

*   **Zero Dependencies (Almost!)**: Just add the official SVGA library and this custom element. No frameworks needed.
*   **Declarative & Reusable**: Use the `<svga-player>` tag directly in your HTML with simple attributes.
*   **Interactive Guide**: The `index.html` file is a complete, beautifully styled guide with copy-paste-ready examples.
*   **Dark Mode UI**: A sleek, modern dark-mode interface for pleasant reading and interaction.
*   **Full API Control**: Control animations via HTML attributes (`autoplay`, `loops`) or JavaScript methods (`play()`, `pause()`, `stop()`).
*   **Copy-to-Clipboard**: Easily copy code snippets with a single click.

## 🚀 Quick Start in 3 Steps

Follow these steps to use the `<svga-player>` element in your own project.

### Step 1: Add the SVGA Library

Paste this script into your HTML file, right before the closing `</body>` tag.

```html
<!-- SVGA Web Player Library (Required) -->
<script src="https://unpkg.com/svgaplayerweb@2.3.0/build/svga.min.js"></script>
```

### Step 2: Add the Custom Element Code

Paste the complete code below into a `<script>` tag, right after the library from Step 1. This is the "engine" for our new HTML tag.

```html
<!-- The <svga-player> Custom Element Code -->
<script>
  /**
   * SVGAPlayerElement: A Custom HTML Element for SVGA Animations.
   * This component wraps the svgaplayerweb library into a simple, reusable HTML tag.
   */
  class SVGAPlayerElement extends HTMLElement {
    constructor() {
      super();
      this.player = null;
      this.parser = null;
      this.canvas = null;
    }
    
    connectedCallback() {
      this.createCanvas();
      this.initializeSVGA();
      this.observeAttributes();
    }
    
    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.getAttribute('width') || 200;
      this.canvas.height = this.getAttribute('height') || 200;
      this.canvas.style.display = 'block';
      this.canvas.style.background = 'transparent';
      this.appendChild(this.canvas);
    }
    
    initializeSVGA() {
      if (!window.SVGA) {
        console.error('SVGA library is not loaded. Make sure the script is included.');
        return;
      }
      
      try {
        this.player = new SVGA.Player(this.canvas);
        this.parser = new SVGA.Parser(this.canvas);
        
        const src = this.getAttribute('src');
        if (src) {
          this.loadSVGA(src);
        }
      } catch (error) {
        console.error('Error initializing SVGA Player:', error);
      }
    }

    observeAttributes() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            this.handleAttributeChange(mutation.attributeName);
          }
        });
      });
      observer.observe(this, { attributes: true });
    }
    
    loadSVGA(url) {
      if (!this.parser || !this.player) return;
      
      this.player.clear();
      
      this.parser.load(url, 
        (videoItem) => {
          this.player.setVideoItem(videoItem);
          const loops = this.getAttribute('loops');
          this.player.loops = loops !== null ? (parseInt(loops, 10) || 0) : 1;
          if (this.hasAttribute('autoplay')) {
            this.player.startAnimation();
          }
        }, 
        (error) => {
          console.error(`Error loading SVGA file: ${url}`, error);
        }
      );
    }
    
    handleAttributeChange(attributeName) {
      const value = this.getAttribute(attributeName);
      switch (attributeName) {
        case 'src':
          if (value) this.loadSVGA(value);
          break;
        case 'width':
          this.canvas.width = value || 200;
          break;
        case 'height':
          this.canvas.height = value || 200;
          break;
        case 'loops':
          if (this.player) this.player.loops = value !== null ? (parseInt(value, 10) || 0) : 1;
          break;
      }
    }
    
    play() { if (this.player) this.player.startAnimation(); }
    pause() { if (this.player) this.player.pauseAnimation(); }
    stop() { if (this.player) this.player.stopAnimation(); }
    
    static get observedAttributes() {
      return ['src', 'width', 'height', 'loops', 'autoplay'];
    }
  }
  
  // Register the custom element, making <svga-player> usable in HTML.
  customElements.define('svga-player', SVGAPlayerElement);
</script>
```

### Step 3: Use the Element!

You can now use the `<svga-player>` tag anywhere in your HTML with simple attributes.

```html
<svga-player 
  src="https://raw.githubusercontent.com/svga/SVGA-Samples/master/angel.svga" 
  width="250" 
  height="250" 
  loops="0" 
  autoplay>
</svga-player>
```

## 📖 API Reference

### Attributes

| Attribute | Description                                          | Type    | Default        |
|-----------|------------------------------------------------------|---------|----------------|
| `src`     | The URL of the SVGA file to load.                    | String  | None (required)|
| `width`   | The width of the canvas in pixels.                   | Number  | 200            |
| `height`  | The height of the canvas in pixels.                  | Number  | 200            |
| `loops`   | Number of times to loop the animation (0 for infinite). | Number  | 1              |
| `autoplay`| If present, starts the animation automatically.      | Boolean | False          |

### Methods

You can control the element using JavaScript:

```javascript
const myPlayer = document.getElementById('my-svga-player');

// Starts or resumes the animation.
myPlayer.play();

// Pauses the animation.
myPlayer.pause();

// Stops the animation and resets to the beginning.
myPlayer.stop();
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
