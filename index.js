var tabNames = ["Play", "Edit", "Debug", "Disasm"];
var tabs = [];
tabs["Play"] = 0;
tabs["Edit"] = 0;
tabs["Debug"] = 0;
tabs["Disasm"] = 0;

var crossPageData = {};
crossPageData.chip8 = new CHIP8(null);
crossPageData.activeTabName = "";
crossPageData.paused = true;
crossPageData.mainLoop = new MainLoop()

function tabTick() {

    switch (crossPageData.activeTabName) {
        case "Play":
            {

                crossPageData.play.Tick();
            }
            break;
        case "Debug":
            {
                crossPageData.debugger.Tick();
            }
            break;
        case "Edit":
            {

            }
            break;

    }
}

function onTabChange(event, tabName) {

    switch (crossPageData.activeTabName) {
        case "Play":
            {

            }
            break;
        case "Debug":
            {
                crossPageData.debugger.OnDeactivate();
            }
            break;
        case "Edit":
            {

            }
            break;

    }

    crossPageData.activeTabName = tabName;

    switch (tabName) {
        case "Play":
            {

            }
            break;
        case "Debug":
            {
                if (crossPageData.debugger.chip8 == null) {
                    crossPageData.debugger.SetChip8(crossPageData.chip8);
                }
                crossPageData.debugger.OnActivate();
            }
            break;
        case "Edit":
            {

            }
            break;
    }
}


function KeyPressed(key) {
    crossPageData.chip8.keys[key] = 1;
}
function KeyReleased(key) {
    crossPageData.chip8.keys[key] = 0;
}


function UpdateIPS() {
    crossPageData.mainLoop.instructionsPerSecond = ipsSlider.value;
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
    crossPageData.paused = true;
    crossPageData.mainLoop.stop();

    fileReader.onload = () => {
        var byteArray = new Uint8Array(fileReader.result);
        crossPageData.chip8.loadRom(byteArray);

        switch (crossPageData.activeTabName) {
            case "Play":
                {

                }
                break;
            case "Debug":
                {
                    crossPageData.debugger.OnRomChange();
                }
                break;
            case "Edit":
                {

                }
                break;

        }
    }
    var file = romFileLoader.files[0];
    fileReader.readAsArrayBuffer(file);

}


function setupPlayTab() {
    let playIFrame = document.getElementById("PlayTabIFrame");
    let contentDoc = playIFrame.contentDocument;
    let contentWindow = playIFrame.contentWindow;
    let buttons = contentDoc.getElementsByTagName("button");

    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i]
        let keyNumber = button.getAttribute("data-keynumber");

        if (keyNumber != null) {
            button.onclick = () => { KeyPressed(keyNumber) };
            button.onmouseup = () => { KeyReleased(keyNumber) };
        }
    }
    contentWindow.crossPageData = crossPageData;

}

function setupDebugTab() {
    let dbgIFrame = document.getElementById("DebugTabIFrame");
    let contentDoc = dbgIFrame.contentDocument;
    let contentWindow = dbgIFrame.contentWindow;
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

    crossPageData.debugger = contentWindow._debugger;
    crossPageData.debugger.SetChip8(crossPageData.chip8);
    contentWindow.crossPageData = crossPageData;
}

