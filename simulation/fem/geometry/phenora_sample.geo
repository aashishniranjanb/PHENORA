// ============================================
// PHENORA V0 — 2D ELECTRICAL SAMPLE GEOMETRY
// Dimensions: 20 mm x 10 mm
// ============================================
L = 20e-3;
H = 10e-3;
lc = 0.5e-3;

// Corner points
Point(1) = {0, 0, 0, lc};
Point(2) = {L, 0, 0, lc};
Point(3) = {L, H, 0, lc};
Point(4) = {0, H, 0, lc};

// Boundary lines
Line(1) = {1, 2}; // Bottom (insulated)
Line(2) = {2, 3}; // Right Electrode (0.0 V)
Line(3) = {3, 4}; // Top (insulated)
Line(4) = {4, 1}; // Left Electrode (1.0 V)

// Sample surface
Line Loop(1) = {1, 2, 3, 4};
Plane Surface(1) = {1};

// Physical groups (maps to Elmer boundary & body IDs)
Physical Surface(1) = {1};
Physical Line(1) = {1}; // Bottom
Physical Line(2) = {2}; // RightElectrode
Physical Line(3) = {3}; // Top
Physical Line(4) = {4}; // LeftElectrode

