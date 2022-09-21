var fileInput = document.getElementById("loadRom");
var tableBody = document.getElementById("asmTable");
var fileReader = new FileReader();
function LoadRom() {

    fileReader.onload = () => {
        var byteArray = new Uint8Array(fileReader.result);

        for (var i = 0; i < byteArray.length; i += 2) {

            var row = document.createElement("tr");
            tableBody.appendChild(row);
            
            var memoryAddress = i.toString(16);
            var td1 = document.createElement("td");
            td1.innerText = memoryAddress;
            
            var bytes = (byteArray[i] << 8) | byteArray[i + 1];
            var td2 = document.createElement("td");
            td2.innerText = bytes.toString(16);


            var elements = Decode(bytes);
            var td3 = document.createElement("td");

            var opcodeDiv = document.createElement("div");
            td3.appendChild(opcodeDiv);

            opcodeDiv.className="OpcodeEntry"
            opcodeDiv.appendChild(elements.opcode);
            opcodeDiv.appendChild(elements.variables);

            


            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);

            
        }
    }
    var file = fileInput.files[0];
    fileReader.readAsArrayBuffer(file);
}


function Decode(opcode) {
    var element = document.createElement("div");
    element.className = "Opcode";
    var variables = document.createElement("div");
    variables.className = "Variables";
    switch ((opcode >> 0xc)) {
        default:
            {
                element.innerText = "???";
                variables.innerText = "???";
            }
            break;
        case 0x0:
            {
                switch (opcode & 0x00ff) {
                    case 0xE0:
                        {
                            element.innerText = "CLS";
                        }
                        break;
                    case 0xEE:
                        {
                            element.innerText = "RET";
                        }
                }
            }
            break;
        case 0x1:
            {
                element.innerText = "JP";
                variables.innerText = (opcode & 0xfff).toString(16);
            }
            break;
        case 0x2:
            {
                element.innerText = "CALL";
                variables.innerText = (opcode & 0xfff).toString(16);
            }
            break;
        case 0x3:
            {
                var x = (opcode & 0x0f00) >> 8;
                var kk = (opcode & 0x00ff);
                element.innerText = "SE";
                variables.innerText = "v" + x.toString(16) + "," + kk.toString(16);
            }
            break;
        case 0x4:
            {
                var x = (opcode & 0x0f00) >> 8;
                var kk = (opcode & 0x00ff);
                element.innerText = "SNE";
                variables.innerText = "v" + x.toString(16) + "," + kk.toString(16);
            }
            break;
        case 0x5:
            {
                var x = (opcode & 0x0f00) >> 8;
                var y = (opcode & 0x00f0) >> 4;
                element.innerText = "SE";
                variables.innerText = "v" + x.toString(16) + ",v" + y.toString(16);
            }
            break;
        case 0x6:
            {
                var x = (opcode & 0x0f00) >> 8;
                var kk = (opcode & 0x00ff);
                element.innerText = "LD";
                variables.innerText = "v" + x.toString(16) + "," + kk.toString(16);
            }
            break;
        case 0x7:
            {
                var x = (opcode & 0x0f00) >> 8;
                var kk = (opcode & 0x00ff);
                element.innerText = "ADD";
                variables.innerText = "v" + x.toString(16) + "," + kk.toString(16);
            }
            break;
        case 0x8:
            {
                var x = (opcode & 0x0f00) >> 8;
                var y = (opcode & 0x00f0) >> 4;
                variables.innerText = "v" + x.toString(16) + ",v" + y.toString(16);

                switch (opcode & 0x000f) {
                    case 0:
                        {
                            element.innerText = "LD";
                        }
                        break;
                    case 1:
                        {
                            element.innerText = "OR";
                        }
                        break;
                    case 2:
                        {
                            element.innerText = "AND";
                        }
                        break;
                    case 3:
                        {
                            element.innerText = "XOR";
                        }
                        break;
                    case 4:
                        {
                            element.innerText = "ADD";
                        }
                        break;
                    case 5:
                        {
                            element.innerText = "SUB";
                        }
                        break;
                    case 6:
                        {
                            element.innerText = "SHR";
                        }
                        break;
                    case 7:
                        {
                            element.innerText = "SUBN";
                        }
                        break;
                    case 0xe:
                        {
                            element.innerText = "SHL";
                        }
                        break;
                }
            }
            break;
        case 0x9:
            {
                var x = (opcode & 0x0f00) >> 8;
                var y = (opcode & 0x00f0) >> 4;
                element.innerText = "SNE";
                variables.innerText = "v" + x.toString(16) + "," + y.toString(16);
            }
            break;
        case 0xA:
            {
                var nnn = (opcode & 0x0fff);
                element.innerText = "LD";
                variables.innerText = "I," + nnn.toString(16);
            }
            break;
        case 0xB:
            {
                var nnn = (opcode & 0x0fff);
                element.innerText = "JP";
                variables.innerText = "JP v0," + nnn.toString(16);
            }
            break;
        case 0xC:
            {
                var x = (opcode & 0x0f00) >> 8;
                var kk = (opcode & 0x00ff);
                element.innerText = "RND";
                variables.innerText = "v" + x.toString(16) + "," + kk.toString(16);
            }
            break;
        case 0xD:
            {
                var x = (opcode & 0x0f00) >> 8;
                var y = (opcode & 0x00f0) >> 4;
                var n = (opcode & 0x000f);
                element.innerText = "DRW";
                variables.innerText = "v" + x.toString(16) + ",v" + y.toString(16)+"," + n.toString(16);
            }
            break;
        case 0xE:
            {
                var x = opcode & 0x0f00;
                switch (opcode & 0x00ff) {
                    default:
                        {
                            element.innerText = "???";
                            variables.innerText = "???";
                        }
                        break;
                    case 0x9E:
                        {
                            element.innerText = "SKP";
                            variables.innerText = "v" + x.toString(16);
                        }
                        break;
                    case 0xA1:
                        {
                            element.innerText = "SKNP";
                            variables.innerText = "v" + x.toString(16);
                        }
                        break;
                }
            }
            break;
        case 0xF:
            {
                element.innerText = "LD";
                var x = opcode & 0x0f00;
                x>>=8;
                switch (opcode & 0x00ff) {
                    default:
                        {
                            element.innerText = "???";
                            variables.innerText = "???";
                        }
                        break;
                    case 0x07:
                        {
                            variables.innerText = "v" + x.toString(16) + ", DT";
                        }
                        break;
                    case 0x0A:
                        {
                            variables.innerText = "v" + x.toString(16) + ", K";
                        }
                        break;
                    case 0x15:
                        {
                            variables.innerText = "DT, v" + x.toString(16);
                        }
                        break;
                    case 0x18:
                        {
                            variables.innerText = "ST, v" + x.toString(16);
                        }
                        break;
                    case 0x1e:
                        {
                            element.innerText = "ADD";
                            variables.innerText = "I, v" + x.toString(16);
                        }
                        break;
                    case 0x29:
                        {
                            variables.innerText = "F, v" + x.toString(16);
                        }
                        break;
                    case 0x33:
                        {
                            variables.innerText = "B, v" + x.toString(16);
                        }
                        break;
                    case 0x55:
                        {
                            variables.innerText = "[I], v" + x.toString(16);
                        }
                        break;
                    case 0x65:
                        {
                            variables.innerText = "[I], v" + x.toString(16);
                        }
                        break;
                }
            }
            break;
    }


    return {
        'opcode': element,
        'variables': variables
    };
}
