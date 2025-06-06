/**
 * Nesting utilities for hierarchies.
 * This module provides functions to create a nested structure from D3v6+ d3.rollups() outputs and
 * D3V5 d3.nest() outputs, suitable for use by d3.hierarchy()
 *
 * @version 1.0.0
 */

/**
 * Produces a d3.nest() equivalent output (objects with key/value or key/values), given the
 * results of a d3.rollups() operation.
 * @param data: data to be nested (output from d3.rollups())
 * @param levels: number of key functions passed to the d3.rollups() operation
 * @param depth: current depth of the recursion, default is 0 (this is optional - used internally for recursion).
 */
export function nest(data, levels, depth = 0) {
    if (depth >= levels)
        return data;
    if (depth === levels - 1)
        return data.map(d => ({key: d[0], value: d[1]}));
    else
        return data.map(d => ({key: d[0], values: nest(d[1], levels, depth + 1)}));
}



/**
 * Creates a root suitable for use by d3.hierarchy() from a D3v5 d3.nest() type structure.
 * Can be used with D3v5 d3.nest() or the output of this module's nest() function
 * that takes a D3v6+ d3.rollups() output.
 * @param nestedData: data to be nested
 * @param rootKey: key of the root node
 */
export function rootFromNest(nestedData, rootKey) {
    // Get or create the root node
    const root = findNamedRoot(nestedData, rootKey) || obtainRootNode(nestedData, rootKey);

    // If there is a root, but no values property (it is a leaf), then just return the root node.
    if(!root.values) return root;

    root.values.forEach(c => nestChild(c, nestedData));  // Descend to next level
    root.id = root.key; // use key as id
    return root;

    // Inner recursive function to process each child node.
    function nestChild(child, nestedData) {
        const obj = nestedData.filter(d => d.key === child.key);
        if (child.value) { // if it has a value property, then it's a leaf node
            Object.assign(child, child.value);  // copy the value properties to the child
            delete child.value;                 // remove the value property
            if (obj && obj[0] && obj[0].values) { // if child key exists in nestedData, it's a group, so copy its values
                child.values = obj[0].values;
                child.values.forEach(c => nestChild(c, nestedData));  // if it has children, descend to next level
            }
        } else { // a group node
            child.values.forEach(c => nestChild(c, obj[0].values)); // descend to next level
        }
        child.id = child.key; // use key as id
        return child;
    }
}

// These functions, used by rootFromNest, are exported fo testing only
export function findNamedRoot(nestedData, rootKey) {
    return nestedData.filter(d => d.key === rootKey)[0];
}
export function obtainRootNode(nestedData, rootKey) {
    // If there is a single null, 'null' or '' node, then use it's first child as the root (get the value props)
    const nullEntry = nestedData.filter(d => d.key === 'null' || d.key === '' || d.key === null)[0];
    const root = findNamedRoot(nestedData, rootKey) || {};
    if (nullEntry && nullEntry.values && nullEntry.values[0]) {
        const rootNode = nullEntry.values[0];
        Object.assign(root, rootNode.value);  // copy the value properties to the root node
    } else {
        Object.assign(root, {key: rootKey, values: nestedData}); // If no null key, create new root using rootKey + nestedData
    }
    return root;
}
//////////



/**
 * Creates a root suitable for use by d3.hierarchy() from a nested Map structure generated via d3.rollup().
 * @param rollup: data to be nested (output from d3.rollup())
 * @param rootKey: key of the root node. If not found, will create a new root node and use the current data as children.
 * @param isTidy: if true, will keep original structure, otherwise will flatten single-child levels that have same key.
 * @returns {{id, children: *[]}} - data structure that can be used with d3.hierarchy()
 */
export function rootFromRollup(rollup, rootKey, isTidy = true) {
    const root = {};  // Create the root node

    const nullMap = rollup.get(null);  // Check for the presence of a null key in the rollup
    if (nullMap && nullMap.size > 0) { // If there is a null key, then use its first child as the root
        initializeRootFromMap(root, nullMap, rollup);
    } else if (rootKey) { // If there is no null key, then use the rootKey to obtain the root node
        const rootItem = rollup.get(rootKey);

        if (rootItem) { // If rootKey exists in the rollup, use it as the root, otherwise create a new root
            Object.assign(root, {id: rootKey, children: addChildren(rootItem, rollup)});
        } else {
            root.id = rootKey;
            root.children = addChildren(rollup, rollup);
        }
    }
    return root;

    // Initialize root from a Map with null key
    function initializeRootFromMap(root, map, rollup) {
        const rootObject = map.values().next().value; // get the first child (object)
        const rootObjKey = map.keys().next().value;   // get the key of the first child
        Object.assign(root, rootObject);              // copy object properties
        const rootItem = rollup.get(rootObjKey);      // get the item (map if group, object if leaf) for the root node
        root.id = rootObjKey;                         // set the id to the key of the first child

        if (rootItem instanceof Map) { // if the rootItem is a map, then it's a group node
            root.children = addChildren(rootItem, rollup); // add the child nodes to the root
        } else {
            root.value = rootItem; // if it's not a map, then it's a leaf node
        }
    }

    // Inner recursive function to process each child node
    function addChildren(subMap, mainMap) {
        const children = [];
        const keys = subMap.keys();
        keys.forEach(key => { // for each rootmap key
            const childItem = subMap.get(key);   // get the item (object or Map) for the key
            if (childItem instanceof Map && childItem.size === 1 && childItem.has(key) && !isTidy) {  // eliminate duplicate levels
                children.push(processChild(key, childItem.get(key), mainMap));
            } else {
                children.push(processChild(key, childItem, mainMap));
            }
        });
        return children;
    }

    // Process a single child node
    function processChild(key, childItem, mainMap) {
        childItem.id = key;
        if (childItem instanceof Map) { // if the childItem is a map, then it's a group node
            childItem.children = addChildren(childItem, mainMap); // go to next level
        } else { // is object
            const entryItem = mainMap.get(key);  // check if object is a top-level entry
            if (entryItem && entryItem instanceof Map) { // if the item is a map, it's a group node
                if (!isContained(entryItem, childItem)) { // avoid infinite loop if childItem is contained in entryItem
                    childItem.children = addChildren(entryItem, mainMap); // add the child nodes to the object
                }
            }
        }
        return childItem; // add the leaf node
    }
}


// Checks if a node is contained in a Map, to avoid infinite loops
function isContained(parent, node) {
    if (!parent || !(parent instanceof Map)) return false;
    for (const child of parent.values()) {
        if (child === node) return true;
        if (child instanceof Map && isContained(child, node)) return true;
    }
    return false;
}

/**
 * Create line pairs from source and target properties for path links that don't use d3.link.
 * @param data
 * @returns {*}
 */
export function makeLinePairs(data) {
    return data.links().map(d => {
        const pair = [[d.source.y, d.source.x]];
        pair.push([d.target.y, d.target.x]);
        return pair;
    });
}