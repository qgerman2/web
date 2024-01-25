addEventListener("load", () => {
    var main = d3.select("main");
    var scrolly1 = main.selectAll("#scrolly-overlay");
    var figure1 = scrolly1.select("figure");
    var article1 = scrolly1.select("article");
    var step1 = article1.selectAll(".step");

    var scrolly2 = main.selectAll("#scrolly-side");
    var figure2 = scrolly2.select("figure");
    var article2 = scrolly2.select("article");
    var step2 = article2.selectAll(".step");

    var scroller1 = scrollama();
    var scroller2 = scrollama();

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");



    function handleResize() {
        var stepH = Math.floor(window.innerHeight * 0.75);
        step1.style("height", stepH + "px");
        step2.style("height", stepH + "px");

        var figureHeight = window.innerHeight / 2;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;

        figure1
            .style("height", figureHeight + "px")
            .style("top", figureMarginTop + "px");
        figure2
            .style("height", figureHeight + "px")
            .style("top", figureMarginTop + "px");

        scroller1.resize();
        scroller2.resize();

        ctx.moveTo(0, 0);
        ctx.canvas.width = document.body.clientWidth;
        ctx.canvas.height = window.innerHeight;

    }

    function handleStepEnter1(response) {
        console.log(response);
        step1.classed("is-active", function (d, i) {
            return i === response.index;
        });
        figure1.select("p").text(response.index + 1);
    }

    function handleStepEnter2(response) {
        console.log(response);
        step2.classed("is-active", function (d, i) {
            return i === response.index;
        });
        figure2.select("p").text(response.index + 1);
    }


    function init() {
        handleResize();
        scroller1
            .setup({
                step: "#scrolly-overlay article .step",
                offset: 0.33,
                debug: false
            })
            .onStepEnter(handleStepEnter1);
        scroller2
            .setup({
                step: "#scrolly-side article .step",
                offset: 0.33,
                debug: false
            })
            .onStepEnter(handleStepEnter2);
    }
    init();
    addEventListener("resize", handleResize);
})

