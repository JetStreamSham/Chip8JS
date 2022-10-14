
var canvas = document.getElementById("displayCanvas");
var playButton = document.getElementById("PlayButton");
var ipsSlider = document.getElementById("ipsSlider");
var selectRom = document.getElementById("selectRom");
var romFileLoader = document.getElementById("romFileLoader");

var chip8 = new CHIP8(null);
var display = new Display(canvas, "2d",chip8.display);

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
    chip8.KeyPressed();
}
function KeyReleased(key) {
    keyPress = true;
    chip8.KeyReleased();
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



