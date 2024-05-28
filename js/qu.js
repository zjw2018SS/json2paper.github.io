function applyDynamicBackground() {
    "use strict";
    let img_qu = document.createElement("img")
    img_qu.src = "data:image/png;base64,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"
    img_qu.alt = ""
    img_qu.id="node"
    let body=document.getElementsByTagName("body")[0]
    body.appendChild(img_qu)
    // 动态添加CSS样式
    const style = document.createElement('style');
    style.innerHTML = `
/*         body, html {
            position: absolute;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        } */
        canvas {
            position: absolute;
            width: 100%;
            height: 100%;
            background: #000;
            cursor: pointer;
            z-index:-1
        }
        #node {
            display: none;
        }
    `;
    document.head.appendChild(style);
    {
        const Tentacle = class {
            constructor() {
                this.length = 40 + Math.round(80 * Math.random());
                this.vel = 2;
                this.amp = 0.2 + 0.4 * Math.random();
                this.freq = 0.05 + 0.3 * Math.random();
                this.dir = 2 * Math.PI * Math.random();
                this.frame = 0;
                this.free = true;
                this.vDir = 0;
                this.nodes = [];
                for (let i = 0; i < this.length; i++) {
                    this.nodes.push(
                        new Tentacle.Node(
                            this,
                            i,
                            canvas.width * Math.random(),
                            canvas.height * Math.random()
                        )
                    );
                }
            }
            move() {
                const head = this.nodes[0];
                if (head.x > canvas.width) {
                    head.x--;
                    this.dir += 0.1;
                } else if (head.x < 0) {
                    head.x++;
                    this.dir += 0.1;
                }
                if (head.y > canvas.height) {
                    head.y--;
                    this.dir += 0.1;
                } else if (head.y < 0) {
                    head.y++;
                    this.dir += 0.1;
                }
                const dx = pointer.x - head.x;
                const dy = pointer.y - head.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) {
                    if (this.free) {
                        this.dir = Math.atan2(dy, dx);
                        this.vel = 1 + dist * 0.1;
                        if (dist < 1) {
                            this.free = false;
                        }
                    }
                } else {
                    this.vel = 2;
                    this.free = true;
                }
                this.vDir += 0.05 * (Math.random() - Math.random());
                this.dir += this.vDir;
                this.vDir *= 0.9;
                head.x += this.vel * Math.cos(this.dir);
                head.y += this.vel * Math.sin(this.dir);
                this.frame += this.freq;
                const iDir = this.amp * Math.cos(this.frame);
                const iHead = this.nodes[1];
                iHead.x = head.x - this.vel * Math.cos(this.dir + iDir);
                iHead.y = head.y - this.vel * Math.sin(this.dir + iDir);
                for (let i = 2; i < this.length; i++) {
                    this.nodes[i].move();
                }
            }
        };
        Tentacle.Node = class {
            constructor(tentacle, i, x, y) {
                this.tentacle = tentacle;
                const s = tentacle.length - i;
                this.prev = i > 0 ? tentacle.nodes[i - 1] : null;
                this.pprev = i > 1 ? tentacle.nodes[i - 2] : null;
                this.size = 6 + s * s / tentacle.length;
                this.x = x;
                this.y = y;
                this.a = 0;
                this.img = document.getElementById("node");
            }
            move() {
                const dx = this.x - this.pprev.x;
                const dy = this.y - this.pprev.y;
                this.a = Math.atan2(dy, dx);
                const d = Math.sqrt(dx * dx + dy * dy);
                this.x = this.prev.x + dx * 10 / d;
                this.y = this.prev.y + dy * 10 / d;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.a + 0.4);
                ctx.drawImage(
                    this.img,
                    -this.size * 0.5,
                    -this.size * 0.5,
                    this.size,
                    this.size
                );
                ctx.restore();
            }
        };
        const canvas = {
            init() {
                this.elem = document.createElement("canvas");
                document.body.appendChild(this.elem);
                this.resize();
                window.addEventListener("resize", () => this.resize(), false);
                return this.elem.getContext("2d");
            },
            resize() {
                this.width = this.elem.width = this.elem.offsetWidth;
                this.height = this.elem.height = this.elem.offsetHeight;
            }
        };
        const pointer = {
            init(canvas) {
                this.x = -1000;
                this.y = 0;
                ["mousemove", "touchstart", "touchmove"].forEach((event, touch) => {
                    document.addEventListener(
                        event,
                        e => {
                            if (touch) {
                                e.preventDefault();
                                this.x = e.targetTouches[0].clientX;
                                this.y = e.targetTouches[0].clientY;
                            } else {
                                this.x = e.clientX;
                                this.y = e.clientY;
                            }
                        },
                        false
                    );
                });
            }
        };
        const ctx = canvas.init();
        pointer.init(canvas);
        const tentacles = [];
        for (let i = 0; i < 12; i++) tentacles.push(new Tentacle());
        const run = () => {
            requestAnimationFrame(run);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const tentacle of tentacles) {
                tentacle.move();
            }
        };
        run();
    }
}
applyDynamicBackground()
// 确保DOM加载完成后再执行初始化函数
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', applyDynamicBackground);
// } else {
//     applyDynamicBackground();
// }