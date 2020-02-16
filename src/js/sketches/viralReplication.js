import Grid from './Grid'

const viralReplication = p => {
	let grid
	let gridWidth		// Number of 'cells' per row.
	let gridHeight		// Number of rows in the grid.
	let size
	let states			// Number of states that the cells can have. (q)
	let infectionRate	// Infection rate. (k1)
	let baseRate		// Base rate. (k2)
	let divisionChance				// Reproduction rate. (k3)
	let toroidal

	let substeps
	let colorDiff
	let sampledImg

	p.preload = () => {}
    p.setup = () => {
        p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
		p.noStroke()
		p.noSmooth()
	}

	p.windowResized = () => {
        p.customRedraw({
            states: states,
			infectionRate: infectionRate * 100,
			baseRate: baseRate * 100,
			divisionChance: divisionChance * 100,
			toroidal: toroidal,
            size: size,
        })
    }

	p.customRedraw = (config = {}) => {
        infectionRate = config.infectionRate / 100 || 55 / 100
		baseRate = config.baseRate / 100 || 7 / 100
		divisionChance = config.divisionChance / 100 || 35 / 100
		states = config.states || 50
		toroidal = config.toroidal && true
		size = config.size || 50
		
		colorDiff = 255/(states-1)

		const nw = Math.ceil(p._userNode.clientWidth / size) * size
        const nh = Math.ceil(p._userNode.clientHeight / size) * size
        p.resizeCanvas(nw, nh, true)
        gridWidth = Math.ceil(p._userNode.clientWidth / size)
        gridHeight = Math.ceil(p._userNode.clientHeight / size)

		substeps = gridWidth * gridHeight
		grid = new Grid(gridWidth, gridHeight)
		grid.shuffle(substeps/2, states - 1)
		
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
		grid.iterateAll()

		for(let i = 0; i < gridWidth; i++){
			for(let j = 0; j < gridHeight; j++){
				sampledImg.pixels[((j*gridWidth+i)*4)+3] = grid.current[i][j]*colorDiff
			}
		}
		sampledImg.updatePixels()
		
		p.image(sampledImg, 0, 0, p.width, p.height)
	}

	const evaluateCell = (xpos, ypos) => {
		let neighborhood
		
		if(grid.existsCellIn(xpos, ypos)){						// Is there a cell?
			if(grid.current[xpos][ypos] === states-1){				// Is it healthy?
				if(Math.random() < baseRate){                  		// Should it get infected?
					grid.next[xpos][ypos]--
				}
				else{											// No? Should it 'divide'?
					neighborhood = grid.getNeighborhood(xpos, ypos, 1, toroidal)   // Moore neighbprhood with Tchebychev distance of 1
					if(neighborhood.hasEmptySpaces && Math.random() < divisionChance){   // Yeah, divide it.
						let newBorn = neighborhood.emptySpaces[Math.floor(Math.random() * neighborhood.emptySpaces.length)]
						grid.next[newBorn.x][newBorn.y] = states-1
					}
				}
			}
			else{												// Not healthy, huh?
				if(grid.current[xpos][ypos] === 0){				// Last stage of infection?
					grid.removeCellAt(xpos,ypos)
					neighborhood = grid.getNeighborhood(xpos, ypos, 1, toroidal)   // Moore neighbprhood with Tchebychev distance of 1
					if(neighborhood.hasNeighbors){
						for(let i = 0; i < neighborhood.neighbors.length; i++){
							if( grid.next[neighborhood.neighbors[i].x][neighborhood.neighbors[i].y] > 0  && Math.random()<infectionRate)
								grid.next[neighborhood.neighbors[i].x][neighborhood.neighbors[i].y]--
						}
					}
				} else{											// Already infected?
					grid.next[xpos][ypos] = grid.current[xpos][ypos] - 1
				}
			}
		} 
	}
}

export default viralReplication