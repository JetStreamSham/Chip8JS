

class DebuggerMemory{
    constructor(chip8){
        this.chip8 = chip8;
        this.memTable = document.getElementById("Memory");
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

    UpdateMemoryDisplay() {
        for (var i = 0; i < memory.length; i++) {
            memory[i].value = chip8.RAM[i].toString(16);
        }
    }
    
}