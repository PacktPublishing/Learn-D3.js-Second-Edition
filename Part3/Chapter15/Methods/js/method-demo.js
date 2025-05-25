import * as d3 from "https://cdn.skypack.dev/d3@7";

export function methodDemo(root) {
    // 2) value property before calling count() or sum() (undefined)
    console.log("2. root.value before root.count()", root.value);

    // 3) count() - generate value property with number of leaves
    root.count();
    console.log("3. root.value after root.count()", root.value, root.copy());
    console.log(root.copy().descendants().map(d => d.value))

    // 4) sum() – generate value property with number of nodes
    root.sum(d => 1);
    console.log("4. root.value after root.sum(d => 1) ", root.value, root.copy());
    console.log(root.copy().descendants().map(d => d.value))

    // 5.1) sum() - leaf-count (same as root.count()) (needs to use a copy)
    root.copy().sum(d => !d.children ? 1 : 0);
    console.log("5.1 root.value after root.sum(d => d.height == 0?1:0)", root.value, root.copy());
    console.log(root.copy().descendants().map(d => d.value))

    // 5.2) sum() - leaf-count using height (needs to use a copy)
    root.copy().sum(d => d.height ? 1 : 0);
    console.log("5.2 root.copy.value after root.sum(d => d.height == 0?1:0)", root.value, root.copy());
    console.log(root.copy().descendants().map(d => d.value))

    // 6) sum() - leaf-sum
    root.sum(d => d.content ? d.content[0] : 0);
    console.log("6. Cumulative sum of values[0]", root.value, root.copy());
    console.log(root.copy().descendants().map(d => d.value))

    // 7) sibling node.sort() by descending height and ascending value
    root.sort((a,b) => b.height - a.height || a.value - b.value);
    console.log("7. Sorted by height and value", root.descendants());

    // 8) root.eachAfter() – set values for each node based on descendants
    root.eachAfter(function(d) {
        if(d.children) {
            d.data.content = [0,0];
            d.children.forEach(function(c) {
                d.data.content[0] += c.data.content[0];
                d.data.content[1] += c.data.content[1]
            });
        }
    });
    console.log("8. root.eachAfter(): sum of data values", root.data.content);

    // 9) root.eachBefore() – create property with hierarchical numbering
    root.eachBefore(function(d) {
        if(!d.parent) {
            d.number = 1;
        } else {
            d.number = `${d.parent.number}.${d.parent.children.indexOf(d)+1}`;
        }
    });
    console.log("9. root.eachBefore(): numbering", root);

    // 10) root.each() – create property with breadth order
    let order = 0;
    root.each(function(d) { d.order = ++order; });
    console.log("10. root.each(): breadth order", root);
}