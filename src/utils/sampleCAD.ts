/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Procedurally generates a valid ASCII STL of a mechanical bracket / spur gear
 * for instant 3D testing.
 */
export function generateSampleSTLBlob(): Blob {
  const triangles: { p1: [number, number, number]; p2: [number, number, number]; p3: [number, number, number] }[] = [];

  const addTriangle = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) => {
    triangles.push({ p1, p2, p3 });
  };

  const addQuad = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number]
  ) => {
    addTriangle(p1, p2, p3);
    addTriangle(p1, p3, p4);
  };

  // Create an industrial stepped mounting hub with teeth
  const teeth = 12;
  const rInner = 12;
  const rBase = 28;
  const rOuter = 36;
  const height = 15;
  const baseHeight = 6;

  // Bottom face and top face of central hub
  const segments = teeth * 2;
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;
    const isTooth = i % 2 === 0;
    const r1 = isTooth ? rOuter : rBase;
    const r2 = (i + 1) % 2 === 0 ? rOuter : rBase;

    const x1_in = Math.cos(a1) * rInner;
    const y1_in = Math.sin(a1) * rInner;
    const x2_in = Math.cos(a2) * rInner;
    const y2_in = Math.sin(a2) * rInner;

    const x1_out = Math.cos(a1) * r1;
    const y1_out = Math.sin(a1) * r1;
    const x2_out = Math.cos(a2) * r2;
    const y2_out = Math.sin(a2) * r2;

    // Bottom face (z = 0)
    addTriangle([x1_in, y1_in, 0], [x2_out, y2_out, 0], [x1_out, y1_out, 0]);
    addTriangle([x1_in, y1_in, 0], [x2_in, y2_in, 0], [x2_out, y2_out, 0]);

    // Top face of base
    addTriangle([x1_in, y1_in, baseHeight], [x1_out, y1_out, baseHeight], [x2_out, y2_out, baseHeight]);
    addTriangle([x1_in, y1_in, baseHeight], [x2_out, y2_out, baseHeight], [x2_in, y2_in, baseHeight]);

    // Outer wall
    addQuad(
      [x1_out, y1_out, 0],
      [x2_out, y2_out, 0],
      [x2_out, y2_out, baseHeight],
      [x1_out, y1_out, baseHeight]
    );

    // Inner bore wall
    addQuad(
      [x1_in, y1_in, baseHeight],
      [x2_in, y2_in, baseHeight],
      [x2_in, y2_in, 0],
      [x1_in, y1_in, 0]
    );
  }

  // Raised central boss (cylinder from z=baseHeight to z=height)
  const bossRadius = 18;
  const bossSegments = 24;
  for (let i = 0; i < bossSegments; i++) {
    const a1 = (i / bossSegments) * Math.PI * 2;
    const a2 = ((i + 1) / bossSegments) * Math.PI * 2;

    const x1 = Math.cos(a1) * bossRadius;
    const y1 = Math.sin(a1) * bossRadius;
    const x2 = Math.cos(a2) * bossRadius;
    const y2 = Math.sin(a2) * bossRadius;

    const x1_in = Math.cos(a1) * rInner;
    const y1_in = Math.sin(a1) * rInner;
    const x2_in = Math.cos(a2) * rInner;
    const y2_in = Math.sin(a2) * rInner;

    // Boss top cap
    addQuad([x1_in, y1_in, height], [x2_in, y2_in, height], [x2, y2, height], [x1, y1, height]);

    // Boss outer wall
    addQuad([x1, y1, baseHeight], [x2, y2, baseHeight], [x2, y2, height], [x1, y1, height]);

    // Inner bore continuation
    addQuad([x1_in, y1_in, height], [x2_in, y2_in, height], [x2_in, y2_in, baseHeight], [x1_in, y1_in, baseHeight]);
  }

  let stlText = 'solid sample_gear\n';
  for (const t of triangles) {
    // Normal vector
    const u = [t.p2[0] - t.p1[0], t.p2[1] - t.p1[1], t.p2[2] - t.p1[2]];
    const v = [t.p3[0] - t.p1[0], t.p3[1] - t.p1[1], t.p3[2] - t.p1[2]];
    const nx = u[1] * v[2] - u[2] * v[1];
    const ny = u[2] * v[0] - u[0] * v[2];
    const nz = u[0] * v[1] - u[1] * v[0];
    const len = Math.hypot(nx, ny, nz) || 1;

    stlText += `  facet normal ${(nx / len).toFixed(4)} ${(ny / len).toFixed(4)} ${(nz / len).toFixed(4)}\n`;
    stlText += `    outer loop\n`;
    stlText += `      vertex ${t.p1[0].toFixed(3)} ${t.p1[1].toFixed(3)} ${t.p1[2].toFixed(3)}\n`;
    stlText += `      vertex ${t.p2[0].toFixed(3)} ${t.p2[1].toFixed(3)} ${t.p2[2].toFixed(3)}\n`;
    stlText += `      vertex ${t.p3[0].toFixed(3)} ${t.p3[1].toFixed(3)} ${t.p3[2].toFixed(3)}\n`;
    stlText += `    endloop\n`;
    stlText += `  endfacet\n`;
  }
  stlText += 'endsolid sample_gear\n';

  return new Blob([stlText], { type: 'model/stl' });
}

