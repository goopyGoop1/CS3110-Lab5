// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec3 a_Color;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_ViewMatrix;\n' +
    'uniform mat4 u_ProjectionMatrix;\n' +
    'varying vec3 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec3 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = vec4(v_Color, 1.0);\n' +
    '}\n';




var fov = 90;
var near = 1;
var far = 100;
var eyeX = 0.0, eyeY = 2.0, eyeZ = 12.0;
var atX = 0.0, atY = 0.0, atZ = 0.0;
var upX = 0.0, upY = 1.0, upZ = 0.0;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders.');
        return;
    }

    // Initialize objects
    var plane = initPlane(gl);
    var sphereGreen = initSphere(gl, [0.0, 0.5, 0.0]);
    var sphereBlue = initSphere(gl, [0.0, 0.0, 1.0]);
    var sphereRed = initSphere(gl, [1.0, 0.0, 0.0]);
    var sphereOrange = initSphere(gl, [1.0, 0.5, 0.0]); 
    var sphereYellow = initSphere(gl, [1.0, 1.0, 0.0]); 
    var sphereWhite = initSphere(gl, [0.99, .970, 0.97]);
    var sphereBlack = initSphere(gl, [0.0, 0.0, 0.0]);
    var cylinderBrown = initCylinder(gl, [0.5, 0.3, 0.1]);
    var cylinderWhite = initCylinder(gl, [0.99, 0.970, 0.970]);
    var yellowTriangles = initTriangle(gl, [1.0, 1.0, 0.0]);    
    var redTriangles = initTriangle(gl, [1.0, 0.0, 0.0]); 
    var pyramid = initPyramid(gl, [1.0, 1.0, 0.0]); 

    if (!plane || !sphereGreen || !sphereBlue || !sphereRed || !sphereOrange || !sphereYellow || !sphereWhite || !sphereBlack || !cylinderBrown || !cylinderWhite || !yellowTriangles || !redTriangles || !pyramid) {
        console.error('Failed to initialize buffers.');
        return;
    }

    // Set clear color and enable depth test
    gl.clearColor(0.113, 0.870, 0.831, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get uniform locations
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
   

    if (!u_ViewMatrix || !u_ProjectionMatrix || !u_ModelMatrix) {
        console.error('Failed to get uniform locations.');
        return;
    }

    // Add event listeners for buttons
    setupEventListeners();

    function render() {
        var viewMatrix = new Matrix4().setLookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

        var projectionMatrix = new Matrix4().setPerspective(fov, canvas.width / canvas.height, near, far);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);

        
   

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Draw objects
        drawPlane(gl, plane, u_ModelMatrix);
        drawTriangles(gl,yellowTriangles, redTriangles, u_ModelMatrix);
        drawSpheres(gl, sphereGreen, sphereBlue, sphereRed, sphereOrange, sphereYellow, sphereWhite, sphereBlack, u_ModelMatrix);
        drawCylinder(gl, cylinderBrown, cylinderWhite, u_ModelMatrix)
        drawPyramid(gl, pyramid, u_ModelMatrix);
    }

    render();

    function setupEventListeners() {
        const controls = [
            { id: 'fov+', variable: 'fov', increment: 5, min: 5, max: 200 },
            { id: 'fov-', variable: 'fov', increment: -5, min: 5, max: 200 },
            { id: 'near+', variable: 'near', increment: 1, min: 0.1, max: () => far - 1 },
            { id: 'near-', variable: 'near', increment: -1, min: 0.1, max: () => far - 1 },
            { id: 'far+', variable: 'far', increment: 10 },
            { id: 'far-', variable: 'far', increment: -10, min: () => near + 1 },
            { id: 'eyeX+', variable: 'eyeX', increment: 1 },
            { id: 'eyeX-', variable: 'eyeX', increment: -1 },
            { id: 'eyeY+', variable: 'eyeY', increment: 1 },
            { id: 'eyeY-', variable: 'eyeY', increment: -1 },
            { id: 'eyeZ+', variable: 'eyeZ', increment: 1 },
            { id: 'eyeZ-', variable: 'eyeZ', increment: -1 },
            { id: 'atX+', variable: 'atX', increment: 1 },
            { id: 'atX-', variable: 'atX', increment: -1 },
            { id: 'atY+', variable: 'atY', increment: 1 },
            { id: 'atY-', variable: 'atY', increment: -1 },
            { id: 'atZ+', variable: 'atZ', increment: 1 },
            { id: 'atZ-', variable: 'atZ', increment: -1 },
            { id: 'upX+', variable: 'upX', increment: 1 },
            { id: 'upX-', variable: 'upX', increment: -1 },
            { id: 'upY+', variable: 'upY', increment: 1 },
            { id: 'upY-', variable: 'upY', increment: -1 },
            { id: 'upZ+', variable: 'upZ', increment: 1 },
            { id: 'upZ-', variable: 'upZ', increment: -1 },
        ];

        controls.forEach(({ id, variable, increment, min, max }) => {
            const element = document.getElementById(id);
            if (!element) return;

            element.addEventListener('click', () => {
                const maxValue = typeof max === 'function' ? max() : max;
                const minValue = typeof min === 'function' ? min() : min;

                window[variable] += increment;

                // Apply constraints if min or max are defined
                if (typeof minValue !== 'undefined') window[variable] = Math.max(window[variable], minValue);
                if (typeof maxValue !== 'undefined') window[variable] = Math.min(window[variable], maxValue);

                render();
            });
        });
    }
}

