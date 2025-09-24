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
        
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
              this.handleAttributeChange(mutation.attributeName);
            }
          });
        });
        observer.observe(this, { attributes: true });
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
          console.error('SVGA library not loaded');
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
          console.error('Error initializing SVGA:', error);
          this.showError('Failed to initialize SVGA player');
        }
      }
      
      loadSVGA(url) {
        if (!this.parser || !this.player) {
          console.error('SVGA not initialized');
          return;
        }
        
        this.parser.load(url, (videoItem) => {
          try {
            this.player.setVideoItem(videoItem);
            
            const loops = this.getAttribute('loops');
            this.player.loops = loops !== null ? (parseInt(loops) || 0) : 1;
            
            const autoplay = this.getAttribute('autoplay');
            if (autoplay === 'true' || autoplay === '') {
              this.player.startAnimation();
            }
          } catch (error) {
            console.error('Error setting video item:', error);
            this.showError('Failed to load SVGA animation');
          }
        }, (error) => {
          console.error('Error loading SVGA:', error);
          this.showError('Failed to load SVGA file');
        });
      }
      
      showError(message) {
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
      }
      
      handleAttributeChange(attributeName) {
        switch (attributeName) {
          case 'src':
            const newSrc = this.getAttribute('src');
            if (newSrc) {
              this.loadSVGA(newSrc);
            }
            break;
          case 'width':
            this.canvas.width = this.getAttribute('width') || 200;
            break;
          case 'height':
            this.canvas.height = this.getAttribute('height') || 200;
            break;
        }
      }
      
      play() {
        if (this.player) this.player.startAnimation();
      }
      
      pause() {
        if (this.player) this.player.pauseAnimation();
      }
      
      stop() {
        if (this.player) this.player.stopAnimation();
      }
      
      static get observedAttributes() {
        return ['src', 'width', 'height', 'loops', 'autoplay'];
      }
    }
    
    customElements.define('svga-player', SVGAPlayerElement);
    
    function waitForSVGA() {
      if (window.SVGA) {
        console.log('SVGA library loaded successfully');
      } else {
        setTimeout(waitForSVGA, 100);
      }
    }
    waitForSVGA();