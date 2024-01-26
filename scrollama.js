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

    var anim_step = 0;

    function handleResize() {
        var stepH = Math.floor(window.innerHeight * 0.75);
        step2.style("height", stepH + "px");

        var figureHeight = window.innerHeight / 2;
        var figureMarginTop = (window.innerHeight - figureHeight) / 2;

        figure2
            .style("height", figureHeight + "px")
            .style("top", figureMarginTop + "px");

        scroller1.resize();
        scroller2.resize();
    }

    function handleStepEnter1(response) {
        response = response.detail
        anim_step = response.index + 1;
        step_changed();
    }
    addEventListener("step-enter", handleStepEnter1);
    function handleStepExit1(response) {
        response = response.detail
        if (response.index > anim_step) { return }
        if (response.direction == "up") {
            anim_step = response.index;
        }
        step_changed();
    }
    addEventListener("step-exit", handleStepExit1);
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
                offset: 0.9,
            })
            .onStepEnter((r) => {
                dispatchEvent(
                    new CustomEvent("step-enter", {
                        detail: r
                    })
                )
            })
            .onStepExit((r) => {
                dispatchEvent(
                    new CustomEvent("step-exit", {
                        detail: r
                    })
                )
            });
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
    function step_changed() {
        if (anim_step > 0) {
            bg.transition().duration(500).style('opacity', 0)
            figure1.transition().duration(2000).style('opacity', 1)
        } else {
            bg.transition().duration(500).style('opacity', 1)
            figure1.transition().duration(500).style('opacity', 0)
        }
        figure1.select("p").text(anim_step)
    }
    function update() {
        bg_y = bg_y + (bg_y_dest - bg_y) / 10
        bg.style("top", bg_y + "vh")
        window.requestAnimationFrame(update)
    }
    window.requestAnimationFrame(update);
})

