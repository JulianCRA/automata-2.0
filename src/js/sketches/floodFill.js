import Grid from './Grid'

const floodFill = p => {
    let gridWidth;
    let gridHeight;
    let cellWidth;
    let cellHeight;

    let showSeed;
    let euclidean;

    let grid;
    let canvas;
    let sampledImg;
    let paintersLayer;

    let seed;
    let painters;

    let hasStarted;

    p.preload = function(){
        if(!hasStarted) p.customRedraw();
    }

    p.setup = function(){
        canvas = p.createCanvas(Math.min(p._userNode.clientWidth, p._userNode.clientHeight), Math.min(p._userNode.clientWidth, p._userNode.clientHeight))
        canvas.mouseClicked(p.dropPainter);
        paintersLayer = p.createGraphics(p.width, p.height);
        paintersLayer.noStroke();
        paintersLayer.pixelDensity(1);
        p.pixelDensity(1);
        p.noSmooth();
        p.noStroke();
        p.noLoop();
    }

    p.customRedraw = function(config = {}){
        hasStarted = true;
        
        gridWidth = config.width || 50;
        gridHeight = config.height || 50;
        cellWidth = p.width / gridWidth;
        cellHeight = p.height / gridHeight;

        showSeed = config.seed === true;
        euclidean = config.euclidean && true;
        
        painters = [];
        p.initSampler();
        
        grid = new Grid(gridWidth, gridHeight);

        let regions = config.regions || 60;
        p.generateSeed(regions);

        p.voronoi(seed, euclidean);
        if(canvas) p.redraw();
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
    
    p.dropPainter = function(){
        let startX = Math.floor(p.mouseX/cellWidth);
        let startY = Math.floor(p.mouseY/cellHeight);
        painters.push({ x:startX, 
                        y:startY, 
                        startState:grid.current[startX][startY], 
                        newState:0, 
                        moveUp:true,
                        searchLeft:false, 
                        searchRight:false,
                        buckets:[]
                    }
        );
        p.loop();
        p.showPainters();
    }

    let painter;
    p.movePainter = function(index){
        painter = painters[index];

        if(painter.moveUp){
            if(painter.y > 0 && painter.startState === grid.current[painter.x][painter.y-1]){
                painter.y--;
            }
            else{
                painter.moveUp = false;
            }
        }
        else{
            if(painter.y < gridHeight && painter.startState === grid.current[painter.x][painter.y]){
                grid.current[painter.x][painter.y] = 1 - grid.current[painter.x][painter.y];

                if(painter.x > 0){
                    if(grid.current[painter.x-1][painter.y] === painter.startState){
                        if(!painter.searchLeft){
                            painter.buckets.push({x:painter.x-1, y:painter.y});
                            painter.searchLeft = true;
                        }
                    }
                    else if(painter.searchLeft){
                        painter.searchLeft = false;
                    }
                }

                if(painter.x < gridWidth-1){
                    if(grid.current[painter.x+1][painter.y] === painter.startState){
                        if(!painter.searchRight){
                            painter.buckets.push({x:painter.x+1, y:painter.y});
                            painter.searchRight = true;
                        }
                    }
                    else if(painter.searchRight){
                        painter.searchRight = false;
                    }
                }

                painter.y++;
            }
            else{
                if(painter.buckets.length === 0){
                    painters.splice(index, 1);
                }else{
                    //let bck = painter.buckets.pop();
                    let bck = painter.buckets.shift();
                    painter.x = bck.x;
                    painter.y = bck.y;
                    painter.moveUp = true;
                    painter.searchLeft = false;
                    painter.searchRight = false;
                }
                
            }
        }
    }

    
    p.showPainters = function(){
        paintersLayer.clear();
        
        for(let i = 0; i < painters.length; i++){
            paintersLayer.fill('orangered');
            paintersLayer.rect(painters[i].x*cellWidth, painters[i].y*cellHeight, cellWidth-1, cellHeight-1);

            for(let j = 0; j < painters[i].buckets.length; j++){
                paintersLayer.noFill();
                paintersLayer.stroke('orangered');
                paintersLayer.rect(painters[i].buckets[j].x*cellWidth, painters[i].buckets[j].y*cellHeight, cellWidth-1, cellHeight-1);
            }
        }
        p.image(paintersLayer, 0, 0);
    }

    p.draw = function(){
        if(painters.length === 0) p.noLoop();
        for(let i = 0; i < painters.length; i++){
            p.movePainter(i);
        }
        p.clear();
        for(let i = 0; i < gridWidth; i++){
            for(let j = 0; j < gridHeight; j++){
                sampledImg.pixels[((j*gridWidth+i)*4)+3] = grid.current[i][j]*255;
            }
        }
        sampledImg.updatePixels();
        p.image(sampledImg, 0, 0, p.width, p.height);
        
        p.showPainters();

        if(showSeed){
            p.fill([0, 0, 0]);
            for(let i = 0; i < seed.length; i++){
                p.ellipse((seed[i].x+0.5)*cellWidth, (seed[i].y+0.5)*cellHeight, 5, 5);
            }
        }
    }

    p.generateSeed = function(q){
        seed = [];
        let randomX;
        let randomY;
        for(let i = 0; i < q; i++){
            randomX = Math.floor(Math.random()*gridWidth);
            randomY = Math.floor(Math.random()*gridHeight);
            grid.current[randomX][randomY] = Math.round(Math.random());
            seed.push({x:randomX, y:randomY});
        }
    }

    p.voronoi = function(origin, euclidean = true){
        
        let isItShorter;
        if(euclidean){
            isItShorter = function(ax, ay, bx, by){
                if(distance * distance > (ax - bx)*(ax - bx) + (ay - by)*(ay - by)){
                    distance = Math.hypot(ax - bx, ay - by);
                    return true;
                }
                return false;
            };
        }else{
            isItShorter = function(ax, ay, bx, by){
                if(distance > Math.abs(bx - ax) + Math.abs(by - ay)){
                    distance = Math.abs(bx - ax) + Math.abs(by - ay);
                    return true;
                }
                return false;
            };
        }

        let closest;
        let distance;
        

        if(canvas) p.clear();

        for(let i = 0; i < gridWidth; i++){
            for(let j = 0; j < gridHeight; j++){
                distance = gridWidth * gridHeight;
                for(let k = 0; k < origin.length; k++){
                    if(isItShorter(i, j, origin[k].x, origin[k].y)){
                        closest = origin[k];
                    }
                }
                grid.current[i][j] = grid.current[closest.x][closest.y];
            }
        }
    }
}

export default floodFill