import Grid from './Grid';

const diffusionLimitedAggregation = p => {
    let gridWidth;
    let gridHeight
    let substeps;

    let canvas;

    let q;
    let k1;
    let k2;
    let toroidal;

    let grid;
    let mobilityTable;
    let mobileCells;
    let sampledImg;

    let hasStarted;

    p.preload = function(){
        if(!hasStarted) p.customRedraw();
    }

    p.setup = function(){
        canvas = p.createCanvas(Math.min(p._userNode.clientWidth, p._userNode.clientHeight), Math.min(p._userNode.clientWidth, p._userNode.clientHeight))
        canvas.mouseClicked (p.immobilize);
        p.noStroke();
        p.pixelDensity(1);
        p.noSmooth();
    }

    p.customRedraw = function(config = {}){
        hasStarted = true;

        gridWidth = config.width || 200;
        gridHeight = config.height || 200;
        substeps = gridWidth * gridHeight;
        toroidal = config.toroidal && true;

        q = config.states || 1;
        k1 = config.mobileCellsAmount || 15;
        k2 = config.seedCellsAmount || 0;

        mobileCells = Math.floor(substeps * k1 / 100);

        mobilityTable = new Array(gridWidth);
        for(let i = 0; i < gridWidth; i++){
            mobilityTable[i] = new Array(gridHeight);
        }

        grid = new Grid(gridWidth, gridHeight);

        let seedCells = grid.shuffle(k2, q);
        for(let i = 0; i < seedCells.length; i++){
            mobilityTable[seedCells[i].x][seedCells[i].y] = false;
        }

        let otherCells = grid.shuffle(mobileCells, 0, q);
        for(let i = 0; i < otherCells.length; i++){
            mobilityTable[otherCells[i].x][otherCells[i].y] = true;
        }
        
        p.initSampler();
        if(canvas) p.loop();
    }

    p.initSampler = function(baseColor = [255, 255, 255]){
		if(sampledImg) sampledImg = null;

		sampledImg = p.createImage(gridWidth, gridHeight);
		sampledImg.loadPixels();
		let pixpos;
		for(let i = 0; i < gridWidth; i++){
			for(let j = 0; j < gridHeight; j++){
				pixpos = (j * gridWidth + i) * 4;
				sampledImg.pixels[pixpos] = baseColor[0];
				sampledImg.pixels[pixpos+1] = baseColor[1];
				sampledImg.pixels[pixpos+2] = baseColor[2];
				sampledImg.pixels[pixpos+3] = 0;
			}
		}
    }
    
    let randX;
    let randY;
    
	
	p.draw = function(){
		p.clear();
	
		for(let i = 0; i < substeps; i++){
			randX = Math.floor( Math.random() * gridWidth);
			randY = Math.floor( Math.random() * gridHeight);
			p.evaluateCell(randX, randY);
		}
        
        for(let i = 0; i < gridWidth; i++){
			for(let j = 0; j < gridHeight; j++){
                if(grid.existsCellIn(i, j)){
                    if(grid.current[i][j] === q){
                        sampledImg.pixels[((j*gridWidth+i)*4)+3] = 255;
                    }else{
                        sampledImg.pixels[((j*gridWidth+i)*4)+3] = 64;
                    }
                }else{
                    sampledImg.pixels[((j*gridWidth+i)*4)+3] = 0;
                }
			}
		}
		sampledImg.updatePixels();
		
        p.image(sampledImg, 0, 0, p.width, p.height);

        if(mobileCells <= 0) {
            p.noLoop();
        }
    }

    p.evaluateCell = function(xpos, ypos){
        
        if(mobilityTable[xpos][ypos] === true){
            let n = grid.getNeighborhood(xpos, ypos, 1, toroidal);
            let hasFixedNeighbor = false;
            for(let i = 0; i < n.neighborhood.length; i++){
                if(mobilityTable[n.neighborhood[i].x][n.neighborhood[i].y] === false){
                    hasFixedNeighbor = true;
                    break;
                }
            }

            if(hasFixedNeighbor){
                grid.current[xpos][ypos] = q;
                mobilityTable[xpos][ypos] = false;
                mobileCells--;
            }
            else{
                if(n.hasEmptySpaces){
                    let newPos = n.emptySpaces[Math.floor(Math.random() * n.emptySpaces.length)];
                    grid.current[newPos.x][newPos.y] = grid.current[xpos][ypos];
                    mobilityTable[newPos.x][newPos.y] = true;
                    grid.current[xpos][ypos] = -1;
                    mobilityTable[xpos][ypos] = undefined;
                }
            }
        }
    }

    p.immobilize = function(){
        
        let xpos = Math.floor(p.mouseX/(p.width/gridWidth));
        let ypos = Math.floor(p.mouseY/(p.height/gridHeight));
        if(mobilityTable[xpos][ypos]) mobileCells--;
        grid.current[xpos][ypos] = q;
        mobilityTable[xpos][ypos] = false;
    }
}

export default diffusionLimitedAggregation