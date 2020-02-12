import Grid from './Grid';

const forestFire = ( p ) => {
    const _EMPTY = 0;
    const _BURNING = 1;
    const _TREE = 2;
    const _BURNT = 3;

    let gridWidth;
    let gridHeight;
    let cellWidth;
    let cellHeight;

    let autocombustion;
    let combustion;         // spontaneous combustion probablilty
    let resistance;         // fire resitance
    let germination;        // tree germination probability
    let recovery;           // soil recovery rate
	let toroidal;           // toroidal plane?

    let canvas;
    let grid;
    let deadtime;

    let hasStarted;

    p.preload = function(){
        if(!hasStarted) p.customRedraw();
    }
    
    p.setup = function() {
        canvas = p.createCanvas(Math.min(p._userNode.clientWidth, p._userNode.clientHeight), Math.min(p._userNode.clientWidth, p._userNode.clientHeight))
        canvas.mouseClicked(p.lightningStrike);
        p.noStroke();
        p.pixelDensity(1);
		p.background('forestgreen')
    }

    p.customRedraw = function(config = {}){
        hasStarted = true;
        
        if(canvas) p.background('forestgreen');
        gridWidth = config.width || 200;
		gridHeight = config.height || 200;
        cellWidth = p.width / gridWidth
        cellHeight = p.height / gridHeight

        autocombustion = config.autoCombustion && true;
        combustion = config.combustionProbabilty/100 || 0.000001;
        resistance = config.resistance/100 || 0;
        germination = config.germination/100 || 0;
        recovery = config.soilRecovery/100 || 0;
        toroidal = config.toroidal && true;

        deadtime = new Array(gridWidth);
        for(let i = 0; i < deadtime.length; i++){
            deadtime[i] = new Array(gridHeight);
        }

        grid = new Grid(gridWidth, gridHeight, _TREE);
    }

    p.draw = function(){
        for (let i = 0; i < gridWidth; i++){
            for (let j = 0; j < gridHeight; j++){
                
                p.evaluateCell(i, j);
                if(grid.cellChangedState(i, j)){
                    switch(grid.next[i][j]){
                        case _BURNING:
                            p.fill("orangered");
                            break;
                        case _EMPTY:
                            p.fill("saddlebrown");
                            break;
                        case _TREE:
                            p.fill("forestgreen");
                            break;
                        case _BURNT:
                            p.fill("black");
                            break;
                        default:
                            break;
                    }
                    p.rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight);
                }
            }
        }
        grid.iterateAll();
    }

    p.lightningStrike = function(){
        const xpos = Math.floor(p.mouseX/cellWidth);
        const ypos = Math.floor(p.mouseY/cellHeight);
        grid.next[xpos][ypos] = _BURNING;
        grid.iterate(xpos, ypos);
    }

    p.evaluateCell = function(xpos, ypos){
        if(grid.current[xpos][ypos] === _TREE){
            if(Math.random() > resistance){             // "Roll" for fire resistance
                if(toroidal){                           // check toroidal neighborhood
                    if( grid.current[xpos][ypos-1 > 0? ypos-1:gridHeight-1] === _BURNING ||
                        grid.current[xpos-1 > 0? xpos-1:gridWidth-1][ypos] === _BURNING ||
                        grid.current[xpos+1 > gridWidth-1? 0:xpos+1][ypos] === _BURNING ||
                        grid.current[xpos][ypos+1 > gridHeight-1? 0:ypos+1] === _BURNING ){
                            grid.next[xpos][ypos] = _BURNING;
                    }
                }else{                                  // check planar neighborhood
                    if( grid.current[xpos][ypos-1 > 0? ypos-1:ypos] === _BURNING ||
                        grid.current[xpos-1 > 0? xpos-1:xpos][ypos] === _BURNING ||
                        grid.current[xpos+1 > gridWidth-1? gridWidth-1:xpos+1][ypos] === _BURNING ||
                        grid.current[xpos][ypos+1 > gridHeight-1? gridHeight-1:ypos+1] === _BURNING ){
                            grid.next[xpos][ypos] = _BURNING;
                    }
                }
            }else if( autocombustion && (Math.random() < (combustion/(gridWidth*gridHeight))) ){
				grid.next[xpos][ypos] = _BURNING
            }
        }
        else if(grid.current[xpos][ypos] === _BURNING){
            grid.next[xpos][ypos] = _BURNT;
            deadtime[xpos][ypos] = 0;
        }
        else if(grid.current[xpos][ypos] === _BURNT){		
			deadtime[xpos][ypos] += 1/p.frameRate()
			if(deadtime[xpos][ypos] > recovery)
				grid.next[xpos][ypos] = _EMPTY
        }
        else if(grid.current[xpos][ypos] === _EMPTY && (Math.random() < germination)){// "Roll" for germination
            grid.next[xpos][ypos] = _TREE;
        }
    }
}

export default forestFire