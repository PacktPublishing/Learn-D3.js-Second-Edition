export function forceRandom() {
    let nodes;
    let strength = 1;

    function force(alpha) {
        for (const node of nodes) {
            node.vx += (Math.random() * 2 - 1) * strength * alpha;
            node.vy += (Math.random() * 2 - 1) * strength * alpha;
        }
    }

    force.strength = function (_strength) {
        strength = _strength;
        return force;
    };

    force.initialize = _nodes => nodes = _nodes;

    return force;
}

/**
 * A custom force that attracts nodes to multiple points.
 * @param points
 * @param strength
 * @returns {force}
 */
export function forceMultiAttract(points) {
    let nodes;
    let strength = 1;

    function force(alpha) {
        for (const node of nodes) {
            let fx = 0;
            let fy = 0;

            for (const [px, py] of points) {
                const dx = px - node.x;
                const dy = py - node.y;

                const distance = dx*dx + dy*dy + 1;
                const weight = 1 / distance;

                fx += dx * weight;
                fy += dy * weight;
            }

            const k = typeof strength === "function" ? strength(node) : strength;
            node.vx += fx * k * alpha;
            node.vy += fy * k * alpha;
        }
    }

    force.initialize = function (_nodes) {
        nodes = _nodes;
    };

    force.strength = function (_) {
        if (!arguments.length) return strength;
        strength = typeof _ === "function" ? _ : function () { return +_; };
        return force;
    };

    return force;
}