addEventListener("load", () => {
    var main = d3.select("main");
    var scrolly = main.select("#scrolly");
    var figure = scrolly.select("figure");
    var article = scrolly.select("article");
    var step = article.selectAll(".step");

    var scroller = scrollama();

    // generic window resize listener event
    function handleResize() {
        console.log("reisze")
        // 1. update height of step elements
        var stepH = Math.floor(window.innerHeight * 0.75);
        step.style("height", stepH + "px");

        var figureHeight = window.innerHeight / 2;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;

        figure
            .style("height", figureHeight + "px")
            .style("top", figureMarginTop + "px");

        // 3. tell scrollama to update new element dimensions
        scroller.resize();
    }

    // scrollama event handlers
    function handleStepEnter(response) {
        console.log(response);

        step.classed("is-active", function (d, i) {
            return i === response.index;
        });

        figure.select("p").text(response.index + "miau");
    }

    function init() {
        handleResize();
        scroller
            .setup({
                step: "#scrolly article .step",
                offset: 0.33,
                debug: false
            })
            .onStepEnter(handleStepEnter);
    }

    window.addEventListener("resize", handleResize);
    init();
})