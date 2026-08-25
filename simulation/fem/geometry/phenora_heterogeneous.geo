// ============================================================
// PHENORA V1 — 2D HETEROGENEOUS BIOLOGICAL REGION GEOMETRY
// Sample: 20 mm x 10 mm
// Inclusion Region: 8 mm x 4 mm (centered)
// ============================================================
L = 20e-3;
H = 10e-3;
lc = 0.5e-3;

// Outer sample corners
Point(1) = {0, 0, 0, lc};
Point(2) = {L, 0, 0, lc};
Point(3) = {L, H, 0, lc};
Point(4) = {0, H, 0, lc};

// Outer boundary lines
Line(1) = {1, 2}; // Bottom
Line(2) = {2, 3}; // Right Electrode (0.0 V)
Line(3) = {3, 4}; // Top
Line(4) = {4, 1}; // Left Electrode (1.0 V)

// Inner biological region corners (Centered: x from 6mm to 14mm, y from 3mm to 7mm)
Point(5) = {6e-3, 3e-3, 0, lc};
Point(6) = {14e-3, 3e-3, 0, lc};
Point(7) = {14e-3, 7e-3, 0, lc};
Point(8) = {6e-3, 7e-3, 0, lc};

// Inner region lines
Line(5) = {5, 6};
Line(6) = {6, 7};
Line(7) = {7, 8};
Line(8) = {8, 5};

// Line loops
Line Loop(1) = {1, 2, 3, 4};  // Outer boundary
Line Loop(2) = {5, 6, 7, 8};  // Inner inclusion boundary

// Surfaces
Plane Surface(1) = {1, 2}; // Medium (Outer loop minus inner loop)
Plane Surface(2) = {2};    // Biological Region (Inner loop)

// Physical groups
Physical Surface(1) = {1}; // Body 1: Medium
Physical Surface(2) = {2}; // Body 2: Bio Region

Physical Line(1) = {1}; // Bottom
Physical Line(2) = {2}; // RightElectrode
Physical Line(3) = {3}; // Top
Physical Line(4) = {4}; // LeftElectrode

