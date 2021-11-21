//The Shared City - Assignment 3
//by Alexis, Abena, and Michael

//Credit to Dimitris Papanikolaou for barebones code

// Global Variables

// Defined global_id variable to create unique IDs for each Station object created.

var global_id = 0;

// Clock for simulation

var timer = 0;

// Radius of circle for tower layout

var layoutRadius = 250;

// timeLine represents minutes and we are simulating between the hours of 6 a.m. to 8 p.m. as        this is when typical commute happens for the work day (840 minutes total)

var timeLine = 840;

var nStations;

// arrays for towers, people, trips
var stations = [];
var people;
var trips;

// Established array for the building program. Each of the 10 elements represents a tower, with      the first number representing the total number of household units in the tower and the second    representing the total number of offices.

var program = [

  [200,20],

  [60,40],

  [100,150],

  [30,90],

  [160,50],

  [80,300],

  [350,30],

  [40,200],
  
  [30,160],

  [50,60]
];

function setup() {
  createCanvas(windowWidth, windowHeight);

// Number of stations defined by the number of elements in the program array, in this case 10 for    each tower.
  
  nStations = program.length;

// Create stations based on the total number of stations.
  
  stations = createStations(nStations);

// Create people based on the program.
  
  people = createPeople(program);

// Create trips based on people. Each person makes 2 trips, one for each commute.
  trips = makeTrips(people);

}

function draw() {
  background(0);

// This is to represent the time of day throughout the simulation.  Essentially every 60 ticks on    the text changes to reflect the hour.
    fill(255);
    textSize(15);
    textAlign(CENTER);
    var clockX = windowWidth/2;
    var clockY = 19*windowHeight/20;
      if(timer>780){
        text('7:00 p.m.',clockX,clockY);
      }else if(timer>720){
        text('6:00 p.m.',clockX,clockY);
      }else if(timer>660){
        text('5:00 p.m.',clockX,clockY);
      }else if(timer>600){
        text('4:00 p.m.',clockX,clockY);
      }else if(timer>540){
        text('3:00 p.m.',clockX,clockY);
      }else if(timer>480){
        text('2:00 p.m.',clockX,clockY);
      }else if(timer>420){
        text('1:00 p.m.',clockX,clockY);
      }else if(timer>360){
        text('12:00 p.m.',clockX,clockY);
      }else if(timer>300){
        text('11:00 a.m.',clockX,clockY);
      }else if(timer>240){
        text('10:00 a.m.',clockX,clockY);
      }else if(timer>180){
        text('9:00 a.m.',clockX,clockY);
      }else if(timer>120){
        text('8:00 a.m.',clockX,clockY);
      }else if(timer>60){
        text('7:00 a.m.',clockX,clockY);
      }else if(timer>0){
        text('6:00 a.m.',clockX,clockY);
}

// looping for the total number of trips
  
  for(var i = 0; i < trips.length; i++){

    if (timer == trips[i].startTime){
      trips[i].startStation.checkOut();
    }
    if (timer == trips[i].endTime){
      trips[i].endStation.checkIn();
    }
    // Display trip
    trips[i].display(timer);
  }
  // Display station
  for(var i = 0; i <stations.length; i++){
    stations[i].display();
  }

  timer++;
// If the timer reaches the end of the timeline then it is no longer necessary, so the loop          stops.
  if(timer == timeLine) {
    noLoop();
  }
}

//function for creating people based off program

function createPeople(program) {

// Create the stack of offices
  var workArr = [];
// Create the stack of houses
  var homeArr = [];
// Create a stack for adding the newly created peole
  var people = [];
// Count number of people that have been created.
  var n_people = 0;

// To create the three stacks, For each tower:
  
  for(var i = 0; i < program.length; i++){
// Get the total number of households in the tower
    var n_households = program[i][0];
// Get the total number of offices in the tower
    var n_workplaces = program[i][1];

// Keeping count of the number of people
    n_people = n_people + n_households;

// Adding the household stacks as many indexes "i" as the index of the current tower.
    for(var j = 0; j < n_households; j++){
      homeArr.push(i);
    }
// Adding the workplace stacks as many indexes "i" as the index of the current tower.
    for(var j = 0; j < n_workplaces; j++){
      workArr.push(i);
    }
  }

// For each person:
  for(var i = 0; i < n_people; i++){
// Flipping a coin to decide where the person works.
    var workIndex = floor(random(workArr.length));
// Splicing index of the tower selected from the stack of offices so it isn't selected again.
    var work = workArr.splice(workIndex,1)[0];

// Flipping a coin to decide where the person lives.
    var homeIndex = floor(random(homeArr.length));
// Splicing index of the tower selected from the stack of housing units so it isn't selected        again.
    var home = homeArr.splice(homeIndex,1)[0];

// Create a new person and add it to the stack of people.
    people.push({
      id: i,
      work: work,
      home: home
    })
  }

  // Stack of all people used as a "return function" for createPeople()
  return people;
}

