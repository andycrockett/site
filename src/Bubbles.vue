<template>
    <v-touch @panstart="handlePress" @panend="handlePressUp" @pan="handlePan">
        <canvas ref="canvas" :style="{
            width: settings.canvasWidth + 'px',
            height: settings.canvasHeight + 'px'
        }"></canvas>
    </v-touch>
</template>

<script>
    export default {
        name: 'bubbles',
        data: () => ({
            settings: {
                bubbleCount: 100,
                canvasWidth: 0,
                canvasHeight: 0,
                pixelRatio: window.devicePixelRatio || 1
            },
            anchorX: false,
            anchorY: false,
            anchorActive: false,
            bubbles: [],
        }),
        mounted() {
            this.setupBubbles();
            setTimeout(() => {
                this.animateBubbles();
            }, 2000);
            window.addEventListener('resize', this.resizeCanvas)
            window.addEventListener('mousedown', this.handleMouseDown)
            window.addEventListener('mousemove', this.handleMouseMove)
            window.addEventListener('mouseup', this.handleMouseUp)
            window.addEventListener('tap', this.handleClick)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.resizeCanvas)
            window.removeEventListener('mousedown', this.handleMouseDown)
            window.removeEventListener('mousemove', this.handleMouseMove)
            window.removeEventListener('mouseup', this.handleMouseUp)
            window.removeEventListener('tap', this.handleClick)
        },
        methods: {
            handlePress(e) {
                this.anchorX      = e.center.x
                this.anchorY      = e.center.y
                this.anchorActive = true
            },
            handlePressUp(e) {
                this.anchorX      = false
                this.anchorY      = false
                this.anchorActive = false
            },
            handlePan(e) {
                if (this.anchorActive) {
                    this.anchorX = e.center.x
                    this.anchorY = e.center.y
                }
            },
            handleMouseDown(e) {
                this.anchorX      = e.clientX
                this.anchorY      = e.clientY
                this.anchorActive = true
            },
            handleMouseMove(e) {
                if (this.anchorActive) {
                    this.anchorX = e.clientX
                    this.anchorY = e.clientY
                }
            },
            handleMouseUp(e) {
                this.anchorX      = false
                this.anchorY      = false
                this.anchorActive = false
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
                }, 200)
            },
            setupBubbles() {
                let width = this.settings.canvasWidth = window.innerWidth;
                let height = this.settings.canvasHeight = window.innerHeight + 4;
                let ratio = this.settings.pixelRatio = window.devicePixelRatio
                let maxDiam = 30;
                let minDiam = 5;

                this.$refs.canvas.width  = width * ratio;
                this.$refs.canvas.height = height * ratio;

                let canvas = this.$refs.canvas.getContext('2d');
                canvas.scale(ratio, ratio)

                for (let i = 0; i < this.settings.bubbleCount; i++) {
                    // give random diameter, x, y, opacity, speed, amplitude
                    let diam      = (Math.random() * (maxDiam - minDiam)) + minDiam,
                        x         = Math.floor(Math.random() * width),
                        y         = height + (diam / 2) + Math.random() * 100,
                        opacity   = Math.random() * 0.3,
                        speed     = Math.max((Math.random() + Math.random()) * Math.min(Math.random(), 0.8), 0.15),
                        amplitude = (Math.random() * 400) + 180;

                    // store bubble properties in memory
                    let bubble = {
                        x: x,
                        y: y,
                        friction: 0.7 + (Math.random() / 10),
                        xMomentum: (speed * 300),
                        yMomentum: 0,
                        radius: diam / 2,
                        speed: Math.min(((0.5 + Math.random()) / diam) * 2, 0.9),
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

                        // if reached top, send to bottom
                        if (b.y <= b.radius * -2) {
                            b.y = height + b.radius;
                        }
                        // if reached bottom, send to top
                        if (b.y >= height + (b.radius * 2)) {
                            b.y = -b.radius * 2;
                        }
                        // if reached left side, send to right side
                        if (b.x < -b.radius * 2) {
                            b.x = width + (b.radius * 2);
                        }
                        // if reached right side, send to left side
                        if (b.x > width + (b.radius * 2)) {
                            b.x = -b.radius * 2;
                        }

                        // move upwards, with repetitive oscillation on the x-axis
                        let xSpeed    = Math.sin(count / b.amplitude) / 4
                        let yModifier = 0
                        let xModifier = 0

                        if (this.anchorX !== false) {
                            let distance = Math.sqrt(Math.pow(b.y - this.anchorY, 2) + Math.pow(b.x - this.anchorX, 2))
                            let angle    = Math.atan2(b.y - this.anchorY, b.x - this.anchorX);
                            yModifier    = -Math.sin(angle) * Math.max((Math.min(width / 4, 300) - distance) / Math.min(width / 4, 300), 0)
                            xModifier    = -Math.cos(angle) * Math.max((Math.min(width / 4, 300) - distance) / Math.min(width / 4, 300), 0)
                        }

                        b.yMomentum = (b.yMomentum + b.speed + yModifier) * b.friction
                        b.xMomentum = (b.xMomentum + xSpeed + xModifier) * b.friction
                        b.y         = b.y - b.yMomentum
                        b.x         = b.x - b.xMomentum

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
