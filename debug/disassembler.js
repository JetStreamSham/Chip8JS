class Disassembler {
    constructor(chip8, container) {
        if (container == null) {
            container = document.createElement("div");
            container.className = "DisassemblerContainer";
            document.appendChild(container);
        }

        this.AsmDivSet = new Array(0xfff);
        for (let i = 0; i < this.assemblyDivs.length; i++) {
            let asmDivSet = {};
            let instContainer = document.createElement("div");
            instContainer.className = "AsmInstDiv";
            instContainer.textContent = "AsmInstDiv";  
            container.appendChild(asmDivSet.instruction);

            let byteContainer = document.createElement("div");
            byteContainer.className = "AsmByteDiv";
            byteContainer.textContent = "AsmByteDiv";   
            container.appendChild(asmDivSet.bytes);

            let addrContainer = document.createElement("div");
            addrContainer.className = "AsmAddrDiv";
            addrContainer.textContent = "AsmAddrDiv"; 

            container.appendChild(asmDivSet.address);
        }
    }
}