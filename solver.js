class Solver {
    constructor(cube) {
        this.cube = cube;
        this.solution = [];
        this.edgePositions = [
            [1, 46], [3, 37], [5, 10], [7, 19], // U face
            [21, 39], [23, 12], [48, 41], [50, 14], // Middle layer
            [28, 43], [30, 49], [32, 25], [34, 16]  // D face
        ];
        this.cornerPositions = [
            [0, 47, 38], [2, 11, 45], [6, 20, 9], [8, 36, 18], // U face
            [27, 24, 44], [29, 15, 26], [33, 53, 17], [35, 42, 51]  // D face
        ];
    }

    applyMove(move) {
        this.cube.rotate(move);
        this.solution.push(move);
    }
    
    // A simplified solve method
    solve() {
        this.solveWhiteCross();
        this.solveFirstLayerCorners();
        this.solveSecondLayer();
        this.solveYellowCross();
        this.alignYellowCross();
        this.positionYellowCorners();
        this.orientYellowCorners();
        return this.solution;
    }

    solveWhiteCross() {
        this.solution.push('--- Solving White Cross ---');
        this.solveEdge('w', 'g');
        this.solveEdge('w', 'r');
        this.solveEdge('w', 'b');
        this.solveEdge('w', 'o');
    }
    
    solveEdge(color1, color2) {
        const moves = {
            'g': { face: 'F', right: 'R', left: 'L' },
            'r': { face: 'R', right: 'B', left: 'F' },
            'b': { face: 'B', right: 'L', left: 'R' },
            'o': { face: 'L', right: 'F', left: 'B' }
        };
        const m = moves[color2];

        for (let i = 0; i < 10; i++) { // Safety break
            if (this.isEdgeSolved(color1, color2)) break;

            let edge = this.findEdge(color1, color2);

            // Bring to top layer
            if (this.isEdgeInMiddleLayer(edge)) {
                if (edge.indices.includes(21)) this.applyMove('L');
                else if (edge.indices.includes(23)) this.applyMove('F');
                else if (edge.indices.includes(48)) this.applyMove("L'");
                else if (edge.indices.includes(50)) this.applyMove("B'");
                continue;
            } else if (this.isEdgeInBottomLayer(edge) && !this.isEdgeSolved(color1, color2)) {
                this.applyMove(m.face);
                continue;
            }

            // Align on top
            edge = this.findEdge(color1, color2);
            while (this.cube.state[edge.indices[1]] !== color2) {
                this.applyMove('U');
                edge = this.findEdge(color1, color2);
            }

            // Insert from top
            edge = this.findEdge(color1, color2);
            if (edge.c1 === 'w') {
                this.applyMove(m.face);
                this.applyMove(m.face);
            } else {
                this.applyMove("U'");
                this.applyMove(m.right + "'");
                this.applyMove(m.face);
                this.applyMove(m.right);
            }
        }
    }
    
    isEdgeSolved(color1, color2) {
        const s = this.cube.state;
        const solvedPos = {
            'g': { w: 34, c: 25 },
            'r': { w: 32, c: 16 },
            'b': { w: 30, c: 52 },
            'o': { w: 28, c: 43 }
        };
        const pos = solvedPos[color2];
        return s[pos.w] === color1 && s[pos.c] === color2;
    }

    isEdgeInTopLayer(edge) {
        const topEdges = ["1,46", "3,37", "5,10", "7,19"];
        return topEdges.includes(edge.indices.toString());
    }
    isEdgeInMiddleLayer(edge) {
        const middleEdges = ["21,39", "23,12", "48,41", "50,14"];
        return middleEdges.includes(edge.indices.toString());
    }
    isEdgeInBottomLayer(edge) {
        const bottomEdges = ["28,43", "30,49", "32,25", "34,16"];
        return bottomEdges.includes(edge.indices.toString());
    }

    findEdge(color1, color2) {
        const state = this.cube.state;
        for (const indices of this.edgePositions) {
            const c1 = state[indices[0]];
            const c2 = state[indices[1]];
            if ((c1 === color1 && c2 === color2) || (c1 === color2 && c2 === color1)) {
                return {
                    indices: indices,
                    c1: c1,
                    c2: c2
                };
            }
        }
        return null;
    }

    solveFirstLayerCorners() {
        this.solution.push('--- Solving First Layer Corners ---');
        this.solveCorner('w', 'g', 'r');
        this.solveCorner('w', 'r', 'b');
        this.solveCorner('w', 'b', 'o');
        this.solveCorner('w', 'o', 'g');
    }

    solveCorner(c1, c2, c3) {
        const targetKey = [c1, c2, c3].sort().join('');
        const pos = {
            'grw': { uFacePos: 8, right: 'R', down: 'D' }, // URF
            'brw': { uFacePos: 6, right: 'F', down: 'D' }, // UFL
            'bow': { uFacePos: 2, right: 'B', down: 'D' }, // UBR
            'gow': { uFacePos: 0, right: 'L', down: 'D' }  // ULB
        };
        const m = pos[targetKey];

        for (let i = 0; i < 20; i++) {
            if (this.isCornerSolved(c1, c2, c3)) break;
            
            let corner = this.findCorner(c1,c2,c3);
            if (corner.indices.some(p => p < 27)) { // on top layer
                // move over target slot
                while(this.findCorner(c1, c2, c3).indices[0] !== m.uFacePos) {
                    this.applyMove('U');
                }
                // then insert
                this.applyMove(m.right);
                this.applyMove('U');
                this.applyMove(m.right + "'");
                this.applyMove("U'");
            } else { // on bottom layer
                // bring to top
                const r = {27: 'L', 29: 'F', 35: 'R', 33: 'B'}[corner.indices[0]];
                this.applyMove(r + "'");
                this.applyMove("U'");
                this.applyMove(r);
            }
        }
    }

    findCorner(c1, c2, c3) {
        const state = this.cube.state;
        for (const indices of this.cornerPositions) {
            const colors = indices.map(i => state[i]);
            if (colors.includes(c1) && colors.includes(c2) && colors.includes(c3)) {
                return {
                    indices: indices,
                    colors: colors
                };
            }
        }
        return null;
    }

    isCornerSolved(c1, c2, c3) {
        const s = this.cube.state;
        const solvedStates = {
            'grw': { p: [29, 18, 11], c: ['w', 'g', 'r'] }, // DFR
            'brw': { p: [35, 11, 47], c: ['w', 'r', 'b'] }, // DRB
            'bow': { p: [33, 47, 44], c: ['w', 'b', 'o'] }, // DBL
            'gow': { p: [27, 44, 18], c: ['w', 'o', 'g'] }  // DLF
        };
        const key = [c1,c2,c3].sort().join('');
        const target = solvedStates[key];
        if (!target) return false;
        
        return target.p.every((pos, i) => s[pos] === target.c[i]);
    }

    solveSecondLayer() {
        this.solution.push('--- Solving Second Layer ---');
        this.solveMiddleEdge('g', 'r');
        this.solveMiddleEdge('r', 'b');
        this.solveMiddleEdge('b', 'o');
        this.solveMiddleEdge('o', 'g');
    }

    solveMiddleEdge(c1, c2) {
        const algs = {
            'gr': { right: "U R U' R' U' F' U F", left: "U' L' U L U F U' F'" },
            'rb': { right: "U B U' B' U' R' U R", left: "U' F' U F U R U' R'" },
            'bo': { right: "U L U' L' U' B' U B", left: "U' R' U R U B U' B'" },
            'og': { right: "U F U' F' U' L' U L", left: "U' B' U B U L U' L'" }
        };
        const key = [c1, c2].sort().join('');
        const targetAlgs = algs[key];

        for (let i = 0; i < 10; i++) {
            if (this.isMiddleEdgeSolved(c1, c2)) break;
            let edge = this.findEdge(c1, c2);

            if(this.isEdgeInMiddleLayer(edge)){
                // It's in the wrong slot, pop it out to the top
                const moves = { 12:"U R U' R' U' F' U F", 14:"U B U' B' U' R' U R", 41:"U L U' L' U' B' U B", 39:"U F U' F' U' L' U L" };
                this.applyMoveSequence(moves[edge.indices[1]]);
                continue;
            }
            
            // Align edge on top layer
            while(this.cube.state[edge.indices[1]] !== this.cube.state[this.getCenterOfFace(edge.indices[1])]) {
                this.applyMove('U');
                edge = this.findEdge(c1, c2);
            }

            // Insert it
            if(this.cube.state[edge.indices[0]] === this.cube.state[this.getCenterOfFace(c1)]) {
                 this.applyMoveSequence(targetAlgs.right);
            } else {
                 this.applyMoveSequence(targetAlgs.left);
            }
        }
    }

    isMiddleEdgeSolved(c1, c2) {
        const s = this.cube.state;
        const solvedStates = {
            'gr': {p: [23, 12], c: ['g', 'r']},
            'br': {p: [50, 14], c: ['b', 'r']},
            'bo': {p: [48, 41], c: ['b', 'o']},
            'go': {p: [21, 39], c: ['g', 'o']}
        };
        const key = [c1, c2].sort().join('');
        const target = solvedStates[key];
        if (!target) return false;
        return s[target.p[0]] === target.c[0] && s[target.p[1]] === target.c[1];
    }

    applyMoveSequence(sequence) {
        sequence.split(' ').forEach(move => this.applyMove(move));
    }

    solveYellowCross() {
        this.solution.push('--- Solving Yellow Cross ---');
        const y = 'y';
        const s = () => this.cube.state;
        const alg = "F R U R' U' F'";
        
        while(s()[1]!==y || s()[3]!==y || s()[5]!==y || s()[7]!==y) {
            if((s()[1]===y && s()[7]===y) || (s()[3]===y && s()[5]===y)) { // Line
                 this.applyMoveSequence(alg);
            } else if (s()[3]===y && s()[7]===y) { // L-shape
                 this.applyMoveSequence(alg);
            } else { // Dot or other cases
                 this.applyMoveSequence(alg);
            }
        }
    }

    alignYellowCross() {
        this.solution.push('--- Aligning Yellow Cross ---');
        const alg = "R U R' U R U U R'";
        while(!this.isYellowCrossAligned()){
            if(this.cube.state[19] === this.cube.state[22]) {
                 this.applyMove('U');
            } else {
                this.applyMoveSequence(alg);
            }
        }
    }

    positionYellowCorners() {
        this.solution.push('--- Positioning Yellow Corners ---');
        const alg = "U R U' L' U R' U' L";
        while(!this.areYellowCornersPositioned()){
            this.applyMoveSequence(alg);
        }
    }

    orientYellowCorners() {
        this.solution.push('--- Orienting Yellow Corners ---');
        const alg = "R' D' R D";
        while(this.cube.state[27]!=='w' || this.cube.state[29]!=='w' || this.cube.state[33]!=='w' || this.cube.state[35]!=='w') {
             this.applyMoveSequence(alg);
        }
    }
    
    // New Helper Methods
    getCenterOfFace(stickerIndex) {
        if(stickerIndex >= 9 && stickerIndex < 18) return 13; // R
        if(stickerIndex >= 18 && stickerIndex < 27) return 22; // F
        if(stickerIndex >= 36 && stickerIndex < 45) return 40; // L
        if(stickerIndex >= 45 && stickerIndex < 54) return 49; // B
        return 4; // U
    }
    isYellowCrossAligned() {
        // Check if the yellow cross edges are aligned with their centers
        const s = this.cube.state;
        // F, R, B, L centers: 22, 13, 49, 40
        // F edge: 19, R edge: 10, B edge: 46, L edge: 37
        return (
            s[19] === s[22] &&
            s[10] === s[13] &&
            s[46] === s[49] &&
            s[37] === s[40]
        );
    }
    areYellowCornersPositioned() {
        // Check if all yellow corners are in the correct position (not necessarily oriented)
        // Corners: UFR(2), URB(5), UBL(0), ULF(8)
        // Their correct colors should match the centers of the adjacent faces
        const s = this.cube.state;
        // U face center: 4, F: 22, R: 13, B: 49, L: 40
        // UFR: 2 (U), 11 (R), 20 (F)
        // URB: 5 (U), 17 (R), 47 (B)
        // UBL: 0 (U), 38 (L), 45 (B)
        // ULF: 8 (U), 18 (F), 36 (L)
        return (
            [
                [2, 11, 20, 4, 13, 22],   // UFR: U, R, F
                [5, 17, 47, 4, 13, 49],   // URB: U, R, B
                [0, 38, 45, 4, 40, 49],   // UBL: U, L, B
                [8, 18, 36, 4, 22, 40]    // ULF: U, F, L
            ].every(([a, b, c, uc, rc, fc]) => {
                const colors = [s[a], s[b], s[c]];
                return colors.includes(s[uc]) && colors.includes(s[rc]) && colors.includes(s[fc]);
            })
        );
    }
} 