addEventListener("load", init_slideshow)
const conce_landsat = document.getElementById("conce_landsat");

function init_slideshow() {
    let body = d3.select("body");
    let container = body.selectAll("#scrolly-side").select("#slideshow-container");
    let context = container.select("#slideshow").node().getContext("2d");
    let draw = false;

    

    function handleResize() {
        context.canvas.width = container.node().clientWidth;
        context.canvas.height = container.node().clientHeight;
        requestAnimationFrame(renderSlideshow)
    }
    addEventListener("resize", handleResize);

    function renderSlideshow() {
        let width = context.canvas.width;
        let height = context.canvas.height;
        context.beginPath();
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);
        
        let scale1 = width / conce_landsat.width;
        console.log(scale1)
        context.drawImage(conce_landsat, 0, (height - conce_landsat.height * scale1) / 2, conce_landsat.width * scale1, conce_landsat.height * scale1)
        if (draw) {
            requestAnimationFrame(renderSlideshow);
        }
    }
    function stepEnter(response) {
        let id = response.detail[1];
        if (id == 1) { return }
        response = response.detail[0]
        anim_step = response.index + 1;
    }
    addEventListener("step-enter", stepEnter);

    function stepExit(response) {
        let id = response.detail[1];
        if (id == 1) { return }
        response = response.detail[0]
        if (response.index > anim_step) { return }
        if (response.direction == "up") {
            anim_step = response.index;
        }
    }
    addEventListener("step-exit", stepExit);

    addEventListener("draw-on", () => { draw = true; requestAnimationFrame(renderSlideshow) })
    addEventListener("draw-off", () => { draw = false; })

    handleResize();
    requestAnimationFrame(renderSlideshow);
}