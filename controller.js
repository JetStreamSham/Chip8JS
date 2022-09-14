var chip8 = new CHIP8(null);
var canvasDisplay = document.getElementById("displayCanvas");
var canvasCtx = canvasDisplay.getContext('2d');
canvasCtx.fillStyle = "black";


var registers;
var stack;
var memoryRows;

var bytesPerRow = 16;

function SetupMemoryTable() {
    var memoryTable;
    memoryTable = document.getElementById("Memory");
    var currentRow = memoryTable.insertRow();
    currentRow.insertCell();
    for (var i = 0; i < bytesPerRow; i++) {
        var th = document.createElement("th");
        currentRow.appendChild(th);
        th.textContent = i.toString(16);
        th.setAttribute("style", "top: 0;z-index: 2;position: sticky;");
    }

    for (var i = 0; i < chip8.RAM.length; i++) {
        if (i % bytesPerRow == 0) {
            currentRow = memoryTable.insertRow();
            currentRow.insertCell().textContent = i.toString(16);
        }

        var cell = currentRow.insertCell();
        var cellInput = document.createElement("input");
        cell.appendChild(cellInput);
        cellInput.setAttribute("type", "number");
        cellInput.setAttribute("step", "1");
        cellInput.setAttribute("max", "255");
        cellInput.setAttribute("min", "0");
        cellInput.setAttribute("onchange", "UpdateRam(" + i + ")");
    }

}

function Init() {
    var registerTable;
    var stackTable;
    registerTable = document.getElementById("Registers");
    stackTable = document.getElementById("Stack");

    registers = new Array(16);
    stack = new Array(16);

    for (var i = 0; i < registerTable.rows.length; i++) {
        registerTable.rows[i].cells[0].textContent = i.toString(16);
        var registerValTD = registerTable.rows[i].cells[1];
        var registerVal = document.createElement("input");

        registerValTD.appendChild(registerVal);
        registerVal.setAttribute("type", "number");
        registerVal.setAttribute("step", "1");
        registerVal.setAttribute("max", "255");
        registerVal.setAttribute("min", "0");
        registerVal.setAttribute("onchange", "UpdateRegister(" + i + ")");


        registerTable[i] = registerVal;
    }


    for (var i = 0; i < stackTable.rows.length; i++) {
        stackTable.rows[i].cells[0].textContent = i.toString(16);
        var stackValTD = stackTable.rows[i].cells[1];
        var stackVal = document.createElement("input");

        stackValTD.appendChild(stackVal);
        stackVal.setAttribute("type", "number");
        stackVal.setAttribute("step", "1");
        stackVal.setAttribute("max", "255");
        stackVal.setAttribute("min", "0");
        stackVal.setAttribute("onchange", "UpdateStack(" + i + ")");


        stackTable[i] = stackVal;
    }

    SetupMemoryTable();


    // UpdateDisplay();
}

Init();

function KeyPressed(key) {
    keyPress = true;
    chip8.keys[key] = 1;
}
function KeyReleased(key) {
    keyPress = true;
    chip8.keys[key] = 0;
}

var pause = true;
function Play() {
    pause = !pause;
}

function Step() {
    chip8.step();
    UpdateDisplay();
}

function LoadRom() {

}

function UpdateRegisterDisplay() {
    for (var i = 0; i < registers.length; i++) {
        registers[i].textContent = i + "   " + chip8.gpReg[i].toString(16);
    }
}
function UpdateStackDisplay() {
    for (var i = 0; i < registers.length; i++) {
        stack[i].textContent = chip8.gpReg[i].toString(16);
    }
}
function UpdateMemoryDisplay() {
    for (var i = 0; i < memoryDisplayRows.length; i++) {
        var textContent = (i).toString(16);
        for (var ii = 0; ii < bytesPerRow; ii++) {
            textContent += "   " + chip8.RAM[(i) + ii].toString(16);

        }
        memoryDisplayRows[i].textContent = textContent;
    }
}
function UpdateDisplay() {
    UpdateRegisterDisplay();
    UpdateStackDisplay();
    UpdateMemoryDisplay();
}