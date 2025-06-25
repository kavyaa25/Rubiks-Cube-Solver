🎯 Overview
This web application provides an interactive Rubik's Cube solver with real-time visualization. It implements a layer-by-layer solving algorithm, allowing users to scramble the cube, manually rotate faces, and watch the solver break down each step with animated moves.

Built with pure JavaScript, it features:
✅ SVG-based rendering for smooth visualization
✅ Complete solving algorithm (white cross → first layer → second layer → OLL → PLL)
✅ Scramble generator for randomized cubes
✅ Responsive design (works on mobile & desktop)

🚀 Features
1. Interactive Cube Visualization
Real-time SVG rendering of the cube state

Color-coded stickers for easy tracking

Smooth transitions between moves

2. Smart Solver Algorithm
Solves the cube in 7 stages:

White Cross (Daisy method)

First Layer Corners

Second Layer Edges

Yellow Cross (OLL)

Yellow Edge Alignment

Positioning Yellow Corners (PLL)

Orienting Yellow Corners

3. User Controls
Scramble – Randomly shuffles the cube

Solve – Runs the solver step-by-step

Manual Rotation – U, D, L, R, F, B (with prime moves)

4. Solution Breakdown
Displays each move with a visual cube state

Clear, readable algorithm steps

🛠️ How It Works
Cube Representation
The cube is stored as a 54-character string (6 faces × 9 stickers).

Each face is mapped to positions:

U (Up), D (Down), L (Left), R (Right), F (Front), B (Back)

Solving Logic
The Solver class implements a beginner-friendly method:

Edges first, then corners

Uses standard algorithms (e.g., F R U R' U' F' for the yellow cross)

Detects cube state to apply optimal moves

Rendering Engine
SVG-based (no external libraries)

Dynamically updates the cube after each move

📥 Installation & Usage
Quick Start (Browser)
Clone the repo:

bash
git clone https://github.com/yourusername/rubiks-cube-solver.git
Open index.html in any browser.

Controls
Button	Action
Scramble	Randomizes the cube
Solve	Runs the solver
U, D, L, R, F, B	Rotate faces clockwise
U', D', L', R', F', B'	Rotate faces counter-clockwise
🔍 Technical Details
File Structure
text
rubiks-cube-solver/  
├── index.html          # Main HTML structure  
├── style.css           # Responsive styling  
├── script.js           # Cube logic & rendering  
└── solver.js           # Solving algorithm  
Dependencies
None! Pure vanilla JS + CSS.

Algorithms Used
Step	Algorithm
White Cross	Daisy method + edge insertion
First Layer	Corner positioning with R U R' U'
Second Layer	Edge insertion (U R U' R' U' F' U F)
OLL	Yellow cross formation
PLL	Corner & edge permutation
