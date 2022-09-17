class MainLoop {
    constructor(callback) {
        this.paused = true;
        this.oldTime = 0;
        this.currentTime = 0;

        this.instructionsPerSecond = 10;
        this.targetFrameRate = 1 / this.instructionsPerSecond;

        this.instructionsLeft = this.instructionsPerSecond;
        this.timer = 1000;
        this.callback = callback;
    }

    main() {
        this.mainLoopID = window.requestAnimationFrame(this.main.bind(this));
        this.oldTime = this.currentTime;
        this.currentTime = window.performance.now();
        this.frameTime = this.currentTime - this.oldTime;

        if (this.instructionsLeft > 0) {
            this.instructionsLeft--;
            this.callback();
        } else {
            if (this.timer > 0) {
                this.timer -= this.frameTime;
            } else {
                this.instructionsLeft = this.instructionsPerSecond;
                this.timer = 1000;
            }
        }
    }



    toggle() {
        this.paused = !this.paused;
        if (this.paused) {
            window.cancelAnimationFrame(this.mainLoopID);
        }
        else {
            this.oldTime = this.currentTime = 0;
            this.timer = 0;
            this.currentTime = window.performance.now();
            this.main();
        }
    }

    start() {
        this.paused = false;
        this.oldTime = this.currentTime = 0;
        this.timer = 0;
        this.currentTime = window.performance.now();
        this.main();
    }

    stop() {
        this.paused = false;
        window.cancelAnimationFrame(this.mainLoopID);
    }
}