$(document).ready(function(){
// initialize the game
	model.initializeGame();
// set up the event listeners for all the cells
	controller.fire_eventListener();
// event listener for the new game button
	// $("button").on('click', "#new_game", model.initializeGame);
	$(".button-wrapper").on('click', "#new_game", model.initializeGame);
	$(".button-wrapper").on('tap', "#new_game", model.initializeGame);

// testing
	// var game_status = model.gameOver();
	// alert(game_status);

	// Warning in console:
	console.log("%cHey no cheating!","color: red; font-size:15px;");


})

////////////// ---- VIEW ---- /////////////////
var view = {
	//properties

	//methods
	displayMiss: function(location_array){
		var x_coordinate = location_array[0].toString();
		var y_coordinate = location_array[1].toString();
		var cell = $(".grid-container").find(".grid-cell-" + x_coordinate + "-" + y_coordinate);
		cell.addClass("miss");
	},

	displayHit: function(location_array){
		var x_coordinate = location_array[0];
		var y_coordinate = location_array[1];
		var cell = $(".grid-container").find(".grid-cell-" + x_coordinate + "-" + y_coordinate);
		cell.addClass("hit");
	},
}

////////////// ---- SHIP CLASS ---- /////////////////
class Ship {
	constructor(ship_locations, name){
		this.shipLength = ship_locations.length;
		this.name = name;
		this.isSunk = false;
		this.shipLocations = new Array(this.shipLength);
		this.shipHits = new Array(this.shipLength);
		// copy the locations to the ship properties
		for (var i=0; i< this.shipLength; i++){
			this.shipLocations[i] = ship_locations[i];
		}
	}
};

////////////// ---- MODEL ---- /////////////////
var model = {
	// Properties
	ship_container: [], // contains all the ships
	invalid_locations: [], // array of all the locations that made ships have
	board_height: 10,
	board_width: 10,
	shots_fired: 0,
	number_hits: 0,

	// Methods
	initializeGame: function(){
	// clear all classes:
		$(".miss").children(".cross").remove();
		$(".miss").removeClass("miss");
		$(".hit").removeClass("hit");
		$(".sunk").removeClass("sunk");

	// CLEAR STATS:
		var stats = $(".user-stats");
		stats.find("#shots-fired").text("0");
		stats.find("#accuracy").text("--");

	// clear the model variables:
		model.ship_container = [];
		model.invalid_locations = [];
		model.shots_fired = 0;
		model.number_hits = 0;
		// starts new game:
		var boats_to_make = [[2, "patrol"], [3,"submarine"], [3, "destroyer"], [4, "battleship"], [5, "carrier"]];
		for (var i = 0; i < boats_to_make.length; i++) {
			var length = boats_to_make[i][0];
			var name = boats_to_make[i][1];
			// alert(name);
			model.makeShip(length, name);
		};

	}, 

	makeShip: function(shipLength, name){
		var valid = false;
		// keep looping until you get valid points
		while (!valid){
			var locations = [];
			//1.) get a random point
			//??? Should I do this. or model. ?
			var possible_x = Math.floor(Math.random()* this.board_width);
			var possible_y = Math.floor(Math.random()* this.board_height);
			locations.push([possible_x, possible_y]);
			//2.) get a random direction & and build next point
			var orientation = Math.floor(Math.random() * 4).toString();
			// alert(orientation);
			switch (orientation){
				// go up
				case "0": 
					for (var i =1;  i < shipLength; i++) {
						// alert("Hi");
						var new_point = [possible_x, possible_y + i];
						locations.push(new_point);
						// alert(new_point);
					};
				break;

				// go right
				case "1": 
					for (var i =1;  i < shipLength; i++) {
						var new_point = [possible_x + i, possible_y];
						locations.push(new_point);
						// alert(new_point);
					};
				break;

				// got down
				case "2":
					for (var i =1;  i < shipLength; i++) {
						var new_point = [possible_x, possible_y - i];
						locations.push(new_point);
						// alert(new_point);
					};
				break;

				// go left
				case "3":
					for (var i =1;  i < shipLength; i++) {
						var new_point = [possible_x - i, possible_y];
						locations.push(new_point);
					};

				break;

				default:
					alert("Problems");
			}

			// alert(locations);
			if (model.validLocation(locations)){
				// alert("Valid Locations!")
				// alert(locations);
				valid = true;
			}
		} // closes while loop
		
		// add the new invalid locations:
		for (var i = 0; i < locations.length; i++) {
			model.invalid_locations.push(locations[i]);
		};
		// alert(locations);
		// var locations_array = [[1,2], [1,3], [1,4]];
		var ship = new Ship(locations, name);
		this.ship_container.push(ship);
	},

	validLocation: function(test_point){
		//test_point is an array
		var valid = true;
		// loop through each invalid location
		for (var i=0; i< this.invalid_locations.length; i++){
			var invalid_point = this.invalid_locations[i];
			// loop through each of the test points to see if it is in the invalid location
			for (var j=0; j<test_point.length; j++){
				if(invalid_point[0] == test_point[j][0] && invalid_point[1] == test_point[j][1]){
					valid = false;
					// alert("invalid: " + invalid_point);
				}
			}
		}
		// make sure each point is within the board
		for (var i = test_point.length - 1; i >= 0; i--) {
			if (test_point[i][0] < 0 || test_point[i][0] > model.board_width - 1){
				valid = false;
			} else if (test_point[i][1] < 0 || test_point[i][1] > model.board_height - 1){
				valid = false;
			}
		};
		return valid;
	},

	isSunk: function(){
	// function checks to see if any ships are sunk
	for (var i = 0; i < model.ship_container.length; i++) {
		var ship = model.ship_container[i];
		// alert(ship.name);
		// assume ship is sunk
		// alert(ship.name + " and the container is: " + this.ship_container.length);
		var sunk = true;
		for (var j = 0; j < ship.shipHits.length; j++) {
			// alert(ship.shipHits[j]);
			if (ship.shipHits[j] != "hit"){
				sunk = false;
				// alert("Not sunk!");
			}
		// 	alert(isSunk);
		};
		ship.isSunk = sunk;
		// // if the ship is sunk
		if (sunk){
		// 	// check to see if it has class sunk
			var name = ship.name;
			var boat = $("#boat-list").find("#" + name);
			if (boat.hasClass("sunk")){
		// 		// pass
		// 		// alert("already sunk")
			} else {
				boat.addClass("sunk");
				alert("You sank the " + name);
			}
		// 	// if it doesn't, add that class
		};
	};
		var length = ship.shipLength;
		var isSunk = true;
		for (var i=0; i < length; i++){
			if (ship.shipHits[i] != "hit"){
				isSunk = false;
			}
		}
		return isSunk;
	},

	gameOver: function(){
		var gameOver = true;
		var all_ships = this.ship_container;
		for (var i = 0; i < all_ships.length; i++) {
			var ship = all_ships[i]
			if (ship.isSunk == false){
				gameOver = false;
			}
		};
		return gameOver;
	},

}

