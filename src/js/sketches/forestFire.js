import Grid from './Grid';

const forestFire = p => {
    const _EMPTY = 0
    const _BURNING = 1
    const _TREE = 2
    const _BURNT = 3

    let gridWidth
    let gridHeight
    let cellWidth
    let cellHeight
    let size

    let autocombustion
    let combustion         // spontaneous combustion probablilty
    let resistance         // fire resitance
    let germination        // tree germination probability
    let recovery           // soil recovery rate
	let toroidal           // toroidal plane?

    let canvas
    let grid
    let deadtime

    p.preload = () => {}
    p.setup = () => {
        canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
        canvas.mouseClicked(lightningStrike)
        p.noStroke()
        //p.pixelDensity(1)
		p.background('forestgreen')
    }

    p.windowResized = () => {
        p.customRedraw({
            combustionProbabilty: combustion*100,
            resistance: resistance*100,
            autoCombustion: autocombustion,
            germination: germination*100,
            soilRecovery: recovery*100,
            toroidal: toroidal,
            size: size
        })
    }

    p.customRedraw = (config = {}) => {
        console.log("CUSTOM")
        size = config.size || 50
        autocombustion = config.autoCombustion && true
        combustion = config.combustionProbabilty/100 || 0.000001
        resistance = config.resistance/100 || 0
        germination = config.germination/100 || 0
        recovery = config.soilRecovery/100 || 0
        toroidal = config.toroidal && true

        const nw = Math.ceil(p._userNode.clientWidth / size) * size
        const nh = Math.ceil(p._userNode.clientHeight / size) * size
        
        p.resizeCanvas(nw, nh, true)

        cellWidth = size
        cellHeight = size
        gridWidth = Math.ceil(p._userNode.clientWidth / size)
        gridHeight = Math.ceil(p._userNode.clientHeight / size)

        deadtime = new Array(gridWidth);
        for(let i = 0; i < deadtime.length; i++){
            deadtime[i] = new Array(gridHeight)
        }

        grid = new Grid(gridWidth, gridHeight, _TREE)
        p.background('forestgreen')
    }

    p.draw = function(){
        for (let i = 0; i < gridWidth; i++){
            for (let j = 0; j < gridHeight; j++){
                evaluateCell(i, j)
                if(grid.cellChangedState(i, j)){
                    switch(grid.next[i][j]){
                        case _BURNING:
                            p.fill("orangered")
                            break
                        case _EMPTY:
                            p.fill("saddlebrown")
                            break
                        case _TREE:
                            p.fill("forestgreen")
                            break
                        case _BURNT:
                            p.fill("black")
                            break
                        default:
                            break
                    }
                    p.rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight)
                }
            }
        }
        grid.iterateAll()
    }

    const lightningStrike = () => {
        const xpos = Math.floor(p.mouseX/cellWidth);
        const ypos = Math.floor(p.mouseY/cellHeight);
        grid.next[xpos][ypos] = _BURNING;
        grid.iterate(xpos, ypos);
    }

    const evaluateCell = (xpos, ypos) => {
        if(grid.current[xpos][ypos] === _TREE){
            if(Math.random() > resistance){             // "Roll" for fire resistance
                if(toroidal){                           // check toroidal neighborhood
                    if( grid.current[xpos][ypos-1 > 0? ypos-1:gridHeight-1] === _BURNING ||
                        grid.current[xpos-1 > 0? xpos-1:gridWidth-1][ypos] === _BURNING ||
                        grid.current[xpos+1 > gridWidth-1? 0:xpos+1][ypos] === _BURNING ||
                        grid.current[xpos][ypos+1 > gridHeight-1? 0:ypos+1] === _BURNING ){
                            grid.next[xpos][ypos] = _BURNING
                    }
                }else{                                  // check planar neighborhood
                    if( grid.current[xpos][ypos-1 > 0? ypos-1:ypos] === _BURNING ||
                        grid.current[xpos-1 > 0? xpos-1:xpos][ypos] === _BURNING ||
                        grid.current[xpos+1 > gridWidth-1? gridWidth-1:xpos+1][ypos] === _BURNING ||
                        grid.current[xpos][ypos+1 > gridHeight-1? gridHeight-1:ypos+1] === _BURNING ){
                            grid.next[xpos][ypos] = _BURNING
                    }
                }
            }else if( autocombustion && (Math.random() < (combustion/(gridWidth*gridHeight))) ){
				grid.next[xpos][ypos] = _BURNING
            }
        }
        else if(grid.current[xpos][ypos] === _BURNING){
            grid.next[xpos][ypos] = _BURNT
            deadtime[xpos][ypos] = 0
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