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
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data: () => ({
            settings: {
                bubbleCount: 50,
                maxDiam: 160,
                minDiam: 40,
            },
            bubbles: [],
            text: 'a n d y _ c r o c k e t t ;'.split(' ')
        }),
        mounted() {
            setTimeout(() => {
                this.addLetter(this.text, 0)
                this.doBubbles();
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
                let width  = window.innerWidth;
                let height = window.innerHeight + 4;
                let canvas = this.$refs.canvas;

                canvas.width  = width;
                canvas.height = height;

                if (this.bubbles.length > 0) {
                    for (let i = 0; i < this.bubbles.length; i++) {
                        this.bubbles[i].startX    = (width / this.bubbles[i].origWidth) * this.bubbles[i].startX
                        this.bubbles[i].origWidth = width
                    }
                }
            },
            doBubbles() {
                let width  = window.innerWidth;
                let height = window.innerHeight + 4;
                let canvas = this.$refs.canvas;

                canvas.width  = width;
                canvas.height = height;

                let ctx = canvas.getContext('2d');
                for (let i = 0; i < this.settings.bubbleCount; i++) {

                    // give random diameter, x, y, opacity, speed, amplitude, and outline or fill
                    let diam      = (Math.random() * (this.settings.maxDiam - this.settings.minDiam)) + this.settings.minDiam,
                        x         = Math.floor(Math.random() * width),
                        y         = height + (diam / 2) + Math.random() * 100,
                        opacity   = Math.random(1),
                        speed     = Math.random() + 0.3,
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

                let count   = 0;
                // called on each frame
                let animate = () => {
                    width  = window.innerWidth;
                    height = window.innerHeight + 4;

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
                        b.y = b.y - b.speed + Math.cos(count / b.amplitude);
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
