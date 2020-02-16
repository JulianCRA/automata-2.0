import Grid from './Grid';

const belousovZhabotinskysReaction = p => {
    let grid
    let gridWidth
    let gridHeight

    let size

    let toroidal
    let distance
    let seed
    let states
    let k1
    let k2
    let g

    let sampledImg
    let colorDiff

    p.preload = () => {}
    p.setup = () => {
        p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		p.noStroke()
        p.noSmooth()
    }

    p.windowResized = () => {
        p.customRedraw({
            toroidal: toroidal,
            distance: distance,
            size: size,
            states: states,
            k1: k1,
            k2: k2,
            g: g,
            seed: seed,
        })
    }
    
    p.customRedraw = (config = {}) => {
        toroidal = config.toroidal && true
        distance = config.distance || 2
        
        states = config.states || 32
        k1 = config.k1 || 4
        k2 = config.k2 || 1
        g = config.g || 10

        colorDiff = 255 / states
        seed = config.seed || 4
        size = config.size || 50
        
        const nw = Math.ceil(p._userNode.clientWidth / size) * size
        const nh = Math.ceil(p._userNode.clientHeight / size) * size
        
        p.resizeCanvas(nw, nh, true)
        
        gridWidth = Math.ceil(p._userNode.clientWidth / size)
        gridHeight = Math.ceil(p._userNode.clientHeight / size)

        grid = new Grid(gridWidth, gridHeight, 0)
        grid.shuffle(seed/1, states)
        
        initSampler()
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
				sampledImg.pixels[pixpos+3] = 0;
			}
		}
	}

    p.draw = () => {
        p.clear();
        
        grid.iterateAll();
        for(let i = 0; i < gridWidth; i++){
            for(let j = 0; j < gridHeight; j++){
                evaluateCell(i, j)
                sampledImg.pixels[((j*gridWidth+i)*4)+3] = grid.current[i][j]*colorDiff
            }
        }
        sampledImg.updatePixels()
		p.image(sampledImg, 0, 0, p.width, p.height)
    }

    const evaluateCell = (xpos, ypos) => {
        let results = grid.getNeighborhood(xpos, ypos, distance, toroidal)   // Moore neighborhood with Tchebychev $distance
        let infected = 0
        let ill = 0
        let sum = 0
        let newState

        for(let i = 0; i < results.neighbors.length; i++){
            if(results.neighbors[i].state === states){
                ill++
            }
            else if(results.neighbors[i].state > 0 && results.neighbors[i].state < states){
                infected++
            }
            sum += results.neighbors[i].state
        }

        if(grid.current[xpos][ypos] > 0 && grid.current[xpos][ypos] < states){ // if the cell is "infected"
            newState = Math.floor(sum/(infected + ill + 1)) + g
        }
        else if(grid.current[xpos][ypos] === states){                       // if the cell is "ill"
            newState = 0
        }
        else if(grid.current[xpos][ypos] === 0){                            // if the cell is "healthy"
            newState = Math.floor(infected/k1) + Math.floor(ill/k2)
        }
        
        if(newState > states) newState = states
        grid.next[xpos][ypos] = newState
    }
}

export default belousovZhabotinskysReaction