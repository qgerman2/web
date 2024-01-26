addEventListener("load", () => {
    Promise.all([
        d3.json("ramsar_centroid.json"),
        d3.json("countries-110m.json")])
        .then(init)
})

function init(values) {

    let anim_step = 0;
    let anim_state = 0;

    let figure = d3.select("body").selectAll("#scrolly-overlay").select("figure");
    let worldmap = d3.select("body").selectAll("#scrolly-overlay").select("#worldmap");
    let context = worldmap.node().getContext("2d");
    var projection;
    var path;
    let rotation = 0;


    let wetlands = values[0];
    let centroids = topojson.feature(wetlands, wetlands.objects.ramsar_centroid);
    let world = values[1];
    let land = topojson.feature(world, world.objects.land);
    let borders = topojson.mesh(world, world.objects.countries, (a, b) => { a !== b });

    addEventListener("resize", handleResize);

    function handleResize() {
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;
        projection = d3.geoOrthographic().fitExtent([[10, 10], [context.canvas.width - 10, context.canvas.height - 10]], { type: "Sphere" });
        path = d3.geoPath(projection, context);
    }

    function renderWorldMap() {
        anim_state = anim_state + (anim_step - anim_state) / 50
        let width = context.canvas.width;
        let height = context.canvas.height;
        rotation = rotation + 0.1;
        projection.rotate([rotation, 0, 0]);
        projection.scale(400)
        context.clearRect(0, 0, width, height);
        context.beginPath(), path(land), context.fillStyle = "#ccc", context.fill();
        context.beginPath(), path(borders), context.strokeStyle = "#fff", context.lineWidth = 0.5, context.stroke();
        context.beginPath(), path({ type: "Sphere" }), context.strokeStyle = "#000", context.lineWidth = 1.5, context.stroke();
        context.beginPath(), path(centroids), context.fillStyle = "#FFC0CBAA", context.lineWidth = 0.1, context.fill();
        requestAnimationFrame(renderWorldMap);
    }
    function stepChanged() {

    }
    function stepEnter(response) {
        response = response.detail
        anim_step = response.index + 1;
        stepChanged();
    }
    addEventListener("step-enter", stepEnter);
    function stepExit(response) {
        response = response.detail
        if (response.index > anim_step) { return }
        if (response.direction == "up") {
            anim_step = response.index;
        }
        stepChanged();
    }
    addEventListener("step-exit", stepExit);

    handleResize();
    requestAnimationFrame(renderWorldMap);
}