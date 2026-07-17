// Checks if a point is within the 2D brush selection
export function inBrush(selection, point) {
    const [start,end] = selection;
    if(Array.isArray(start) && Array.isArray(end)) {        // is 2D brush
        const [[x0, y0], [x1, y1]] = [start, end];
        const [x, y] = point;
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    } else {                                                // 1D brush (brushX or brushY)
        return start <= point && point <= end;
    }
}

// Checks if the brush is valid
export function isValid(e) {
    if (!e.selection || !e.sourceEvent)
        return false;               // brush is not null and is triggered by a user event
    const [start, end] = e.selection;
    if(Array.isArray(start) && Array.isArray(end)) {            // is 2D brush
        return start[0] !== end[0] && start[1] !== end[1];      // brush is an area
    } else {                                                    // 1D brush
        return start !== end;                                   // brush is an interval
    }
}