////////////// ---- CONTROLLER ---- /////////////////
var controller = {
	//properties

	//methods
	fire_eventListener: function(){
		$(".grid-container").on("click", ".grid-cell", function(){
			var cell = $(this);
			var guess_location = [cell.data("x"), cell.data("y")];
			// alert(fire_location);
			controller.fire(guess_location, cell);
					
		})

		$(".grid-container").on("tap", ".grid-cell", function(){
			var cell = $(this);
			var guess_location = [cell.data("x"), cell.data("y")];
			// alert(fire_location);
			controller.fire(guess_location, cell);
					
		})
	},

	fire: function(location, cell){
		// first check that the game is not over!
		if (model.gameOver()){
			alert("You already won!");

		} else{
			// UPDATE STATS
			model.shots_fired += 1;


			var guess_x = location[0];
			var guess_y = location[1];
			var hit = false;
			// loop through each ship within the container:
			var all_ships = model.ship_container;
			for (var j=0; j< all_ships.length; j++){
				var ship = model.ship_container[j];
				for (var i=0; i<ship.shipLength; i++){
					var ship_x = ship.shipLocations[i][0];
					var ship_y = ship.shipLocations[i][1];
					// alert(typeof(ship_x) + ", " + ship_y);
					// alert(ship.shipLocations[i]);
					if (guess_x == ship_x && guess_y == ship_y){
						hit = true;
						ship.shipHits[i] = "hit";
					}
			}


			}
			
			// check the hit variable to see if ship was hit!
			if (hit){
				// cell.addClass("hit");
				view.displayHit([guess_x, guess_y]);

				// update stats:
				model.number_hits +=1;
			} else {
				// update stats:
				model.miss +=1;

				if (cell.hasClass("miss")){
					alert("That was already a miss!");
				} else{
				// view.displayMiss([guess_x, guess_y]);
				cell.addClass("miss");
				var x = $('<div class="cross"></div>');
				cell.prepend(x);
				}
			}

			// Check the model to see if any boats are sunk
			model.isSunk();
			if (model.gameOver()){
				alert("You won!");

			} 

			// UPDATE STATS:
			var stats = $(".user-stats");
			stats.find("#shots-fired").text(model.shots_fired.toString());
			var accuracy = Math.round((model.number_hits / model.shots_fired) * 100);
			stats.find("#accuracy").text(accuracy.toString());


		} // closes the else statement

	}, 

};