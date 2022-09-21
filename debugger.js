var registers;
var stack;
var memory;
var bytesPerRow = 16;


var canvas = document.getElementById("displayCanvas");
var playButton = document.getElementById("PlayButton");
var ipsSlider = document.getElementById("ipsSlider");
var selectRom = document.getElementById("selectRom");
var romFileLoader = document.getElementById("romFileLoader");

var chip8 = new CHIP8(null);
var display = new Display(canvas, "2d", chip8.display);

mainLoop = new MainLoop(() => {
    chip8.step();
    display.draw();
});

var paused = true;
function Toggle() {
    paused = !paused;

    playButton.textContent = "Pause";
    if (paused) {
        playButton.textContent = "Play";
    }

    mainLoop.toggle();
}
function KeyPressed(key) {
    keyPress = true;
    chip8.keys[key] = 1;
}
function KeyReleased(key) {
    keyPress = true;
    chip8.keys[key] = 0;
}


function UpdateIPS() {
    mainLoop.instructionsPerSecond = ipsSlider.value;
}
function SelectRom() {
    var index = selectRom.selectedIndex;
    switch (index) {
        case 0:
            break;
        case 1:
            romFileLoader.click();
            break;
        default:
            ROM.roms[index];
            break;
    }
}

var fileReader = new FileReader();
function LoadRom() {
    paused = true;
    mainLoop.stop();
    playButton.textContent = "Play";

    fileReader.onload = () => {
        var byteArray = new Uint8Array(fileReader.result);
        chip8.loadRom(byteArray);
        UpdateDisplay();
    }
    var file = romFileLoader.files[0];
    fileReader.readAsArrayBuffer(file);

}





function SetupMemoryTable() {
    var memoryTable;
    memoryTable = document.getElementById("Memory");
    var currentRow = memoryTable.insertRow();
    currentRow.insertCell();
    for (var i = 0; i < bytesPerRow; i++) {
        var th = document.createElement("th");
        currentRow.appendChild(th);
        th.textContent = i.toString(16);
        th.setAttribute("style", " background-color:black; top: 0;z-index: 2;position: sticky;");
    }

    memory = new Array(0xfff);
    for (var i = 0; i < chip8.RAM.length; i++) {
        if (i % bytesPerRow == 0) {
            currentRow = memoryTable.insertRow();
            currentRow.insertCell().textContent = i.toString(16);
        }

        var cell = currentRow.insertCell();
        var cellInput = document.createElement("input");
        cell.appendChild(cellInput);
        cellInput.setAttribute("type", "text");
        cellInput.setAttribute("onchange", "UpdateRam(" + i + ")");
        cellInput.value = chip8.RAM[i].toString(16);
        memory[i] = cellInput;
    }

}

function UpdateRegisterDisplay() {
    for (var i = 0; i < registers.length; i++) {
        var value = "";
        switch (i) {
            default:
                value = chip8.gpReg[i].toString(16);
                break;
            case 0x10:
                value = chip8.programCounter.toString(16);
                break;
            case 0x11:
                value = chip8.iRegister.toString(16);;
                break;
            case 0x12:
                value = chip8.delayRegister.toString(16);;
                break;
            case 0x13:
                value = chip8.soundRegister.toString(16);;
                break;
        }
        registers[i].value =value;
    }
}
function UpdateStackDisplay() {
    for (var i = 0; i < stack.length; i++) {
        stack[i].value = chip8.stack[i].toString(16);
    }
}
function UpdateMemoryDisplay() {
    for (var i = 0; i < memory.length; i++) {
        memory[i].value = chip8.RAM[i].toString(16);
    }
}
function UpdateDisplay() {
    UpdateRegisterDisplay();
    UpdateStackDisplay();
    // UpdateMemoryDisplay();
}


function UpdateRegister(index) {

}
function UpdateStack(index) {

}
function UpdateRam(index) {

}

function Init() {
    var registerTable;
    var stackTable;
    registerTable = document.getElementById("Registers");
    stackTable = document.getElementById("Stack");

    registers = new Array(16);
    stack = new Array(16);

    for (var i = 0; i < registerTable.rows.length; i++) {
        var label = "";
        switch (i) {
            default:
                label = i.toString(16);
                break;
            case 0x10:
                label = "PC";
                break;
            case 0x11:
                label = "I";
                break;
            case 0x12:
                label = "DR";
                break;
            case 0x13:
                label = "SR";
                break;
        }
        registerTable.rows[i].cells[0].textContent = label;
        var registerValTD = registerTable.rows[i].cells[1];
        var registerVal = document.createElement("input");

        registerValTD.appendChild(registerVal);
        registerVal.setAttribute("type", "text");
        registerVal.setAttribute("onchange", "UpdateRegister(" + i + ")");


        registers[i] = registerVal;
    }



    for (var i = 0; i < stackTable.rows.length; i++) {
        stackTable.rows[i].cells[0].textContent = i.toString(16);
        var stackValTD = stackTable.rows[i].cells[1];
        var stackVal = document.createElement("input");

        stackValTD.appendChild(stackVal);
        stackVal.setAttribute("type", "text");
        stackVal.setAttribute("onchange", "UpdateStack(" + i + ")");


        stack[i] = stackVal;
    }

    // SetupMemoryTable();
    UpdateDisplay();
}


function Step() {
    chip8.step();
    display.draw();
    UpdateDisplay();
}


Init();