
class CHIP8 {
    constructor(rom) {

        this.display = new Array(64 * 32)
        this.RAM = new Array(0xFFF)
        this.gpReg = new Array(16)
        this.iRegister = 0
        this.delayRegister = 0
        this.soundRegister = 0
        this.programCounter = 0x200

        this.stackPointer = -1;
        this.stack = new Array(16)
        this.keys = new Array(16)

        var font = [0xF0,
            0x90,
            0x90,
            0x90,
            0xF0,
            0x20,
            0x60,
            0x20,
            0x20,
            0x70,
            0xF0,
            0x10,
            0xF0,
            0x80,
            0xF0,
            0xF0,
            0x10,
            0xF0,
            0x10,
            0xF0,
            0x90,
            0x90,
            0xF0,
            0x10,
            0x10,
            0xF0,
            0x80,
            0xF0,
            0x10,
            0xF0,
            0xF0,
            0x80,
            0xF0,
            0x90,
            0xF0,
            0xF0,
            0x10,
            0x20,
            0x40,
            0x40,
            0xF0,
            0x90,
            0xF0,
            0x90,
            0xF0,
            0xF0,
            0x90,
            0xF0,
            0x10,
            0xF0,
            0xF0,
            0x90,
            0xF0,
            0x90,
            0x90,
            0xE0,
            0x90,
            0xE0,
            0x90,
            0xE0,
            0xF0,
            0x80,
            0x80,
            0x80,
            0xF0,
            0xE0,
            0x90,
            0x90,
            0x90,
            0xE0,
            0xF0,
            0x80,
            0xF0,
            0x80,
            0xF0,
            0xF0,
            0x80,
            0xF0,
            0x80,
            0x80];


        this.gpReg.fill(0);
        this.display.fill(0);
        this.stack.fill(0);

        this.RAM.fill(0);
        for (var i = 0; i < font.length; i++) {
            this.RAM[i] = font[i];
        }

        this.keyPress = false;

        if (rom != null) {
            if (rom.length > 0xfff) {
                alert("File too big");
            }
            for (var i = 0; i < rom.length; i++) {
                this.RAM[this.programCounter + i] = rom[i];
            }
        }

    }

    loadRom(romBinary) {
        if (romBinary.length > 0xfff) {
            alert("File too big");
            return;
        }
        for (var i = 0; i < romBinary.length; i++) {
            this.RAM[0x200 + i] = romBinary[i];
        }
    }

