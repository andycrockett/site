<template>
    <v-touch @pan="handlePan">
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
            invertAnchor: false,
            bubbles: [],
        }),
        mounted() {
            this.setupBubbles();
            setTimeout(() => {
                this.animateBubbles();
            }, 2000);
            window.addEventListener('resize', this.resizeCanvas)
            window.addEventListener('mousemove', this.handleMouseMove)
            window.addEventListener('mousedown', this.handleMouseDown)
            window.addEventListener('mouseup', this.handleMouseUp)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.resizeCanvas)
            window.removeEventListener('mousemove', this.handleMouseMove)
            window.removeEventListener('mousedown', this.handleMouseDown)
            window.removeEventListener('mouseup', this.handleMouseUp)
        },
        methods: {
            handlePan(e) {
                this.anchorX = e.center.x
                this.anchorY = e.center.y
            },
            handleMouseMove(e) {
                this.anchorX = e.clientX
                this.anchorY = e.clientY
            },
            handleMouseDown(e) {
                this.invertAnchor = true
            },
            handleMouseUp(e) {
                this.invertAnchor = false
            },
            resizeCanvas() {
                // wait a bit for slower to devices to finish their resizing/reorientation
                // otherwise incorrect values may be used
                setTimeout(() => {
                    let canvas = this.$refs.canvas
                    let width  = this.settings.canvasWidth = window.innerWidth
                    let height = this.settings.canvasHeight = window.innerHeight
                    let ratio = this.settings.pixelRatio = window.devicePixelRatio
                    let ctx       = canvas.getContext('2d');
                    canvas.width  = width * ratio;
                    canvas.height = height * ratio;
                    ctx.scale(this.settings.pixelRatio, this.settings.pixelRatio)
                }, 200)
            },
            setupBubbles() {
                let width = this.settings.canvasWidth = window.innerWidth
                let height = this.settings.canvasHeight = window.innerHeight
                let ratio = this.settings.pixelRatio = window.devicePixelRatio
                let maxDiam = 30;
                let minDiam = 5;

                let canvas = this.$refs.canvas
                let ctx    = canvas.getContext('2d');

                canvas.width  = width * ratio;
                canvas.height = height * ratio;
                ctx.scale(ratio, ratio)

                for (let i = 0; i < this.settings.bubbleCount; i++) {
                    // give random diameter, x, y, opacity, speed, amplitude
                    let diam      = (Math.random() * (maxDiam - minDiam)) + minDiam,
                        x         = Math.floor(Math.random() * (width / 1.5) + (width / 6)),
                        y         = height + (diam / 2) + Math.random() * 100,
                        opacity   = Math.random() * 0.3,
                        amplitude = (Math.random() * 400) + 180;

                    // store bubble properties in memory
                    let bubble = {
                        x: x,
                        y: y,
                        offset: i * 30,
                        friction: 0.75 + (Math.random() / 10),
                        xMomentum: 0,
                        yMomentum: 0,
                        radius: diam / 2,
                        speed: Math.min((3 + Math.random()) * Math.max((0.25 + Math.random()) / diam, 0.01), 1),
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

                    count += 2;

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
                        // use momentum for smoother motion
                        let xSpeed    = Math.sin((count + b.offset) / b.amplitude) / 6
                        let yModifier = 0
                        let xModifier = 0

                        // use x/y modifier on momentum to push bubbles away from the anchor point when defined
                        if (this.anchorX !== false) {
                            let distance = Math.sqrt(Math.pow(b.y - this.anchorY, 2) + Math.pow(b.x - this.anchorX, 2))
                            let angle    = Math.atan2(b.y - this.anchorY, b.x - this.anchorX);
                            yModifier    = -Math.sin(angle) * Math.max((Math.min(width / 8, 400) - distance) / Math.min(width / 12, 300), 0)
                            xModifier    = -Math.cos(angle) * Math.max((Math.min(width / 8, 400) - distance) / Math.min(width / 12, 300), 0)
                            if (this.invertAnchor) {
                                yModifier = -yModifier
                                xModifier = -xModifier
                            }
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