// Initialize the plane buffer
function initPlane(gl) {
    const vertices = new Float32Array([
        -5.0, 0.0,  9.0,  5.0, 0.0,  9.0,  -5.0, 0.0, -9.0,  5.0, 0.0, -9.0
    ]);
    const colors = new Float32Array([
        0.0, 0.3, 0.0,  0.0, 0.3, 0.0,  0.0, 0.3, 0.0,  0.0, 0.3, 0.0
    ]);
    return createBuffer(gl, vertices, colors, null, 4);
}

function initTriangle(gl, color) {
    const vertices = new Float32Array([
        -0.5, 0.5, 0.0,  // Vertex 1
        -0.75, 0.0, 0.0, // Vertex 2
        -0.25, 0.0, 0.0  // Vertex 3
    ]);

    const colors = new Float32Array([
        ...color, ...color, ...color // One color for each vertex
    ]);

    return createBuffer(gl, vertices, colors, null, 3);
}

// Initialize a sphere with given color
function initSphere(gl, color) {
    const latBands = 20, longBands = 20;
    const vertices = [], colors = [], indices = [];

    for (let lat = 0; lat <= latBands; lat++) {
        const theta = (lat * Math.PI) / latBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let lon = 0; lon <= longBands; lon++) {
            const phi = (lon * 2 * Math.PI) / longBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;

            vertices.push(x, y, z);
            colors.push(...color);

            if (lat < latBands && lon < longBands) {
                const first = lat * (longBands + 1) + lon;
                const second = first + longBands + 1;
                indices.push(first, second, first + 1, second, second + 1, first + 1);
            }
        }
    }
    return createBuffer(gl, new Float32Array(vertices), new Float32Array(colors), new Uint16Array(indices), indices.length);
}


function initCylinder(gl, color) {
    const slices = 20;
    const vertices = [], colors = [], indices = [];
    const radius = 0.5, height = 1.0;

    for (let i = 0; i <= slices; i++) {
        const angle = (i * 2 * Math.PI) / slices;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);

        vertices.push(x, height / 2, z, x, -height / 2, z);
        colors.push(...color, ...color);

        if (i < slices) {
            const p1 = i * 2;
            const p2 = p1 + 1;
            const p3 = (i + 1) * 2;
            const p4 = p3 + 1;

            indices.push(p1, p3, p2, p2, p3, p4);
        }
    }
    return createBuffer(gl, new Float32Array(vertices), new Float32Array(colors), new Uint16Array(indices), indices.length);
}


function initPyramid(gl, color) {
    // Vertices of the pyramid (apex and base)
    const vertices = new Float32Array([
        0.0,  1.0,  0.0,  // Apex (top)
       -0.5,  0.0, -0.5,  // Base vertex 1
        0.5,  0.0, -0.5,  // Base vertex 2
        0.0,  0.0,  0.5   // Base vertex 3
    ]);

    // Colors for each vertex (same for simplicity, but can vary)
    const colors = new Float32Array([
        ...color,  // Apex
        ...color,  // Base vertex 1
        ...color,  // Base vertex 2
        ...color   // Base vertex 3
    ]);

    // Indices defining the triangular faces
    const indices = new Uint16Array([
        0, 1, 2,  // Side 1
        0, 2, 3,  // Side 2
        0, 3, 1,  // Side 3
        1, 2, 3   // Base (triangle)
    ]);

    return createBuffer(gl, vertices, colors, indices, indices.length);
}