    step() {
        var opcode = this.RAM[this.programCounter] << 8;
        opcode |= this.RAM[this.programCounter + 1];
        this.programCounter += 2;
        this.decode(opcode);
    }
    decode(opcode) {

        switch ((opcode >> 0xc)) {
            case 0x0:
                {
                    switch (opcode & 0x00ff) {
                        case 0xE0:
                            {
                                this.i00E0();
                            }
                            break;
                        case 0xEE:
                            {
                                this.i00EE();
                            }
                    }
                }
                break;
            case 0x1:
                {
                    this.i1nnn(opcode & 0x0fff);
                }
                break;
            case 0x2:
                {
                    this.i2nnn(opcode & 0x0fff);
                }
                break;
            case 0x3:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    this.i3xkk(x, kk);
                }
                break;
            case 0x4:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    this.i4xkk(x, kk);
                }
                break;
            case 0x5:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    this.i5xy0(x, y);
                }
                break;
            case 0x6:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    this.i6xkk(x, kk);
                }
                break;
            case 0x7:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    this.i7xkk(x, kk);
                }
                break;
            case 0x8:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    switch (opcode & 0x000f) {
                        case 0:
                            {
                                this.i8xy0(x, y);
                            }
                            break;
                        case 1:
                            {
                                this.i8xy1(x, y);
                            }
                            break;
                        case 2:
                            {
                                this.i8xy2(x, y);
                            }
                            break;
                        case 3:
                            {
                                this.i8xy3(x, y);
                            }
                            break;
                        case 4:
                            {
                                this.i8xy4(x, y);
                            }
                            break;
                        case 5:
                            {
                                this.i8xy5(x, y);
                            }
                            break;
                        case 6:
                            {
                                this.i8xy6(x, y);
                            }
                            break;
                        case 7:
                            {
                                this.i8xy7(x, y);
                            }
                            break;
                        case 0xe:
                            {
                                this.i8xyE(x, y);
                            }
                            break;
                    }
                }
                break;
            case 0x9:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    this.i9xy0(x, y);
                }
                break;
            case 0xA:
                {
                    this.iAnnn(opcode & 0x0fff);
                }
                break;
            case 0xB:
                {
                    this.iBnnn(opcode & 0x0fff);
                }
                break;
            case 0xC:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    this.iCxkk(x, kk);
                }
                break;
            case 0xD:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    var n = (opcode & 0x000f);
                    this.iDxyn(x, y, n);
                }
                break;
            case 0xE:
                {
                    var x = opcode & 0x0f00;
                    switch (opcode & 0x00ff) {
                        case 0x9E:
                            {
                                this.iEx9E(x)
                            }
                            break;
                        case 0xA1:
                            {
                                this.iExA1(x)
                            }
                            break;
                    }
                }
                break;
            case 0xF:
                {
                    var x = opcode & 0x0f00;
                    x >>= 8;
                    switch (opcode & 0x00ff) {
                        case 0x07:
                            {
                                this.iFx07(x)
                            }
                            break;
                        case 0x0A:
                            {
                                this.iFx0A(x)
                            }
                            break;
                        case 0x15:
                            {
                                this.iFx15(x)
                            }
                            break;
                        case 0x18:
                            {
                                this.iFx18(x)
                            }
                            break;
                        case 0x1e:
                            {
                                this.iFx1E(x)
                            }
                            break;
                        case 0x29:
                            {
                                this.iFx29(x)
                            }
                            break;
                        case 0x33:
                            {
                                this.iFx33(x)
                            }
                            break;
                        case 0x55:
                            {
                                this.iFx55(x)
                            }
                            break;
                        case 0x65:
                            {
                                this.iFx65(x)
                            }
                            break;
                    }
                }
                break;
        }
    }

    i00E0() {
        this.display.fill(0);
    }
    i00EE() {
        this.programCounter = this.stack[this.stackPointer];
        this.stackPointer--;
    }

    i1nnn(nnn) {
        this.programCounter = nnn;
    }

    i2nnn(nnn) {
        this.stackPointer++;
        this.stack[this.stackPointer] = this.programCounter;
        this.programCounter = nnn;
    }

    i3xkk(x, kk) {
        if (this.gpReg[x] == kk) {
            this.programCounter += 2;
        }
    }

    i4xkk(x, kk) {
        if (this.gpReg[x] != kk) {
            this.programCounter += 2;
        }

    }

    i5xy0(x, y) {
        if (this.gpReg[x] == this.gpReg[y]) {
            this.programCounter += 2;
        }
    }

    i6xkk(x, kk) {
        this.gpReg[x] = kk;
    }

    i7xkk(x, kk) {
        this.gpReg[x] += kk;
        this.gpReg[x] &= 0xff;
    }

    i8xy0(x, y) {
        this.gpReg[x] = this.gpReg[y];
    }

    i8xy1(x, y) {
        this.gpReg[x] |= this.gpReg[y];
    }

    i8xy2(x, y) {
        this.gpReg[x] &= this.gpReg[y];
    }

    i8xy3(x, y) {
        this.gpReg[x] ^= this.gpReg[y];
    }

    i8xy4(x, y) {
        this.gpReg[0xf] = 0;
        this.gpReg[x] += this.gpReg[y];
        if (this.gpReg[x] > 0xff) {
            this.gpReg[0xf] = 1;
        }
        this.gpReg[x] &= 0xff;
    }

    i8xy5(x, y) {
        this.gpReg[0xf] = 0;
        if (this.gpReg[x] > this.gpReg[y]) {
            this.gpReg[0xf] = 1;
        }
        this.gpReg[x] -= this.gpReg[y];
        this.gpReg[x] &= 0xff;
    }

    i8xy6(x, y) {
        if (this.original_inst8xy6) {
            this.gpReg[x] = this.gpReg[y];
        }

        this.gpReg[0xf] = 0;
        if (this.gpReg[x] & 0x80 == 1) {
            this.gpReg[0xf] = 1;
        }
        this.gpReg[x] >>= 1;

    }

    i8xy7(x, y) {
        this.gpReg[0xf] = 0;
        if (this.gpReg[x] < this.gpReg[y]) {
            this.gpReg[0xf] = 1;
            this.gpReg[x] = 0;
        }
        this.gpReg[x] = this.gpReg[y] - this.gpReg[x];
    }

    i8xyE(x, y) {
        if (this.original_inst8xy6) {
            this.gpReg[x] = this.gpReg[y];
        }

        this.gpReg[0xf] = 0;
        if (this.gpReg[x] & (1 << 7) == 1) {
            this.gpReg[0xf] = 1;
        }
        this.gpReg[x] <<= 1;
        this.gpReg[x] &= 0xff;
    }

    i9xy0(x, y) {
        if (this.gpReg[x] != this.gpReg[y]) {
            this.programCounter += 2;
        }
    }

    iAnnn(nnn) {
        this.iRegister = nnn;
    }

    iBnnn(nnn) {
        this.programCounter = nnn + this.gpReg[0];
    }

    iCxkk(x, kk) {
        var rand = Math.floor(Math.random() * 255);
        rand &= 0xff;
        this.gpReg[x] = rand & kk;
    }

    iDxyn(x, y, n) {
        this.gpReg[0xf] = 0;
        var xPos = this.gpReg[x];
        var yPos = this.gpReg[y];
        for (var i = 0; i < n; i++) {
            var byte = this.RAM[this.iRegister + i];
            var xOffset = 0;
            for (var bitIndex = 7; bitIndex > -1; bitIndex--) {
                var spriteBit = (byte & (1 << bitIndex));
                spriteBit >>= bitIndex;
                var displayIndex = (xPos + xOffset++) + (yPos + i) * 64;

                if (this.display[displayIndex] == 1 && spriteBit == 1) {
                    this.gpReg[0xf] = 1;
                }

                this.display[displayIndex] ^= spriteBit;
            }
        }
    }

    iEx9E(x) {
        if (this.keys[this.gpReg[x]]) {
            this.programCounter += 2;
        }
    }

    iExA1(x) {
        if (!this.keys[this.gpReg[x]]) {
            this.programCounter += 2;
        }
    }

    iFx07(x) {
        this.gpReg[x] = this.delayRegister;
    }

    iFx0A(x) {
        while (!keyPress) {
            for (var i = 0; i < 16; i++) {
                if (this.keys[i]) {
                    this.gpReg[x] = i;
                    keyPress = true;
                }
            }
        }

    }

    iFx15(x) {
        this.delayRegister = this.gpReg[x];
    }

    iFx18(x) {
        this.soundRegister = this.gpReg[x];
    }

    iFx1E(x) {
        this.iRegister += this.gpReg[x];
        this.iRegister &= 0xff;
    }

    iFx29(x) {
        this.iRegister = this.gpReg[x];
    }

    iFx33(x) {
        this.RAM[this.iRegister + 2] = Math.floor(this.gpReg[x] % 10)
        this.RAM[this.iRegister + 1] = Math.floor((this.gpReg[x] / 10) % 10)
        this.RAM[this.iRegister] = Math.floor((this.gpReg[x] / 100) % 10)
    }

    iFx55(x) {
        for (var i = 0; i <= x; i++) {
            this.RAM[this.iRegister + i] = this.gpReg[i];
        }
    }

    iFx65(x) {
        for (var i = 0; i <= x; i++) {
            this.gpReg[i] = this.RAM[this.iRegister + i];
        }
    }

}


