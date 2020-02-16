import Grid from './Grid'

const langtonsAnt = p => {
    const _ROTATE_LEFT = -1
    const _ROTATE_RIGHT = 1

    let ants
  
    let gridWidth
    let gridHeight
    let cellWidth
    let cellHeight
    let size
    
    let grid  
    let canvas
    
    p.preload = () => {}
    p.setup = () => {
        canvas = p.createCanvas(p._userNode.clientWidth, p._userNode.clientHeight)
        canvas.mouseClicked(addAnt)
        p.noStroke()
    }

    p.windowResized = () => {
        p.customRedraw({
            ants: [],
            size: size,
        })
    }
    
    p.customRedraw = function(config = {}){
        if (canvas) p.clear()
        
        size = config.size || 30
        ants = config.ants || []

        const nw = Math.ceil(p._userNode.clientWidth / size) * size
        const nh = Math.ceil(p._userNode.clientHeight / size) * size
        p.resizeCanvas(nw, nh, true)
        cellWidth = size
        cellHeight = size
        gridWidth = Math.ceil(p._userNode.clientWidth / size)
        gridHeight = Math.ceil(p._userNode.clientHeight / size)

        grid = new Grid(gridWidth, gridHeight, 0)
    }
   
    p.draw = () => {
        for(let i = 0; i < ants.length; i++){
            drawAnt(ants[i])
        }
    }

    const moveAnt = ant => {
        grid.current[ant.x][ant.y] === 1 ? ant.direction += _ROTATE_RIGHT : ant.direction += _ROTATE_LEFT
        grid.current[ant.x][ant.y] = 1 - grid.current[ant.x][ant.y]
    
        let newDirection = Math.abs(ant.direction) % 4
        
        switch(newDirection){
            case 0:
                ant.x === 0 ? ant.x = gridWidth-1 : ant.x--
                break
            case 1:
                ant.y === 0 ? ant.y = gridHeight-1 : ant.y--
                break
            case 2:
                ant.x === gridWidth-1 ? ant.x = 0 : ant.x++
                break
            case 3:
                ant.y === gridHeight-1 ? ant.y = 0 : ant.y++
				break
			default:
				break
        }
    }

    const drawAnt = ant => {
        let i = ant.x
        let j = ant.y
        p.fill(grid.current[i][j] * 255)
        p.rect(i * cellWidth, j * cellHeight, cellWidth, cellHeight, cellWidth*0.3, cellWidth*0.3, cellWidth*0.3, cellWidth*0.3)
        moveAnt(ant)
	}
	
	const addAnt = () => {
        ants.push({x:Math.floor(p.mouseX/cellWidth), y:Math.floor(p.mouseY/cellHeight), direction:1})
	}
}

export default langtonsAnt