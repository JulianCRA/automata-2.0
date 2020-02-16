import Grid from './Grid';

const diffusionLimitedAggregation = p => {
    let gridWidth
    let gridHeight
    let substeps
    let size
    let canvas

    let q
    let k1
    let k2
    let toroidal

    let grid
    let mobilityTable
    let mobileCells
    let sampledImg

    p.preload = () => {}
    p.setup = () => {
        canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
        canvas.mouseClicked(immobilize)
        p.noStroke()
        p.noSmooth()
    }

    p.windowResized = () => {
        p.customRedraw({
            toroidal: toroidal,
            size: size,
            q: q,
            k1: k1,
            k2: k2
        })
    }

    p.customRedraw = (config = {}) => {
        toroidal = config.toroidal && true
        size = config.size || 5
        q = config.states || 1
        k1 = config.mobileCellsAmount || 15
        k2 = config.seedCellsAmount || 0

        const nw = Math.ceil(p._userNode.clientWidth / size) * size
        const nh = Math.ceil(p._userNode.clientHeight / size) * size
        p.resizeCanvas(nw, nh, true)
        gridWidth = Math.ceil(p._userNode.clientWidth / size)
        gridHeight = Math.ceil(p._userNode.clientHeight / size)
        
        substeps = gridWidth * gridHeight
        mobileCells = Math.floor(substeps * k1 / 100)
        
        mobilityTable = new Array(gridWidth)
        for(let i = 0; i < gridWidth; i++){
            mobilityTable[i] = new Array(gridHeight)
        }

        grid = new Grid(gridWidth, gridHeight)

        let seedCells = grid.shuffle(k2, q)
        for(let i = 0; i < seedCells.length; i++){
            mobilityTable[seedCells[i].x][seedCells[i].y] = false
        }

        let otherCells = grid.shuffle(mobileCells, 0, q)
        for(let i = 0; i < otherCells.length; i++){
            mobilityTable[otherCells[i].x][otherCells[i].y] = true
        }
        
        initSampler()
        if(canvas) p.loop()
    }

    const initSampler = (baseColor = [255, 255, 255]) => {
		if(sampledImg) sampledImg = null

		sampledImg = p.createImage(gridWidth, gridHeight)
		sampledImg.loadPixels()
		let pixpos
		for(let i = 0; i < gridWidth; i++){
			for(let j = 0; j < gridHeight; j++){
				pixpos = (j * gridWidth + i) * 4
				sampledImg.pixels[pixpos] = baseColor[0]
				sampledImg.pixels[pixpos+1] = baseColor[1]
				sampledImg.pixels[pixpos+2] = baseColor[2]
				sampledImg.pixels[pixpos+3] = 0
			}
		}
    }
    
    let randX
    let randY
    
	
	p.draw = function(){
		p.clear()
	
		for(let i = 0; i < substeps; i++){
			randX = Math.floor( Math.random() * gridWidth)
			randY = Math.floor( Math.random() * gridHeight)
			evaluateCell(randX, randY)
		}
        
        for(let i = 0; i < gridWidth; i++){
			for(let j = 0; j < gridHeight; j++){
                if(grid.existsCellIn(i, j)){
                    if(grid.current[i][j] === q){
                        sampledImg.pixels[((j*gridWidth+i)*4)+3] = 255
                    }else{
                        sampledImg.pixels[((j*gridWidth+i)*4)+3] = 64
                    }
                }else{
                    sampledImg.pixels[((j*gridWidth+i)*4)+3] = 0
                }
			}
		}
		sampledImg.updatePixels()
		
        p.image(sampledImg, 0, 0, p.width, p.height)

        if(mobileCells <= 0) {
            p.noLoop()
        }
    }

    const evaluateCell = (xpos, ypos) => {
        
        if(mobilityTable[xpos][ypos] === true){
            let n = grid.getNeighborhood(xpos, ypos, 1, toroidal)
            let hasFixedNeighbor = false
            for(let i = 0; i < n.neighborhood.length; i++){
                if(mobilityTable[n.neighborhood[i].x][n.neighborhood[i].y] === false){
                    hasFixedNeighbor = true
                    break
                }
            }

            if(hasFixedNeighbor){
                grid.current[xpos][ypos] = q
                mobilityTable[xpos][ypos] = false
                mobileCells--
            }
            else{
                if(n.hasEmptySpaces){
                    let newPos = n.emptySpaces[Math.floor(Math.random() * n.emptySpaces.length)]
                    grid.current[newPos.x][newPos.y] = grid.current[xpos][ypos]
                    mobilityTable[newPos.x][newPos.y] = true
                    grid.current[xpos][ypos] = -1
                    mobilityTable[xpos][ypos] = undefined
                }
            }
        }
    }

    const immobilize = () => { 
        let xpos = Math.floor(p.mouseX/(p.width/gridWidth))
        let ypos = Math.floor(p.mouseY/(p.height/gridHeight))
        if(mobilityTable[xpos][ypos]) mobileCells--
        grid.current[xpos][ypos] = q
        mobilityTable[xpos][ypos] = false
    }
}

export default diffusionLimitedAggregation