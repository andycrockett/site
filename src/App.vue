<template>
    <div id="app">
        <header>
            <div class="title">
                <a href="/" class="title-text" ref="text"></a>
                <div class="cursor"></div>
            </div>
            <div class="links">
                > <a href="https://github.com/andycrockett">github</a>
                <br/>
                > <a href="https://www.linkedin.com/in/andy-crockett-97695a91/">LinkedIn</a>
                <br/>
                > <a href="https://facebook.com/andyhcrockett">Facebook</a>
            </div>
        </header>
        <canvas ref="canvas"
                :style="{width: settings.canvasWidth + 'px', height: settings.canvasHeight + 'px'}"></canvas>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data: () => ({
            settings: {
                bubbleCount: 60,
                canvasWidth: 0,
                canvasHeight: 0,
                pixelRatio: window.devicePixelRatio || 1
            },
            bubbles: [],
            text: 'a n d y _ c r o c k e t t ;'.split(' ')
        }),
        mounted() {
            this.setupBubbles();
            setTimeout(() => {
                this.addLetter(this.text, 0)
                this.animateBubbles();
            }, 2000);
            window.addEventListener('resize', this.resizeCanvas)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.resizeCanvas)
        },
        methods: {
            addLetter(letterArray, position) {
                let textContainer       = this.$refs.text;
                textContainer.innerText = textContainer.innerText + (letterArray[position])
                if (letterArray[position + 1]) {
                    setTimeout(() => {
                        this.addLetter(letterArray, position + 1)
                    }, Math.max(400 * Math.random(), 125))
                }
            },
            resizeCanvas() {
                setTimeout(() => {
                    let width = this.settings.canvasWidth = window.innerWidth;
                    let height = this.settings.canvasHeight = window.innerHeight + 4;
                    let ratio = this.settings.pixelRatio = window.devicePixelRatio
                    this.$refs.canvas.width  = width * ratio;
                    this.$refs.canvas.height = height * ratio;
                    let canvas               = this.$refs.canvas.getContext('2d');
                    canvas.scale(this.settings.pixelRatio, this.settings.pixelRatio)

                    if (this.bubbles.length > 0) {
                        for (let i = 0; i < this.bubbles.length; i++) {
                            this.bubbles[i].startX    = (width / this.bubbles[i].origWidth) * this.bubbles[i].startX
                            this.bubbles[i].origWidth = width
                        }
                    }
                }, 200)
            },
            setupBubbles() {
                let width = this.settings.canvasWidth = window.innerWidth;
                let height = this.settings.canvasHeight = window.innerHeight + 4;
                let ratio = this.settings.pixelRatio = window.devicePixelRatio
                let maxDiam = Math.min(Math.max(width / 20, 50), 160);
                let minDiam = Math.max(width / 60, 10);

                this.$refs.canvas.width  = width * ratio;
                this.$refs.canvas.height = height * ratio;

                let canvas = this.$refs.canvas.getContext('2d');
                canvas.scale(ratio, ratio)

                for (let i = 0; i < this.settings.bubbleCount; i++) {
                    // give random diameter, x, y, opacity, speed, amplitude
                    let diam      = (Math.random() * (maxDiam - minDiam)) + minDiam,
                        x         = Math.floor(Math.random() * (width / 1.5)) + (width / 6),
                        y         = height + (diam / 2) + Math.random() * 100,
                        opacity   = Math.random() * 0.3,
                        speed     = Math.max(Math.min(Math.random(), 0.8), 0.1),
                        amplitude = (Math.random() * 400) + 180;

                    // store bubble properties in memory
                    let bubble = {
                        origWidth: width,
                        startX: x,
                        x: x,
                        y: y,
                        radius: diam / 2,
                        speed: speed,
                        amplitude: amplitude,
                        color: 'rgba(255,255,255,' + Math.min((Math.max(opacity, 0.02)), 0.3) + ')'
                    };

                    this.bubbles.push(bubble);
                }
            },
            animateBubbles() {

                let ctx     = this.$refs.canvas.getContext('2d');
                let count   = 0;
                // called on each frame
                let animate = () => {
                    let width  = this.settings.canvasWidth;
                    let height = this.settings.canvasHeight;

                    count++;

                    // clear canvas
                    ctx.clearRect(0, 0, width, height);

                    for (let i = 0; i < this.bubbles.length; i++) {
                        let b = this.bubbles[i];

                        // if reached top, send back to bottom
                        if (b.y <= b.radius * -2) {
                            b.y = height + b.radius;
                        }

                        // move upwards, with repetitive oscillation on the x-axis
                        b.y = (b.y - b.speed);
                        b.x = b.startX + Math.sin((count * 2) / b.amplitude) * 100;

                        ctx.beginPath();

                        ctx.fillStyle = b.color;
                        ctx.arc(b.x, b.y, b.radius, 0, 2 * Math.PI, false);
                        ctx.fill();
                    }
                }


                // shim layer with setTimeout fallback
                window.requestAnimFrame = (function () {
                    return window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        function (callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };
                })();
                (function animloop() {
                    requestAnimFrame(animloop);
                    animate();
                })();
            }
        }
    }
</script>
