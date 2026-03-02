/**
 * Simple Phylogenetic Tree Parser (TNT format)
 */
import * as d3 from "https://cdn.skypack.dev/d3@7.9.0";

export function parseTree(input) {
    let index = 0;
    let nodeId = 0; // Initialize a counter for sequential IDs

    function parseNode() {
        const node = { node: nodeId++ }; // Assign a unique ID to each node
        const children = [];

        while (index < input.length) {
            const char = input[index];

            if (char === '(') {
                index++; // Skip '('
                children.push(parseNode());
            } else if (char === ')') {
                index++; // Skip ')'
                break;
            } else if (char === ',') {
                index++; // Skip ','
            } else if (/\S/.test(char)) { // Parse a name
                let name = '';
                while (index < input.length && /[^\s(),]/.test(input[index])) {
                    name += input[index++];
                }
                children.push({ node: nodeId++, name }); // Assign ID to leaf nodes
            } else {
                index++; // Skip any other characters (e.g., whitespace)
            }
        }

        if (children.length > 0) {
            node.children = children;
        }

        return node;
    }

    return parseNode();
}