/**
 * Procedurally generates a valid ASCII DXF laser cut file of an electronics / motor mounting plate
 * with perimeter, rounded corners, mounting holes, and center cutout.
 */
export function generateSampleDXFBlob(): Blob {
  const dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
0
ENDSEC
0
SECTION
2
ENTITIES
0
LINE
8
CORTE_EXTERIOR
10
10.0
20
10.0
11
140.0
21
10.0
0
LINE
8
CORTE_EXTERIOR
10
140.0
20
10.0
11
140.0
21
90.0
0
LINE
8
CORTE_EXTERIOR
10
140.0
20
90.0
11
10.0
21
90.0
0
LINE
8
CORTE_EXTERIOR
10
10.0
20
90.0
11
10.0
21
10.0
0
CIRCLE
8
ORIFICIO_M4
10
22.0
20
22.0
40
2.5
0
CIRCLE
8
ORIFICIO_M4
10
128.0
20
22.0
40
2.5
0
CIRCLE
8
ORIFICIO_M4
10
128.0
20
78.0
40
2.5
0
CIRCLE
8
ORIFICIO_M4
10
22.0
20
78.0
40
2.5
0
CIRCLE
8
VENTILACION_CENTRAL
10
75.0
20
50.0
40
20.0
0
LINE
8
GRABADO_CENTRAL
10
45.0
20
50.0
11
105.0
21
50.0
0
LINE
8
GRABADO_CENTRAL
10
75.0
20
20.0
11
75.0
21
80.0
0
ENDSEC
0
EOF`;

  return new Blob([dxfContent], { type: 'application/dxf' });
}

/**
 * Procedurally generates a sample SVG with cut and engraving paths.
 */
export function generateSampleSVGBlob(): Blob {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" width="100%" height="100%">
  <!-- Background grid for scale reference -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#020617"/>
  <rect width="100%" height="100%" fill="url(#grid)" />

  <!-- Cut line (Red #ef4444) -->
  <rect x="30" y="30" width="340" height="220" rx="16" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="none" />
  
  <!-- Mounting corner holes (Cut) -->
  <circle cx="60" cy="60" r="8" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="2" />
  <circle cx="340" cy="60" r="8" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="2" />
  <circle cx="340" cy="220" r="8" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="2" />
  <circle cx="60" cy="220" r="8" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" stroke-width="2" />
  
  <!-- Central cutout (Cut) -->
  <circle cx="200" cy="140" r="45" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" stroke-width="2" />

  <!-- Engraving details (Amber / Black #f97316) -->
  <text x="200" y="80" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="14" fill="#f97316" letter-spacing="2">3D FACTORY CNC</text>
  <text x="200" y="215" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" fill="#94a3b8">DIMENSIONES: 170 x 110 mm</text>
  <path d="M 120 140 L 155 140 M 245 140 L 280 140" stroke="#f97316" stroke-width="1.5" stroke-dasharray="4 2" />
</svg>`;

  return new Blob([svg], { type: 'image/svg+xml' });
}
