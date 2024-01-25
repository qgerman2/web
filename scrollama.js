addEventListener("load", () => {
    var body = d3.select("body");
    var scrolly1 = body.selectAll("#scrolly-overlay");
    var figure1 = scrolly1.select("figure");
    var article1 = scrolly1.select("article");
    var step1 = article1.selectAll(".step");

    var scrolly2 = body.selectAll("#scrolly-side");
    var figure2 = scrolly2.select("figure");
    var article2 = scrolly2.select("article");
    var step2 = article2.selectAll(".step");

    var scroller1 = scrollama();
    var scroller2 = scrollama();

    var bg = body.select("#bg");
    var bg_y = 25;
    var bg_y_dest = 25;

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
    }

    function handleStepEnter1(response) {
        step1.classed("is-active", function (d, i) {
            return i === response.index;
        });
        figure1.select("p").text(response.index + 1);
    }

    function handleStepEnter2(response) {
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
                offset: 0.5,
                debug: false,
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
    addEventListener("scroll", () => {
        bg_y_dest = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * -50 + 25;
    })
    addEventListener("resize", handleResize);
    function update() {
        bg_y = bg_y + (bg_y_dest - bg_y) / 10
        bg.style("top", bg_y + "vh")
        window.requestAnimationFrame(update)
    }
    window.requestAnimationFrame(update);
})

