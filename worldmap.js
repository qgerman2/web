addEventListener("load", () => {
    Promise.all([
        d3.json("ramsar_centroid.json"),
        d3.json("countries-110m.json"),
        d3.json("regiones.json"),
        d3.json("conce.json")
    ]).then(init)
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
    let rotation2 = 0;
    let base_scale;
    let scale = 100;
    let regiones = topojson.feature(values[2], values[2].objects.regiones3);
    let conce = topojson.feature(values[3], values[3].objects.conce);


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
        base_scale = projection.scale() * 0.85;
    }
    function renderWorldMap() {
        anim_state = anim_state + (anim_step - anim_state) / 50
        let width = context.canvas.width;
        let height = context.canvas.height;
        if (anim_step < 2) {
            rotation = rotation - 0.1;
            rotation = rotation % 360;
            rotation2 = rotation2 + (0 - rotation2) / 100;
            scale = scale + (base_scale - scale) / 50;
        } else if (anim_step == 2) {
            rotation = rotation + (70 - rotation) / 100;
            rotation2 = rotation2 + (35 - rotation2) / 100;
            scale = scale + (base_scale * 3 - scale) / 50;
        } else if (anim_step == 3) {
            rotation = rotation + (73 - rotation) / 10;
            rotation2 = rotation2 + (36.7 - rotation2) / 10;
            scale = scale + (base_scale * 250 - scale) / 1000;
        }
        projection.scale(scale);
        projection.rotate([rotation, rotation2, 0]);
        context.clearRect(0, 0, width, height);
        context.beginPath(), path(land), context.fillStyle = "#ccc", context.fill();
        context.beginPath(), path(borders), context.strokeStyle = "#fff", context.lineWidth = 0.5, context.stroke();
        context.beginPath(), path({ type: "Sphere" }), context.strokeStyle = "#000", context.lineWidth = 1.5, context.stroke();
        context.beginPath(), path(centroids), context.fillStyle = "#FFC0CBFF", context.lineWidth = 0.1, context.fill();
        if (anim_step == 2) {
            context.beginPath();
            path(regiones);
            context.strokeStyle = "#0005";
            context.lineWidth = 0.5;
            context.stroke();
        } else if (anim_step == 3) {
            context.beginPath();
            path(conce);
            context.strokeStyle = "#000F";
            context.fillstyle = "#FFC0CBFF"
            context.lineWidth = 1;
            context.stroke();
            context.fill();
        }
        requestAnimationFrame(renderWorldMap);
    }
    function stepEnter(response) {
        if (response.detail[1] == 2) { return }
        response = response.detail[0]
        anim_step = response.index + 1;
        if (response.direction == "down" && anim_step == 1) {
            scale = 100;
        }
    }
    addEventListener("step-enter", stepEnter);
    function stepExit(response) {
        if (response.detail[1] == 2) { return }
        response = response.detail[0]
        if (response.index > anim_step) { return }
        if (response.direction == "up") {
            anim_step = response.index;
        }
    }
    addEventListener("step-exit", stepExit);

    handleResize();
    requestAnimationFrame(renderWorldMap);
}