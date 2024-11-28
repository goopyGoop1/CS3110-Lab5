# CS3110 - Lab 5: Chad

This project implements a WebGL-based 3D scene renderer that uses shaders to display objects such as planes, spheres, cylinders, pyramids, and triangles. It allows user interaction through various buttons to adjust the camera parameters like field of view (FOV), near/far clipping planes, and camera position.

---

## Features

- **Objects**: Includes spheres, planes, pyramids, cylinders, and triangles in the 3D scene.
- **Shaders**: Custom vertex and fragment shaders for rendering.
- **User Interaction**: Adjustable camera settings (FOV, camera position, near/far planes).
- **Hierarchical Model Transformations**: Objects are translated, rotated, and scaled within the 3D world.
- **Color Customization**: Each object has customizable colors.
- **Depth Testing**: Ensures proper rendering of overlapping objects.

---

## File Structure

- **HTML**: Includes the `<canvas>` element and buttons for user interaction.
- **JavaScript**: Implements the WebGL rendering, object initialization, and event handling.
- **Vertex shader (VSHADER_SOURCE)**: Defines how vertex positions and colors are processed.
- **Fragment shader (FSHADER_SOURCE)**: Defines how fragment colors are computed.

---

## How It Works

### Shaders

- **Vertex Shader**: Calculates the final position of each vertex using the model, view, and projection matrices.
- **Fragment Shader**: Sets the color of each pixel.

### Geometry Initialization

Various objects (planes, spheres, cylinders, pyramids, triangles) are created using vertex arrays and indices.

### Rendering

Each object is drawn using WebGL buffers, and transformations are applied to position them in the scene.

### Camera

A perspective projection is used, and the camera is positioned and oriented using the `setLookAt` function.

---

## Setup

### Prerequisites

1. A modern web browser that supports WebGL.
2. Basic understanding of HTML, JavaScript, and WebGL.
3. **Required Files**: Ensure you include all necessary library files (e.g., `webgl-utils.js`, `cuon-matrix.js`, etc.) in the **parent folder** of the project. These are essential for the program to run properly.

---

### How to Run

1. Clone or download the repository to your local machine.
2. Ensure all required library files are in the parent folder.
3. Open the HTML file in a WebGL-compatible browser.
4. Use the on-screen buttons to interact with the scene.

---

## Code Breakdown

### Key Functions

#### Shaders

- **VSHADER_SOURCE**: Processes vertex positions and colors.
- **FSHADER_SOURCE**: Processes pixel colors for display.

#### Object Initialization

- `initPlane`: Creates a plane using vertices.
- `initTriangle`: Creates a simple triangle with a given color.
- `initSphere`: Creates a sphere by generating latitude/longitude points.
- `initCylinder`: Creates a cylindrical object.
- `initPyramid`: Creates a pyramid for 3D rendering.

#### Rendering

- `drawPlane`: Renders the plane in the scene.
- `drawTriangles`: Draws multiple triangles, used for decorations.
- `drawSpheres`: Renders spheres in the scene with transformations.
- `drawCylinder`: Draws cylinders, e.g., for a hammer.
- `drawPyramid`: Draws a pyramid, used as the character's beak.

#### Camera and Transformation

- Camera settings are configured with the `setLookAt` function.
- Projection settings are applied using `setPerspective`.

### User Interaction

- Buttons to adjust FOV, near/far clipping planes, and camera position.
- Automatic rerendering when parameters are changed.

---

## Example Scene

The scene features:

- A colorful plane as the ground.
- A main character composed of spheres and pyramids.
- Decorative objects like triangles and cylinders.

---

## Customization

- **Colors**: Change the colors of objects by modifying their initialization calls (e.g., `initSphere(gl, [1.0, 0.0, 0.0])` for red).
- **Shapes**: Add new objects by creating initialization functions similar to `initTriangle`.
- **Transformations**: Modify `translate`, `rotate`, and `scale` parameters in the rendering functions to reposition objects.

---

## Future Improvements

- Add lighting and shading for more realistic rendering.
- Implement texture mapping for objects.
- Add mouse or keyboard controls for enhanced interactivity.

---

## Troubleshooting

- If the scene does not render:
  - Ensure your browser supports WebGL.
  - Verify the required library files are included in the **parent folder**.
  - Confirm the shaders compile without errors.
  - Use browser developer tools to debug any WebGL-related errors.

---



![image](https://github.com/user-attachments/assets/4ec6e68b-e3f9-443e-b6e2-635519c68e4e)

