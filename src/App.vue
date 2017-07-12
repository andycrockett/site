<template>
    <div id="app">
        <header>
            <div class="title">
                <div class="title-text" ref="text"></div>
                <div class="cursor"></div>
            </div>
            <div class="links">
                <a href="https://github.com/andycrockett">github</a>
                &nbsp;&middot;&nbsp;
                <a href="https://www.linkedin.com/in/andy-crockett-97695a91/">LinkedIn</a>
            </div>
        </header>
        <div class="graphics">
            <canvas ref="canvas"
                    :width="settings.canvasWidth * settings.pixelRatio"
                    :height="settings.canvasHeight * settings.pixelRatio"
                    :style="{
                        width: settings.canvasWidth + 'px',
                        height: settings.canvasHeight + 'px'
                    }"
            ></canvas>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data: () => ({
            settings: {
                bubbleCount: 50,
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
                let width = this.settings.canvasWidth = window.innerWidth;
                let height = this.settings.canvasHeight = window.innerHeight + 4;
                this.settings.pixelRatio = window.devicePixelRatio

                if (this.bubbles.length > 0) {
                    for (let i = 0; i < this.bubbles.length; i++) {
                        this.bubbles[i].startX    = (width / this.bubbles[i].origWidth) * this.bubbles[i].startX
                        this.bubbles[i].origWidth = width
                    }
                }
            },
            setupBubbles() {
                let width = this.settings.canvasWidth = window.innerWidth;
                let height = this.settings.canvasHeight = window.innerHeight + 4;
                let maxDiam = Math.min(Math.max(width / 10, 50), 160);
                let minDiam = Math.max(width / 50, 20);

                for (let i = 0; i < this.settings.bubbleCount; i++) {
                    // give random diameter, x, y, opacity, speed, amplitude
                    let diam      = (Math.random() * (maxDiam - minDiam)) + minDiam,
                        x         = Math.floor(Math.random() * width),
                        y         = height + (diam / 2) + Math.random() * 100,
                        opacity   = Math.random(1),
                        speed     = Math.random() + Math.floor(height / 2000),
                        amplitude = (Math.random() * 50) + 45;

                    // store bubble properties in memory
                    let bubble = {
                        origWidth: width,
                        startX: x,
                        x: x,
                        y: y,
                        radius: diam / 2,
                        speed: speed,
                        amplitude: amplitude,
                        color: 'rgba(' + Math.round((Math.random() * 200)) + ',200,200,' + Math.min((Math.max(opacity, 0.1)), 0.4) + ')'
                    };

                    this.bubbles.push(bubble);
                }
            },
            animateBubbles() {

                let ctx = this.$refs.canvas.getContext('2d');
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
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
                        b.y = (b.y - b.speed) - Math.sin(count / b.amplitude);
                        b.x = b.startX + Math.sin(count / b.amplitude) * 100;

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
