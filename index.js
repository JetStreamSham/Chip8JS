var tabNames = ["Play", "Edit", "Debug", "Disasm"];
var tabs = [];
tabs["Play"] = 0;
tabs["Edit"] = 0;
tabs["Debug"] = 0;
tabs["Disasm"] = 0;


function onTabChange(event, tabName) {

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
    }
    var file = romFileLoader.files[0];
    fileReader.readAsArrayBuffer(file);

}


function setupPlayTab() {
    let playIFrame = document.getElementById("PlayTabIFrame");
    let contentDoc = playIFrame.contentDocument;
    let buttons = contentDoc.getElementsByTagName("button");

    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i]
        let keyNumber = button.getAttribute("data-keynumber");

        if (keyNumber != null) {
            button.onclick = () => { KeyPressed(keyNumber) };
            button.onmouseup = () => { KeyReleased(keyNumber) };
        }
    }

}

function setupDebugTab(){
    let dbgIFrame = document.getElementById("DebugTabIFrame");
    let contentDoc = dbgIFrame.contentDocument;
    let inputHolder = contentDoc.getElementsByClassName("Input")[0];

    let buttons = contentDoc.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i]
        let keyNumber = button.getAttribute("data-keynumber");

        if (keyNumber != null) {
            button.onclick = () => { KeyPressed(keyNumber) };
            button.onmouseup = () => { KeyReleased(keyNumber) };
        }
    }

    _debugger = contentDoc._debugger;
}