// Helper to create a buffer object
function createBuffer(gl, vertices, colors, indices, vertexCount) {
    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const indexBuffer = indices ? gl.createBuffer() : null;

    if (!vertexBuffer || !colorBuffer || (indices && !indexBuffer)) {
        console.error('Failed to create buffer objects.');
        return null;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    if (indices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    return { vertexBuffer, colorBuffer, indexBuffer, vertexCount, a_Position, a_Color };
}

// Draw the plane
function drawPlane(gl, plane, u_ModelMatrix) {
    const modelMatrix = new Matrix4()
    
    modelMatrix.setTranslate(0.0, 0.0, 8.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, plane);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, plane.vertexCount);
}


// Draw Triangles
function drawTriangles(gl, yellowTriangles, redTriangles,  u_ModelMatrix) {
    const modelMatrix = new Matrix4();

   //Yellow Triangles for the belt 
    modelMatrix.setIdentity().translate(0.1, 1.2, 8.8).scale(.3, 0.3, 0.3).rotate(180, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);


    modelMatrix.setIdentity().translate(-0.1, 1.2, 8.8).scale(.3, 0.3, 0.3).rotate(180, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);

    modelMatrix.setIdentity().translate(-0.3, 1.2, 8.8).scale(.3, 0.3, 0.3).rotate(180, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);

    modelMatrix.setIdentity().translate(-0.5, 1.2, 8.8).scale(.3, 0.3, 0.3).rotate(180, 0, 0, 1).rotate(5, 0, 1, 0); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);
    

    // Yellow Tirangles  used for a star Front
    modelMatrix.setIdentity().translate(-1.1, 1.80, 8.9).scale(.6, 0.6, 0.6); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);

    modelMatrix.setIdentity().translate(-1.175, 2.1, 8.9).scale(.6, 0.6, 0.6).rotate(60, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);

    
    
    
    // Yellow Tirangles  used for a star Back
    modelMatrix.setIdentity().translate(-1.1, 1.80, 7.55).scale(.6, 0.6, 0.6); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);

    modelMatrix.setIdentity().translate(-1.175, 2.1, 7.55).scale(.6, 0.6, 0.6).rotate(60, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, yellowTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, yellowTriangles.vertexCount);

    // Red Triangles for the belt
    modelMatrix.setIdentity().translate(0.5, 1.05, 8.8).scale(.3, 0.3, 0.3).rotate(0, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, redTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, redTriangles.vertexCount);

    modelMatrix.setIdentity().translate(0.3, 1.05, 8.8).scale(.3, 0.3, 0.3).rotate(0, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, redTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, redTriangles.vertexCount);

    modelMatrix.setIdentity().translate(0.1, 1.05, 8.8).scale(.3, 0.3, 0.3).rotate(0, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, redTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, redTriangles.vertexCount);

    modelMatrix.setIdentity().translate(-0.1, 1.05, 8.8).scale(.3, 0.3, 0.3).rotate(0, 0, 0, 1); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, redTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, redTriangles.vertexCount);


    modelMatrix.setIdentity().translate(-0.3, 1.05, 8.8).scale(.15, 0.15, 0.15).rotate(5, 0, 1, 0); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, redTriangles);
    gl.drawArrays(gl.TRIANGLES, 0, redTriangles.vertexCount);

}