// Creating function to create a list of station objects.
function createStations(nStations){
  var stations = [];
  for(var i = 0; i < nStations; i++){
    // Determine the X and Y coordinates for displaying stations in a circle
    var angle = i * 2 * Math.PI/nStations;
    var x = width/2 + layoutRadius * Math.sin(angle);
    var y = height/2 + layoutRadius * Math.cos(angle);
    // Create the new station
    stations[i] = new Station(x,y);
  }
  return stations;
}

// Creating function to make trips for each person.
function makeTrips(people){
  var trips = [];

  for(var i = 0; i <people.length; i++){
    // Morning commute from home to work.  Range for startTime is 0 to 180 minutes, so 6 a.m. to     10 a.m.
    var startTime = floor(random(0,240));
    // Trip duration varies from 0 to 60 minutes.
    var duration = floor(random(60));
    var endTime = startTime + duration;
    var startStation = stations[people[i].home];
    var endStation = stations[people[i].work];
    trips.push( new Trip(startStation, endStation, startTime, endTime) );

    // Evening commute from work to home. Range for startTime is 480 to 780 minutes, so 3 p.m. to     7 p.m.
    var startTime = floor(random(540,780));
    // Trip duration varies from 0 to 60 minutes.
    var duration = floor(random(60));
    var endTime = startTime + duration;
    var startStation = stations[people[i].work];
    var endStation = stations[people[i].home];
    trips.push( new Trip(startStation, endStation, startTime, endTime) );
  }
  return trips;
}

// Creating class for stations.
class Station {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.id = global_id++;
    this.vehicles = 0;
// Keep track of the maximum level of vehicles that the station had during the timeline
    this.maxVehicles = 0;
// Keep track of the minimum level of vehicles that the station had during the timeline
    this.minVehicles = 0;
// Keep track of the required capacity of parking spaces that the station needs during the          timeline. This is the difference between maximum and minimum levels
    this.capacity = 0;
  }
  // Create a function to decrement the vehicles accumulation in the station, each time a trip starts from that station (check out)
// Subtract a vehicle from the number of vehicles at the station each time a trip starts from        that station.
  checkOut(){
    this.vehicles--;
    this.update();
  }
// Add a vehicle to the number of vehicles at the station each time a trip ends at that              station.
  checkIn(){
    this.vehicles++;
    this.update();
  }
  // Creating a function to update the levels of max and min vehicles and the parking capacity
  update(){
    this.minVehicles = min(this.vehicles, this.minVehicles);
    this.maxVehicles = max(this.vehicles, this.maxVehicles);
    this.capacity = this.maxVehicles - this.minVehicles;
  }

  display() {
    push(); 
      translate(this.x,this.y);
      var angle = PI/2 - (this.id * 2 * Math.PI/stations.length);
      rotate(angle);
      noStroke();

// Drawing circles that change in size with current accumulation.
      for (var i = 0; i< abs(this.vehicles); i++){
// If current accumulation is above 0 (assuming 0 is the starting accumulation value at time        T=0), then use white fill.
        if (this.vehicles>=0){
          fill(255);
          circle(0,0,0.2*i);
        } else {
// Else if current accumulation is below 0, then use black fill and white stroke.
          strokeWeight(0.5);
          stroke(255);
          fill(0);
          circle(0,0,0.2*i);
        }
      }
// Creating text that displays the capacity of each tower.
       push();
        // translate(10 + this.maxVehicles * 2, 0);
        rotate(PI/2);
        textAlign(CENTER,BOTTOM);
        noStroke();
        fill(255);
        textSize(12);
        text(this.capacity, 0, -40);
      pop();

    pop();
  }
}

// Creating a class for trips.
class Trip {
  constructor(startStation, endStation, startTime, endTime){
    this.startStation = startStation;
    this.endStation = endStation;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  display(timer){
// Creating lines as trips are carried out and giving them opacity to show a sort of history of      travel between towers.
      strokeWeight(0.1);
      noFill();
      stroke(255,10);
      line(this.startStation.x, this.startStation.y, this.startStation.x + this.progress(timer) *           (this.endStation.x-this.startStation.x), this.startStation.y + this.progress(timer) *             (this.endStation.y-this.startStation.y));
// Drawing the vehicles as circles as they travel. 
if (this.startTime <= timer && this.endTime > timer){
      fill(255,100);
      stroke(0);
      circle( this.startStation.x + this.progress(timer) * (this.endStation.x-this.startStation.x),  this.startStation.y + this.progress(timer) * (this.endStation.y-this.startStation.y), 2.5  );
    }
  }
  // Creating a function to calculate the progress of the trip (a number ranging from 0 to 1)
  progress(timer){
    return timer >= this.startTime ? timer > this.endTime ? 1 : (timer - this.startTime ) / (this.endTime - this.startTime ) : 0;
  }
}