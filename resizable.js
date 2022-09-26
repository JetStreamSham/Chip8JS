
class Resizable {
    constructor(parentElement, dragBarSize) {
        this.parentElement = parentElement;
        this.dragging = false;
        this.dragBarSize = 10;
        if (dragBarSize != null)
            this.dragBarSize = dragBarSize;
        this.createDragPairs();
        this.autoSizePairs();
    }


    createDragPairs() {
        this.resizableContainers = this.parentElement.getElementsByClassName("resizable");
        this.resizablePairs = [];
        for (let i = 0; i < this.resizableContainers.length; i++) {


            if (this.resizableContainers[i].children.length > 1) {
                this.resizableContainers[i].style.position = "relative";
                this.resizableContainers[i].style.height = "100%";
                this.resizableContainers[i].style.width = "100%";
                let layerSize = this.resizableContainers[i].children.length;
                for (let ii = 0; ii < this.resizableContainers[i].children.length; ii++) {
                    if (ii % 2 != 0) {
                        var pair = {}

                        pair.layerSize = layerSize;
                        pair.dragbarCount = layerSize - 1;
                        pair.id = this.resizablePairs.length;


                        var dragbarInstance = document.createElement("a");
                        var direction = this.resizableContainers[i].getAttribute("data-direction");
                        dragbarInstance.style.display = "inline-block";
                        dragbarInstance.style.cursor = "col-resize";
                        dragbarInstance.setAttribute("data-index", pair.id);

                        pair.dragbar = dragbarInstance;
                        pair.direction = direction;
                        pair.prev = this.resizableContainers[i].children[ii - 1];
                        pair.next = this.resizableContainers[i].children[ii];
                        pair.parent = this.resizableContainers[i];
                        this.resizablePairs.push(pair);

                        pair.next.style.position = "absolute";
                        pair.prev.style.position = "absolute";
                        pair.dragbar.style.position = "absolute";
                        this.resizableContainers[i].children[ii].insertAdjacentElement('beforebegin', dragbarInstance)

                        pair.dragbar.addEventListener("mousedown", this.dragstart.bind(this));
                    }

                }

                this.resizableContainers[i].addEventListener("mousemove", this.dragmove.bind(this));
                this.resizableContainers[i].addEventListener("mouseup", this.dragend.bind(this));
            } else {
                console.log("Only 1 child or less is present in the resizable container:", this.resizableContainers[i]);
            }


        }
    }

    autoSizePairs() {

        for (let i = 0; i < this.resizablePairs.length; i++) {
            let pair = this.resizablePairs[i];
            let parentWidth = pair.parent.offsetWidth;
            let parentHeight = pair.parent.offsetHeight;

            pair.dragbar.style.backgroundColor = "fuchsia";
            if (pair.direction == "horizontal") {
                let dragBarTotalWidth = pair.dragbarCount * this.dragBarSize;
                let resizableTotalWidth = parentWidth - dragBarTotalWidth;
                let elementWidth = resizableTotalWidth / pair.layerSize;

                let leftPosition = ((pair.id) * elementWidth);
                pair.prev.style.left = leftPosition;

                let rightPosition = parentWidth - ((pair.id + 1) * elementWidth)
                pair.prev.style.right = rightPosition + this.dragBarSize;
                pair.prev.style.height = parentHeight;



                if (pair.id == this.resizablePairs.length - 1) {
                    let leftPosition = ((pair.id + 1) * elementWidth);
                    pair.next.style.left = leftPosition;
                    pair.next.style.right = 0;
                    pair.next.style.height = parentHeight;
                }

                pair.dragbar.style.right = rightPosition;
                pair.dragbar.style.width = this.dragBarSize;
                pair.dragbar.style.height = parentHeight;

            } else {
                let dragBarTotalHeight = pair.dragbarCount * this.dragBarSize;
                let resizableTotalHeight = parentHeight - dragBarTotalHeight;
                let elementHeight = resizableTotalHeight / pair.layerSize;

                let topPosition = ((pair.id) * elementHeight);
                pair.prev.style.top = topPosition;

                let bottomPosition = parentHeight - ((pair.id + 1) * elementHeight)
                pair.prev.style.bottom = bottomPosition + this.dragBarSize;
                pair.prev.style.width = parentWidth;



                if (pair.id == this.resizablePairs.length - 1) {
                    let topPosition = ((pair.id + 1) * elementHeight);
                    pair.next.style.top = topPosition;
                    pair.next.style.bottom = 0;
                    pair.next.style.width = parentWidth;
                }

                pair.dragbar.style.bottom = bottomPosition;
                pair.dragbar.style.width = parentWidth;
                pair.dragbar.style.height = this.dragBarSize;
            }
        }
    }

    dragstart(e) {
        e.preventDefault();
        this.dragging = true;
        let pairIndex = e.target.getAttribute("data-index");
        this.selected = this.resizablePairs[pairIndex];
    }


    dragmove(e) {
        if (this.dragging) {
            if (this.selected.direction == "horizontal") {

                let rect = this.parentElement.getBoundingClientRect();
                let prevX = rect.right - e.clientX;
                let nextX = e.clientX - rect.left;
                this.selected.prev.style.right = prevX + this.dragBarSize;
                this.selected.next.style.left = nextX;
                this.selected.dragbar.style.right = prevX;
            }
            else {

                let rect = this.parentElement.getBoundingClientRect();
                let prevY = rect.bottom - e.clientY;
                let nextY = e.clientY - rect.top;
                this.selected.prev.style.bottom = prevY + this.dragBarSize;
                this.selected.next.style.top = nextY;
                this.selected.dragbar.style.bottom = prevY;
            }
        }
    }
    dragend(e) {
        this.dragging = false;
    }

}