// Draw all spheres
function drawSpheres(gl, sphereGreen, sphereBlue, sphereRed, sphereOrange, sphereYellow, sphereWhite, sphereBlack, u_ModelMatrix) {
    const modelMatrix = new Matrix4();

    // Green spheres
    for (let i = 1; i <= 15; i++) {
        for (const x of [-2.0, 2.0]) {
            modelMatrix.setIdentity().translate(x, .50, i).scale(0.25, 0.25, 0.25);
            gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
            bindBuffer(gl, sphereGreen);
            gl.drawElements(gl.TRIANGLES, sphereGreen.vertexCount, gl.UNSIGNED_SHORT, 0);
        }
    }

    // Blue spheres

    // This is the body 
    modelMatrix.setIdentity().translate(0.0, 1.0, 8.250).scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereBlue);
    gl.drawElements(gl.TRIANGLES, sphereBlue.vertexCount, gl.UNSIGNED_SHORT, 0);

   
   
   // This is the Head 
    modelMatrix.setIdentity().translate(0.0, 1.65, 8.25).scale(0.25, 0.25, 0.25);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereBlue);
    gl.drawElements(gl.TRIANGLES, sphereBlue.vertexCount, gl.UNSIGNED_SHORT, 0);

   




    // Red spheres

    // This is the Hat  
    modelMatrix.setIdentity().translate(0.0, 1.9, 8.250).scale(0.2, 0.2, 0.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereRed);
    gl.drawElements(gl.TRIANGLES, sphereRed.vertexCount, gl.UNSIGNED_SHORT, 0);

    
    
    // This is the coat 
    modelMatrix.setIdentity().translate(0.0, 0.95, 7.85).scale(0.65, 0.65, 0.4);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereRed);
    gl.drawElements(gl.TRIANGLES, sphereRed.vertexCount, gl.UNSIGNED_SHORT, 0);

    
    
    // This is arm on the right
    modelMatrix.setRotate(-15, 0.0, 0.0, 1.0).translate(0.5, 1.25, 7.80).scale(0.40, 0.15, 0.40);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereRed);
    gl.drawElements(gl.TRIANGLES, sphereRed.vertexCount, gl.UNSIGNED_SHORT, 0);


    // This is the left arm. 
    modelMatrix.setRotate(15, 0.0, 0.0, 1.0).translate(-0.60, 1.25, 7.80).scale(0.40, 0.15, 0.40);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereRed);
    gl.drawElements(gl.TRIANGLES, sphereRed.vertexCount, gl.UNSIGNED_SHORT, 0);

    // Hammer front
    modelMatrix.setIdentity().translate(-1.43, 1.9, 8.80).scale(0.25, 0.25, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereRed);
    gl.drawElements(gl.TRIANGLES, sphereRed.vertexCount, gl.UNSIGNED_SHORT, 0);


    // Hammer back
    modelMatrix.setIdentity().translate(-1.43, 1.9, 7.60).scale(0.25, 0.25, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereRed);
    gl.drawElements(gl.TRIANGLES, sphereRed.vertexCount, gl.UNSIGNED_SHORT, 0);

    
    
    // Yellow spheres
    
    
    // This is the Rim of the hat
    modelMatrix.setIdentity().translate(0.0, 1.8, 8.250).scale(-0.3, 0.10, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereYellow);
    gl.drawElements(gl.TRIANGLES, sphereYellow.vertexCount, gl.UNSIGNED_SHORT, 0);


    // This is the ball on the hat
    modelMatrix.setIdentity().translate(0.0, 1.90, 8.5).scale(0.05, 0.05, 0.05);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereYellow);
    gl.drawElements(gl.TRIANGLES, sphereYellow.vertexCount, gl.UNSIGNED_SHORT, 0);

    
    
    
   
   // White spheres
   

   //Eye Right 
    modelMatrix.setIdentity().translate(0.10, 1.675, 8.45).scale(0.05, 0.1, 0.05);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);
    


    // Eye Left
    modelMatrix.setIdentity().translate(-0.10, 1.675, 8.45).scale(0.05, 0.1, 0.05);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);

    
    // Right eyeball 
    modelMatrix.setIdentity().translate(0.105, 1.685, 8.53).scale(0.015, 0.015, 0.015);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);

    
    
    // Left Eyeball 
    modelMatrix.setIdentity().translate(-0.105, 1.685, 8.53).scale(0.015, 0.015, 0.015);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);

    // This is the coat lining 
    modelMatrix.setIdentity().translate(0.0, 0.95, 8.00).scale(0.60, 0.60, 0.4);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);


    // Right Cuff
    modelMatrix.setRotate(-10, 0.0, 0.0, 1.0).translate(.95, 1.19, 7.90).scale(0.30, 0.10, 0.30);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);;


    // Left Cuff
    modelMatrix.setRotate(10, 0.0, 0.0, 1.0).translate(-1.00, 1.19, 7.90).scale(0.30, 0.10, 0.30);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);

    // Ball on top of the hat
    modelMatrix.setIdentity().translate(0.0, 2.1, 8.15).scale(0.1, 0.1, 0.1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereWhite);
    gl.drawElements(gl.TRIANGLES, sphereWhite.vertexCount, gl.UNSIGNED_SHORT, 0);






    //Black spheres

    // Right Eye 
    modelMatrix.setIdentity().translate(0.105, 1.675, 8.49).scale(0.035, 0.075, 0.035);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereBlack);
    gl.drawElements(gl.TRIANGLES, sphereBlack.vertexCount, gl.UNSIGNED_SHORT, 0);

    // Left Eye 
    modelMatrix.setIdentity().translate(-0.105, 1.675, 8.49).scale(0.035, 0.075, 0.035);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereBlack);
    gl.drawElements(gl.TRIANGLES, sphereBlack.vertexCount, gl.UNSIGNED_SHORT, 0);
    
    

    // Orange Sphere

    // Right Foot 
    modelMatrix.setIdentity().translate(0.50, 0.5, 8.0).scale(0.3, 0.1, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereOrange);
    gl.drawElements(gl.TRIANGLES, sphereOrange.vertexCount, gl.UNSIGNED_SHORT, 0);

    // Left Foot
    modelMatrix.setIdentity().translate(-0.50, 0.5, 8.0).scale(0.3, 0.1, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereOrange);
    gl.drawElements(gl.TRIANGLES, sphereOrange.vertexCount, gl.UNSIGNED_SHORT, 0);


   // Right hand
    modelMatrix.setIdentity().rotate(-5.5, 0, 0, 1).translate(1.22, 1.1, 8).scale(0.3, 0.1, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereOrange);
    gl.drawElements(gl.TRIANGLES, sphereOrange.vertexCount, gl.UNSIGNED_SHORT, 0);


    // Left hand
    modelMatrix.setIdentity().rotate(5, 0, 0, 1).translate(-1.33, 1.1, 8).scale(0.3, 0.1, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, sphereOrange);
    gl.drawElements(gl.TRIANGLES, sphereOrange.vertexCount, gl.UNSIGNED_SHORT, 0);


}


