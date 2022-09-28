class Display {
    constructor(canvas, renderMode, displayData) {
        this.canvas = canvas;
        this.ctx = canvas.getContext(renderMode);
        this.renderMode = renderMode;
        this.displayData = displayData;
        this.color = ["black", "white"];
        this.pixelSize = {
            x: canvas.width / 64,
            y: canvas.height / 32
        };
        if (this.renderMode == "webgl") {
            this.initGL();
        }
    }

    initGL() {
        this.posBuffer = this.ctx.createBuffer();
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.posBuffer);
        this.positions = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
        ];
        this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array(this.positions), this.ctx.STATIC_DRAW);


        this.vertexShader = `
        attribute vec4 aVertexPosition;
    
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
    
        void main() {
          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
      `;

        this.fragShader = `
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `;

        this.programID = 0;

        var vs = this.ctx.createShader(this.ctx.VERTEX_SHADER);
        var fs = this.ctx.createShader(this.ctx.FRAGMENT_SHADER);

        this.ctx.shaderSource(vs, this.vertexShader);
        this.ctx.shaderSource(fs, this.fragShader);

        this.ctx.compileShader(vs);
        this.ctx.compileShader(fs);

        var compileSuccess = this.ctx.getShaderParameter(vs, this.ctx.COMPILE_STATUS);
        if (!compileSuccess) {
            console.log("vs failed");
        }
        compileSuccess = this.ctx.getShaderParameter(vs, this.ctx.COMPILE_STATUS);
        if (!compileSuccess) {
            console.log("fs failed");
        }
    }

    indexFromCoord(x, y) {
        return x + (y * 64);
    }
    coordFromIndex(index) {
        var x = index % 64;
        var y = Math.floor(index / 64);

        return {
            x,
            y
        };
    }

    drawPixel(x, y, colorIndex) {
        this.ctx.fillStyle = this.color[colorIndex];
        this.ctx.fillRect(x * this.pixelSize.x, y * this.pixelSize.y, this.pixelSize.x, this.pixelSize.y);
    }

    drawPixelByIndex(index, colorIndex) {
        var coord = this.coordFromIndex(index);
        this.ctx.fillStyle = this.color[colorIndex];
        this.ctx.fillRect(coord.x * this.pixelSize.x, coord.y * this.pixelSize.y, this.pixelSize.x, this.pixelSize.y);
    }

    setPixelBuffer(index) {
        this.displayData[index] ^= 1;
    }

    setPixelBufferXY(x, y) {
        var index = this.indexFromCoord(x, y);
        this.setPixelBuffer(index);
    }

    draw2D() {
        for (var i = 0; i < this.displayData.length; i++) {
            var coord = this.coordFromIndex(i);
            var colorIndex = this.displayData[i];
            this.drawPixel(coord.x, coord.y, colorIndex);
        }
    }

    draw() {
        if (this.renderMode == "webgl") {
            this.drawGL();
        } else {
            this.draw2D();
        }
    }

}