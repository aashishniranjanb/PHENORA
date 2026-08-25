// PHENORA 2D MESH CONVERGENCE
L = 20e-3;
H = 10e-3;
lc = 2.500000e-04;

Point(1) = {0, 0, 0, lc};
Point(2) = {L, 0, 0, lc};
Point(3) = {L, H, 0, lc};
Point(4) = {0, H, 0, lc};

Line(1) = {1, 2};
Line(2) = {2, 3};
Line(3) = {3, 4};
Line(4) = {4, 1};

Line Loop(1) = {1, 2, 3, 4};
Plane Surface(1) = {1};

Physical Surface(1) = {1};
Physical Line(1) = {1};
Physical Line(2) = {2};
Physical Line(3) = {3};
Physical Line(4) = {4};
