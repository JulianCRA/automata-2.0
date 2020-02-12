export default class Grid{
    constructor(gwidth, gheight, state = -1, death = -1){
        this.width = gwidth;
        this.height = gheight;
        this.initialState = state;
        this.death = death;
        
        //this.current = new Array(this.width);
        this.current = [];
        //this.next = new Array(this.width);
        this.next = [];
        for(let i = 0; i < this.width; i++){
            this.current[i] = new Array(this.height);
            this.next[i] = new Array(this.height);
            for(let j = 0; j < this.height; j++){
                this.current[i][j] = this.initialState;
                this.next[i][j] = this.initialState;
            }
        }
    }

    shuffle(amount, state, protect = -2){
        //let cells = new Array();
        let cells = [];
        let randx;
        let randy;
        for(let i = 0; i < amount; i++){
            randx = Math.floor(Math.random()*(this.width));
            randy = Math.floor(Math.random()*(this.height));
            if(this.next[randx][randy] !== state && this.next[randx][randy] !== protect){
                this.next[randx][randy] = state;
                cells.push({x:randx, y:randy});
            }else{
                i--;
            }
        }
        this.iterateAll();
        return cells;
    }

    getNeighborhood(xpos, ypos, radius = 1, toroidal = true, self = false){
        let bound = radius;
        let hasNeighbors = false;
        //let neighborhood = new Array();
        let neighborhood = [];
        //let neighbors = new Array();
        let neighbors = [];
        let hasEmptySpaces = false;
        //let emptySpaces = new Array();
        let emptySpaces = [];
        //let deadNeighbors = new Array();
        let deadNeighbors = [];

        for(let i = -bound; i <= bound; i++){
            for(let j = -bound; j <= bound; j++){
                if(!self && i === 0 && j === 0){
                    //console.log("break? "+xpos+" - "+ypos);
                }else{
                    let killAfterBounds = false;
                    let xx = xpos + i;
                    let yy = ypos + j;

                    if(toroidal){
                        if(xx <= -1) xx = this.width - 1;
                        else if(xx >= this.width ) xx = 0;
                        if(yy <= -1) yy = this.height - 1;
                        else if(yy >= this.height ) yy = 0;
                    }else{
                        if(xx < 0 || xx > this.width - 1 || yy < 0 || yy > this.height - 1){
                            killAfterBounds = true;
                        }
                    }

                    if(!killAfterBounds){
                        if(this.existsCellIn(xx, yy)){
                            hasNeighbors = true;
                            if(this.deadCellIn(xx, yy)){
                                deadNeighbors.push({x:xx, y:yy, state:this.current[xx][yy]});
                            }else{
                                neighbors.push({x:xx, y:yy, state:this.current[xx][yy]});
                            }
                        }else{
                            hasEmptySpaces = true;
                            emptySpaces.push({x:xx, y:yy, state:this.current[xx][yy]});
                        }
                        neighborhood.push({x:xx, y:yy, state:this.current[xx][yy]});
                    }
                }
            }
        }
        return {neighborhood:neighborhood, hasEmptySpaces:hasEmptySpaces, emptySpaces:emptySpaces, hasNeighbors:hasNeighbors, neighbors:neighbors, deadNeighbors:deadNeighbors};
    }
    deadCellIn(xpos, ypos){
        if(this.current[xpos][ypos] === this.death){
            return true;
        }
        return false;
    }
    existsCellIn(xpos, ypos){
        if(this.current[xpos][ypos] !== -1){
            return true;
        }
        return false;
    }

    cellChangedState(xpos, ypos){
        if (this.next[xpos][ypos] !== undefined && this.current[xpos][ypos] !== this.next[xpos][ypos]){
            return true;
        }
        else{
            return false;
        }
    }

    iterate(xpos, ypos){
        if(this.cellChangedState(xpos, ypos)){
            this.current[xpos][ypos] = this.next[xpos][ypos];
        }
    }

    iterateAll(){
        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                this.iterate(i, j);
            }
        }
    }

    switchCells(x1, y1, x2, y2){
        this.next[x2][y2] = this.current[x1][y1];
        this.next[x1][y1] = this.current[x2][y2];
    }

    killCellAt(x, y){
        this.next[x][y] = this.death;
    }

    removeCellAt(x, y){
        this.next[x][y] = -1;
    }

    getCells(state){
        //let cells = new Array();
        let cells = [];
        for(let i = 0; i < this.width; i++){
            for(let j = 0; j < this.height; j++){
                if(this.current[i][j] === state)
                    cells.push({x:i, y:j});
            }
        }
        return cells;
    }
}