function drawCylinder(gl, cylinderBrown, cylinderWhite, u_ModelMatrix) {
    const modelMatrix = new Matrix4();
   
    
    
    // Handle of the hammer
    modelMatrix.setIdentity().translate(-1.4, 1.20, 8.20).rotate(0, 0, 0, 1).scale(0.3, 1.5, 0.3);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, cylinderBrown);
    gl.drawElements(gl.TRIANGLES, cylinderBrown.vertexCount, gl.UNSIGNED_SHORT, 0);


    
    // Hammer head
    modelMatrix.setIdentity().translate(-1.45, 1.90, 8.20).rotate(90, 1, 0, 0).scale(0.55, 1.05, 0.55);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, cylinderBrown);
    gl.drawElements(gl.TRIANGLES, cylinderBrown.vertexCount, gl.UNSIGNED_SHORT, 0);


    // Hammer White ring front
    modelMatrix.setIdentity().translate(-1.45, 1.90, 8.55).rotate(90, 1, 0, 0).scale(0.5, 0.40, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, cylinderWhite);
    gl.drawElements(gl.TRIANGLES, cylinderWhite.vertexCount, gl.UNSIGNED_SHORT, 0);


      // Hammer White ring back
      modelMatrix.setIdentity().translate(-1.45, 1.90, 7.80).rotate(90, 1, 0, 0).scale(0.5, 0.40, 0.5);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      bindBuffer(gl, cylinderWhite);
      gl.drawElements(gl.TRIANGLES, cylinderWhite.vertexCount, gl.UNSIGNED_SHORT, 0);

    


}


function drawPyramid(gl, pyramid, u_ModelMatrix) {
    const modelMatrix = new Matrix4();

    // Used for beak 
    modelMatrix.setIdentity().translate(0.0, 1.55, 8.4).scale(0.25, 0.1, 0.25).rotate(90, 1, 0, 0); // Adjust position as needed
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    bindBuffer(gl, pyramid);
    gl.drawElements(gl.TRIANGLES, pyramid.vertexCount, gl.UNSIGNED_SHORT, 0);
}

// Bind buffer and set attributes
function bindBuffer(gl, buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.vertexBuffer);
    gl.vertexAttribPointer(buffer.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(buffer.a_Position);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.colorBuffer);
    gl.vertexAttribPointer(buffer.a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(buffer.a_Color);

    if (buffer.indexBuffer) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);
    }
}
