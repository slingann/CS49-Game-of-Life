var grid;

function setup () {
  createCanvas(400, 400);
  grid = new Grid(10);
	grid.randomize();
	// Testing Step 8!
	// print(grid.isValidPosition(0, 0));
	// print(grid.isValidPosition(-1, -1));
}

function draw () {
  background(250);
  
  grid.draw();
		
	grid.updateNeighborCounts();
	print(grid.cells);
	grid.updatePopulation();
  frameRate(6);
}

//Step 6 - updates the population of cells when the mouse is pressed
//Step 7 - prints the status and number of neighbors for a random cell when the mouse is pressed
// function mousePressed(){
 	//Commands placed before Step 10!
 	// var randomColumn = floor(random(grid.numberOfColumns));
 	// var randomRow = floor(random(grid.numberOfRows));

 	// var randomCell = grid.cells[randomColumn][randomRow];
 	// var neighborCount = grid.getNeighbors(randomCell).length;

 	// print("cell at " + randomCell.column + ", " + randomCell.row + " has " + neighborCount + " neighbors");	

 	//Step 11 - the program doesn't work properly when grid.updatePopulation() is above grid.updateNeighborCounts(), but it works just fine when places at the end of the mousePressed function!

	// Commands placed after Step 10
	// grid.updateNeighborCounts();
	// print(grid.cells);
	// grid.updatePopulation();

// }

class Grid {
  constructor (cellSize) {
    // update the contructor to take cellSize as a parameter
    // use cellSize to calculate and assign values for numberOfColumns and numberOfRows

		//Step 1 - the constructor now takes cellSize as a parameter
		this.cellSize = cellSize;

		//Determines how many columns and rows based on the provided cellSize parameter value and the width and height of the canvas
		this.numberOfColumns = height / cellSize;
		this.numberOfRows = width / cellSize;

		//Step 2 - keeps track of each cell in the grid
		this.cells = new Array(this.numberOfColumns);
		//For every column that is kept track of, a row is kept track of as well
		for (var i = 0; i < this.cells.length; i ++) {
  		this.cells[i] = new Array(this.numberOfRows);
		}

		//Step 3 - Creates cell for each position, print(this.cells); now prints the cells' details instead of empty arrays
		for (var column = 0; column < this.numberOfColumns; column ++) {
  		for (var row = 0; row < this.numberOfRows; row++) {
    		this.cells[column][row] = new Cell(column, row, cellSize);
  		}	
		}

		//Prints the status of each position on the grid (says all positions are empty)
		print(this.cells); 
	}

  draw () {
		//Each cell now draws itself instead of all of the cells being drawn together in columns and rows
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].draw();
      }
    }
  }

	//Tells program to randomly set each cell to "alive" or "dead" based on a randomly generated integer bewteen 0 and 2
	randomize () {
		for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].setIsAlive(floor(random(2)));
				this.cells[column][row].draw();
      }
    }
	}

	//Updates the population of cells based on cells' current status and number of living neighbors
	updatePopulation () {
		for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row].liveOrDie();
      }
    }
	}

	//Step 7 - gets the positions and number of neighbors around a random cell
	getNeighbors(currentCell) {
		var neighbors = [];
		for (var xOffset = -1; xOffset <= 1; xOffset++) {
  		for (var yOffset = -1; yOffset <= 1; yOffset++) {
    		var neighborColumn = currentCell.column + xOffset;
    		var neighborRow = currentCell.row + yOffset;
    // do something with neighborColumn and neighborRow
		//Step 9 - stops producing errors with the number of neighbors as the positions of neighbors are being checked for validity 
				if (this.isValidPosition(neighborColumn, neighborRow)){
					append(neighbors, this.cells[neighborColumn][neighborRow]);
					//Add some logic inside getNeighbors to prevent the cell that is the current cell from being added to the array.
					if(neighborColumn == currentCell.column && neighborRow == currentCell.row){
						neighbors.pop();
					}
				}
			}
		}
		return neighbors;
	}

	//Step 8 - determines if a cell is in a "valid position" based on its column and row values or x and y coordinates
	isValidPosition(column, row) {
  	// add logic that checks if the column and row exist in the grid
  	// return true if they are valid and false if they are not
		if (column < this.numberOfColumns && column >= 0 && row < this.numberOfRows && row >= 0){
			return true;
		} else {
			return false;
		}
	}
	
	//Step 10 - update the liveNeighborCount based on the number of living neighbors around each cell
	updateNeighborCounts () {
  // for each cell in the grid
		for (var column = 0; column < this.numberOfColumns; column++) {
      for (var row = 0; row < this.numberOfRows; row++) {

				// reset it's neighbor count to 0
        this.cells[column][row].liveNeighborCount = 0;

				// get the cell's neighbors
				this.getNeighbors(this.cells[column][row]);

				// increase liveNeighborCount by 1 for each neighbor that is alive
				for (var i = 0; i < this.getNeighbors(this.cells[column][row]).length; i++){
					if (this.getNeighbors(this.cells[column][row])[i].isAlive == true){
						this.cells[column][row].liveNeighborCount += 1;
					}
				}
      }
    }
	}
}

class Cell {
	constructor (column, row, size) {
		this.column = column;
		this.row = row;
		this.size = size;
		this.isAlive = false;
		this.liveNeighborCount = 0;
	}

	draw(){
		//Step 4 - Says how to draw each cell and what color to use for the fill based on whether or not the cell is alive
		if (this.isAlive){
			fill(152, 251, 152);
		} else {
			fill(240);
		}

    noStroke();
    rect(this.column * this.size + 1, this.row * this.size + 1, this.size - 1, this.size - 1);
	}

	//Step 5 - Tells program how to set each cell based on the value of the value parameter
	setIsAlive(value){
		if (value == true){
			this.isAlive = true;
		} else {
			this.isAlive = false;
		}
	}

	liveOrDie(){
		if (this.isAlive == true && this.liveNeighborCount < 2){
			//Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
			this.isAlive = false;
		} else if (this.isAlive == true && this.liveNeighborCount > 3){
			//Any live cell with more than three live neighbours dies, as if by overpopulation.
			this.isAlive = false;
		} else if (this.isAlive == true && (this.liveNeighborCount == 2 || this.liveNeighborCount == 3)){
			//Any live cell with two or three live neighbours lives on to the next generation.
			this.isAlive == true;
		} else if (this.isAlive == false && this.liveNeighborCount == 3){
			//Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
			this.isAlive = true;
		}
	}
}
