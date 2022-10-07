class Disassembler {
    constructor(chip8, container) {
        if (container == null) {
            container = document.createElement("div");
            container.className = "DisassemblerContainer";
            document.body.appendChild(container);
        }

        this.chip8 = chip8;

        this.container = container;

        this.table = document.createElement("table");
        container.appendChild(this.table);

        let header = this.table.createTHead();
        let headerRow = header.insertRow();
        let addrHeader = headerRow.insertCell();
        addrHeader.textContent = "Address";

        let byteHeader = headerRow.insertCell();
        byteHeader.textContent = "Bytes";

        let instHeader = headerRow.insertCell();
        instHeader.textContent = "OpCode";


        this.table.className = "AsmTable";
        header.className = "AsmTablerHeader";


        this.asmSet = new Array(0xfff);
        for (let i = 0; i < 0xfff; i += 2) {

            let set = {};
            let currentRow = this.table.insertRow();
            currentRow.id = "AsmTableRow" + i / 2;

            set.row = currentRow;

            let addrContainer = currentRow.insertCell();
            addrContainer.className = "AsmAddrCell";
            addrContainer.textContent = "AsmAddrCell";

            set.address = addrContainer;

            let instContainer = currentRow.insertCell();
            instContainer.className = "AsmInstCell";
            instContainer.textContent = "AsmInstCell";

            set.instruction = instContainer;

            let byteContainer = currentRow.insertCell();
            byteContainer.className = "AsmByteCell";
            byteContainer.textContent = "AsmByteCell";

            set.bytes = byteContainer;



            this.asmSet[i] = set;
        }

        //this.Reset();
        this.FocusOn(0x200);

    }



    Reset() {
        for (let i = 0; i < this.asmSet.length; i += 2) {
            let address = "0x" + i.toString(16);
            let bytes = this.chip8.RAM[i] << 8;
            bytes |= this.chip8.RAM[i + 1];

            let opcode = this.Decode(bytes);

            this.asmSet[i].address.textContent = address.toString(16);
            this.asmSet[i].bytes.textContent = bytes.toString(16);
            this.asmSet[i].instruction.textContent = opcode.instruction+","+opcode.variables;


        }
        this.Focus();
    }

    FocusOn(address) {
        if (address > 0xfff)
            return;
        if (this.activeSet != null)
            this.activeSet.row.className = "";

        let set = this.asmSet[address];
        set.row.scrollIntoView();
        set.row.className = "AsmActiveRow"
        this.activeSet = set;
    }
    Focus() {
        let address = this.chip8.programCounter;
        this.FocusOn(address);
    }


    Decode(opcode) {

        let variables = "";
        let instruction = "";
        switch ((opcode >> 0xc)) {
            default:
                {
                    instruction = "???";
                    variables = "???";
                }
                break;
            case 0x0:
                {
                    switch (opcode & 0x00ff) {
                        case 0xE0:
                            {
                                instruction = "CLS";
                            }
                            break;
                        case 0xEE:
                            {
                                instruction = "RET";
                            }
                    }
                }
                break;
            case 0x1:
                {
                    instruction = "JP";
                    variables = (opcode & 0xfff).toString(16);
                }
                break;
            case 0x2:
                {
                    instruction = "CALL";
                    variables = (opcode & 0xfff).toString(16);
                }
                break;
            case 0x3:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    instruction = "SE";
                    variables = "v" + x.toString(16) + "," + kk.toString(16);
                }
                break;
            case 0x4:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    instruction = "SNE";
                    variables = "v" + x.toString(16) + "," + kk.toString(16);
                }
                break;
            case 0x5:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    instruction = "SE";
                    variables = "v" + x.toString(16) + ",v" + y.toString(16);
                }
                break;
            case 0x6:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    instruction = "LD";
                    variables = "v" + x.toString(16) + "," + kk.toString(16);
                }
                break;
            case 0x7:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    instruction = "ADD";
                    variables = "v" + x.toString(16) + "," + kk.toString(16);
                }
                break;
            case 0x8:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    variables = "v" + x.toString(16) + ",v" + y.toString(16);

                    switch (opcode & 0x000f) {
                        case 0:
                            {
                                instruction = "LD";
                            }
                            break;
                        case 1:
                            {
                                instruction = "OR";
                            }
                            break;
                        case 2:
                            {
                                instruction = "AND";
                            }
                            break;
                        case 3:
                            {
                                instruction = "XOR";
                            }
                            break;
                        case 4:
                            {
                                instruction = "ADD";
                            }
                            break;
                        case 5:
                            {
                                instruction = "SUB";
                            }
                            break;
                        case 6:
                            {
                                instruction = "SHR";
                            }
                            break;
                        case 7:
                            {
                                instruction = "SUBN";
                            }
                            break;
                        case 0xe:
                            {
                                instruction = "SHL";
                            }
                            break;
                    }
                }
                break;
            case 0x9:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    instruction = "SNE";
                    variables = "v" + x.toString(16) + "," + y.toString(16);
                }
                break;
            case 0xA:
                {
                    var nnn = (opcode & 0x0fff);
                    instruction = "LD";
                    variables = "I," + nnn.toString(16);
                }
                break;
            case 0xB:
                {
                    var nnn = (opcode & 0x0fff);
                    instruction = "JP";
                    variables = "JP v0," + nnn.toString(16);
                }
                break;
            case 0xC:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var kk = (opcode & 0x00ff);
                    instruction = "RND";
                    variables = "v" + x.toString(16) + "," + kk.toString(16);
                }
                break;
            case 0xD:
                {
                    var x = (opcode & 0x0f00) >> 8;
                    var y = (opcode & 0x00f0) >> 4;
                    var n = (opcode & 0x000f);
                    instruction = "DRW";
                    variables = "v" + x.toString(16) + ",v" + y.toString(16) + "," + n.toString(16);
                }
                break;
            case 0xE:
                {
                    var x = opcode & 0x0f00;
                    switch (opcode & 0x00ff) {
                        default:
                            {
                                instruction = "???";
                                variables = "???";
                            }
                            break;
                        case 0x9E:
                            {
                                instruction = "SKP";
                                variables = "v" + x.toString(16);
                            }
                            break;
                        case 0xA1:
                            {
                                instruction = "SKNP";
                                variables = "v" + x.toString(16);
                            }
                            break;
                    }
                }
                break;
            case 0xF:
                {
                    instruction = "LD";
                    var x = opcode & 0x0f00;
                    x >>= 8;
                    switch (opcode & 0x00ff) {
                        default:
                            {
                                instruction = "???";
                                variables = "???";
                            }
                            break;
                        case 0x07:
                            {
                                variables = "v" + x.toString(16) + ", DT";
                            }
                            break;
                        case 0x0A:
                            {
                                variables = "v" + x.toString(16) + ", K";
                            }
                            break;
                        case 0x15:
                            {
                                variables = "DT, v" + x.toString(16);
                            }
                            break;
                        case 0x18:
                            {
                                variables = "ST, v" + x.toString(16);
                            }
                            break;
                        case 0x1e:
                            {
                                instruction = "ADD";
                                variables = "I, v" + x.toString(16);
                            }
                            break;
                        case 0x29:
                            {
                                variables = "F, v" + x.toString(16);
                            }
                            break;
                        case 0x33:
                            {
                                variables = "B, v" + x.toString(16);
                            }
                            break;
                        case 0x55:
                            {
                                variables = "[I], v" + x.toString(16);
                            }
                            break;
                        case 0x65:
                            {
                                variables = "[I], v" + x.toString(16);
                            }
                            break;
                    }
                }
                break;
        }

        let decodedInst = {};
        decodedInst.instruction = instruction;
        decodedInst.variables = variables;
        return decodedInst;
    }
}