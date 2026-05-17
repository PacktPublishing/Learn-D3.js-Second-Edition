This image shows examples of affine transforms using the `matrix(a,b,c,d,dx,dy)` function in SVG, where `a`, `b`, `c` and `d` are the elements of a square matrix which is used to skew, rotate and scale a coordinate system, and `dx` and `dy` are the elements of the translation vector.

The first plane (1,1) shows a 60x60 pixel square positioned at (0,0). If the coordinate system represents the screen, the view port is represented by the lower right quadrant, where `y >= 0` (`y` increases downwards) and `x >= 0` (`x` increases towards the right).

The second plane (1,2) shows the shape being translated by a positive value of `x`(to the right) and then to a positivel value of `y` (downwards). This could alsop be done using the `translate(x,y)` transformation function.

The third plane (1,3) shows a shape being scaled down by 50% on the `x` axis, distorting it, and then on the `y` axis, bringing it back to its original aspect ratio. This could be done using the `scale(x)` and `scale(x,y)` transformation functions.

The fourth plane (2,1) illustrates the rotation of the shape in three steps, by first skewing, then inverting the skew, and finally scaling it back to its original size. The skewing can be done using the `skew(angle_x,angle_y)` functions and the rotation using `rotate(angle)`.

The middle plane (2,2) shows how to flip and invert shapes in a coordinate system.

The sixth plane (2,3) attempts to rotate an image at the center by translating its center to the origin of the coordinate system. But the rotation occurs relative to the top-left position of the image.

The seventh plane (3,1) calculates the translation (`dx`, `dy`) necessary to compensate the rotation for each angle, which is `dx = width/2 * cos(angle) + height/2 * sin(angle)` and `dy = width/2 * cos(angle) - height/2 * sin(angle)`. Since the shape is a square with `side = 60`, `height` and `width` are both `30`. This transformation can also be done using `rotate(angle, width/2, height/2)`, which is simpler.

The eighth plane (3,2) performs a vertical shear, and the ninth plane (3,3) performs two shears. Then the shapes from (1,1) and (3,2) are combined to draw a cube in isometric projection.