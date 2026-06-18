# Chapter03

Files and exercises for the online Chapter 3 - Essential SVG for D3.

## 1) Access the chapter online

This chapter is a reference about essential SVG features you should know to efficiently use D3. You can [read this chapter online](index.html) or [download it in PDF](Chapter03.pdf) (kB).

## 2) Description of each subfolder in this folder

Each directory contains two or more subdirectories: the `SVG` subdirectory contains code written in SVG (and pure JavaScript, if it contains scripts). The `D3` subdirectory implements the same examples using D3 and using recommended D3 features. Some directories also contain a `DOM` subfolder. 

__`Shapes/`__

Examples creating SVG shapes: rectangles, circles, ellipses, lines, and polygons, and applying styles (strokes, fills, etc).

__`Containers/`__

SVG containers, such as the initial viewport (svg), nested viewports, groups (g), and the use of the viewBox attribute.

__`Paths/`__

Examples using SVG paths, to produce open and closed shapes, curves and arcs.

__`Text/`__

Examples using text, tspan and textPath, and styles for aligning text horizontally and vertically.

__`Links/`__

Examples using links, images and foreign objects.

__`Transforms/`__

Several examples using transforms: translating, rotating, scaling, shearing, flipping and combining transforms, using `transform-origin` and the `matrix()` function.

__`Other/`__

Simple examples using other SVG elements: `defs`, `use`, `symbol`, `marker`, `clipPath`, `mask`, `filter`, `gradient`, and `pattern`.

__`Animation/`__

Small examples using SVG animation (SMIL): `animate`, `set`, `animateTransform`, `animateMotion`, and text path animations.

__`API/`__

Examples using the SVG DOM API to obtain information from SVG elements and apply transforms. All code is pure JavaScript and in D3.

__`data/`__

Image files used by some examples.