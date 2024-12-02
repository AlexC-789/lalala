let placePicker = document.getElementById("place-picker");
let list = document.getElementById('destinations')
const mapEl = document.getElementById('google-map')

let destList = document.getElementsByClassName('destination');
console.log(destList)

window.initMap  = function() {
  service = new google.maps.DistanceMatrixService();
}

var count = 3;
let route = [];




function calculateDistance(origin, destination) {
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };
    service.getDistanceMatrix(request).then((response) => {
      console.log(response.rows[0].elements[0].distance.text);
  })
}

function optimiseRoute(destinations, origin) {
  let min = 40000;
  let count = 1;
  destinations.forEach(element => {
    let d = calculateDistance(origin, element)
    if(d<min) {
      min = d;
      count++;
    }
  });
}

function addDestination() {
    const li = document.createElement('li');
    li.innerHTML = `<h3>Destination ${count}</h3><gmpx-place-picker class="destination" placeholder="Enter the next destination"></gmpx-place-picker>`
    list.appendChild(li);
    count++;
}

let destinations = [];
let service;

function getPlace() {
    let place = placePicker.value;
    
    [...destList].forEach(element => {
        destinations.push(element.value);
    });
    if (!place?.location) {
            window.alert( 
              "No details available for input: '" + place.name + "'"
            );}
destinations.forEach(element => {
        console.log(element.location.toString())
    });
    
if(destinations.length) {
    const origin = destinations[0].location;
    const destination = destinations[1].location;
    calculateDistance(origin, destination);
  }

}






