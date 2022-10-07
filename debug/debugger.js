class Debugger {
    constructor() {
        this.active = false;
        this.canvas = document.getElementById("DbgCanvas");
        this.SetupRegisterDisplay();
        this.SetupStackDisplay();
    }


    SetChip8(chip8) {
        this.chip8 = chip8;

        if (this.display == null) {
            this.display = new Display(this.canvas,"2d",chip8.display);
        }
        
        let disasmContainer = document.getElementById("DisassemblyContainer");
        this.disassembler = new Disassembler(chip8, disasmContainer)
    }


    SetupStackDisplay() {
        this.stack = new Array(16);
        let stackContainer = document.getElementById("StackContainer");
        for (var i = 0; i < this.stack.length; i++) {
            this.stack[i] = document.createElement("div");
            this.stack[i].className = "StackElement";
            this.stack[i].textContent = "0x" + i.toString(16) + ":" + "0xFFFF";

            stackContainer.appendChild(this.stack[i]);
        }
    }

    UpdateStackDisplay() {
        if (!this.active)
            return;
        for (var i = 0; i < this.stack.length; i++) {
            this.stack[i].textContent = "0x" + i.toString(16) + ":" + this.chip8.stack[i].toString(16);
        }

    }



    SetupRegisterDisplay() {
        let registerContainer = document.getElementById("RegisterContainer");
        this.registers = new Array(0x10)
        for (let i = 0; i < this.registers.length; i++) {
            this.registers[i] = document.createElement("div");
            this.registers[i].textContent = "V" + i.toString(16) + ":" + "0xFF";
            this.registers[i].className = "RegisterElement"
            registerContainer.appendChild(this.registers[i]);
        }

        let miscRegisterContainer = document.getElementById("RegisterMiscContainer");
        this.miscRegisters = new Array(5);

        for (let i = 0; i < this.miscRegisters.length; i++) {
            this.miscRegisters[i] = document.createElement("div");
            this.miscRegisters[i].className = "MiscRegisterElement"
            miscRegisterContainer.appendChild(this.miscRegisters[i]);
        }

        //program counter
        this.miscRegisters[0].textContent = "PC" + ":0xFF";
        //I register
        this.miscRegisters[1].textContent = "I" + ":0xFF";
        //Stack pointer
        this.miscRegisters[2].textContent = "SP" + ":0xFF";
        //Delay register
        this.miscRegisters[3].textContent = "Delay" + ":0xFF";
        //Sound register
        this.miscRegisters[4].textContent = "Sound" + ":0xFF";


    }


    UpdateRegisterDisplay() {

        if (!this.active)
            return;
        for (var i = 0; i < this.registers.length; i++) {
            var value = "";
            value = this.chip8.gpReg[i].toString(16);
            this.registers[i].textContent = "V" + i.toString(16) + ":0x" + value.toString(16);
        }

        //program counter
        this.miscRegisters[0].textContent = "PC" + ":0x" + crossPageData.chip8.programCounter.toString(16);
        //I register
        this.miscRegisters[1].textContent = "I" + ":0x" + crossPageData.chip8.iRegister.toString(16);
        //Stack pointer
        this.miscRegisters[2].textContent = "SP" + ":0x" + crossPageData.chip8.stackPointer.toString(16);
        //Delay register
        this.miscRegisters[3].textContent = "Delay" + ":0x" + crossPageData.chip8.delayRegister.toString(16);
        //Sound register
        this.miscRegisters[4].textContent = "Sound" + ":0x" + crossPageData.chip8.soundRegister.toString(16);

    }




    SetupMemoryDisplay() {

    }

    UpdateMemoryDisplay() {
        if (!this.active)
            return;
    }

    UpdateDebuggerDisplay() {
        if (!this.active)
            return;
        this.UpdateRegisterDisplay();
        this.UpdateStackDisplay();
        this.UpdateMemoryDisplay();
        this.disassembler.Focus();
    }

    OnActivate() {
        this.active = true;
        this.display.displayData = crossPageData.chip8.display;
        this.UpdateDebuggerDisplay();
    }

    OnDeactivate() {
        this.active = false;
    }

    OnRomChange() {
        this.disassembler.Reset();
    }

}

function Step() {

    toggleButton.textContent = "Play";
    crossPageData.paused = true;
    crossPageData.chip8.step();
    _debugger.display.draw();
    _debugger.UpdateDebuggerDisplay();
}


function Toggle() {
    crossPageData.paused = !crossPageData.paused;

    toggleButton.textContent = "Pause";
    crossPageData.mainLoop.pause();
    if (crossPageData.paused) {
        toggleButton.textContent = "Play";
        crossPageData.mainLoop.play();
    }

}

function KeyPressed(key) {
    crossPageData.chip8.keys[key] = 1;
}

function KeyReleased(key) {
    crossPageData.chip8.keys[key] = 0;
}


var toggleButton = document.getElementById("ToggleButton");
var stepButton = document.getElementById("StepButton");
var _debugger = new Debugger();
