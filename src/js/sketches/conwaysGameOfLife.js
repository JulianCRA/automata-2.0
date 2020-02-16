import Grid from './Grid'

const conwaysGameOfLife =( p ) => {
    let grid
    let gridWidth
    let gridHeight
    
    let size
    let cellWidth
	let cellHeight
	let canvas

    let seed
    let toroidal

    p.preload = () => {}
    p.setup = () => {
        canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		canvas.mouseClicked(killOrRevive)
        p.frameRate(12)
        p.pixelDensity(1)
        p.noStroke()
    }

    p.windowResized = () => {
        p.customRedraw({
            toroidal: toroidal,
            seed: seed,
            size: size,
        })
    }
    
    p.customRedraw = (config = {}) => {
        seed = config.seed || 10
        toroidal = config.toroidal && true
        size = config.size || 50
        
        const nw = Math.ceil(p._userNode.clientWidth / size)*size
        const nh = Math.ceil(p._userNode.clientHeight / size)*size
        
        p.resizeCanvas(nw, nh, true)
        
        cellWidth = size
        cellHeight = size
        gridWidth = Math.ceil(p._userNode.clientWidth / size)
        gridHeight = Math.ceil(p._userNode.clientHeight / size)

        grid = new Grid(gridWidth, gridHeight, 1, 1)
        
        if(seed.constructor === Array){
            for(let i = 0; i < seed.length; i++)
                grid.current[seed[i].x][seed[i].y] = 0
        }else{
            grid.shuffle( seed / 100 * gridWidth * gridHeight, 0)
        }
    }

    p.draw  = () => {
        p.clear()
        for (let i = 0; i < gridWidth; i++){
            for (let j = 0; j < gridHeight; j++){
                evaluateCell(i, j)
                if(!grid.deadCellIn(i, j)){
                    p.fill(255 - grid.current[i][j] * 255)
                    p.rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight, cellWidth*0.4, cellWidth*0.4, cellWidth*0.4, cellWidth*0.4)
                }
            }
        }
        grid.iterateAll()
    }
    
    const evaluateCell = (xpos, ypos) => {
        let nh = grid.getNeighborhood(xpos, ypos, 1, toroidal) // Moore neighborhood with Tchebychev distance of 1
        let aliveNeighbors = nh.neighbors.length
            
        if(grid.current[xpos][ypos] === 0){          // if the cell is alive
            /*if(aliveNeighbors < 2){                 // kill it due to "extinction"
                grid.next[xpos][ypos] = 1      
            }
            else if(aliveNeighbors >= 2 && aliveNeighbors <= 3){
                grid.next[xpos][ypos] = 0
            }
            else if(aliveNeighbors > 3){            // kill it due to "starvation"
                grid.next[xpos][ypos] = 1   
            }*/
            if(aliveNeighbors < 2 || aliveNeighbors > 3) grid.next[xpos][ypos] = 1;
        }else{                                      // if the cell is dead
            if(aliveNeighbors === 3){
                grid.next[xpos][ypos] = 0       // revive it
            }
        }
        
	}
	
	const killOrRevive = () => {
        const xpos = Math.floor(p.mouseX/cellWidth)
        const ypos = Math.floor(p.mouseY/cellHeight)
		const newValue = Math.abs(grid.current[xpos][ypos] - 1)
		grid.current[xpos][ypos] = newValue
	}
}

export default conwaysGameOfLife