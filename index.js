let placePicker = document.getElementById("place-picker");
let list = document.getElementById('destinations')
const mapEl = document.getElementById('google-map')

let destList = document.getElementsByClassName('destination');
console.log(destList)

window.initMap  = function() {
  service = new google.maps.DistanceMatrixService();
}

var count = 3;
var route;

class Graph {
  constructor(noOfVertices) {
    this.noOfVertices;
    this.adjList = new Map();
  }

  addVertex(v) {
    this.adjList.set(v, []);
  }

  addEdge(v, w, weight) {
    // Get the adjacency list for vertex v
    const edges = this.adjList.get(v);

    // Push a new edge object with node and weight
    edges.push({ node: w, weight: weight });

  }

  printGraph() {
    // Get all the vertices
    const get_keys = this.adjList.keys();

    // Iterate over the vertices
    for (const vertex of get_keys) {
      // Get the adjacency list for the vertex
      const edges = this.adjList.get(vertex);

      // Construct a string of edges with distances
      const connections = edges
        .map(edge => `${edge.node} (distance: ${edge.weight})`)
        .join(", ");

      console.log(`${vertex} -> ${connections}`);
    }
  }

  findShortestRoute() {
    const vertices = Array.from(this.adjList.keys());
    const n = vertices.length;
    const FULL_MASK = (1 << n) - 1;
  
    // Create adjacency matrix from the adjacency list
    const graph = Array.from({ length: n }, () => Array(n).fill(Infinity));
    vertices.forEach((v, i) => {
      this.adjList.get(v).forEach(edge => {
        const j = vertices.indexOf(edge.node);
        graph[i][j] = edge.weight;
      });
    });
  
    // Initialize DP table and parent table
    const dp = Array.from({ length: 1 << n }, () => Array(n).fill(Infinity));
    const parent = Array.from({ length: 1 << n }, () => Array(n).fill(-1));
    dp[1][0] = 0; // Starting from node 0 with only node 0 visited
  
    // Populate DP table
    for (let mask = 1; mask <= FULL_MASK; mask++) {
      for (let u = 0; u < n; u++) {
        if (mask & (1 << u)) { // If u is part of the current mask
          for (let v = 0; v < n; v++) {
            if (!(mask & (1 << v))) { // If v is not yet visited
              const nextMask = mask | (1 << v);
              const newCost = dp[mask][u] + graph[u][v];
              if (newCost < dp[nextMask][v]) {
                dp[nextMask][v] = newCost;
                parent[nextMask][v] = u; // Record where we came from
              }
            }
          }
        }
      }
    }
  
    // Calculate the minimum cost to return to the starting node
    let minCost = Infinity;
    let lastNode = -1;
    for (let i = 1; i < n; i++) {
      const cost = dp[FULL_MASK][i] + graph[i][0];
      if (cost < minCost) {
        minCost = cost;
        lastNode = i;
      }
    }
  
    // Reconstruct the route
    let mask = FULL_MASK;
    let currentNode = lastNode;
    const route = [];
    while (currentNode !== -1) {
      route.push(vertices[currentNode]);
      const prevNode = parent[mask][currentNode];
      mask ^= (1 << currentNode); // Remove current node from mask
      currentNode = prevNode;
    }
  
    route.reverse(); // Reverse the route to start from the origin
    route.push(vertices[0]); // Add the starting node at the end to complete the cycle
  
    return { minCost, route };
  }
  
  
  
  
  
}





function calculateDistance(origin, destination) {
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };
     return service.getDistanceMatrix(request).then((response) => {
      return Object.values(response.rows[0].elements[0].distance)[0];
  }
)
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
  destinations.unshift(place)
  route = new Graph(destinations.length);

  for (var i = 0; i < destinations.length; i++) {
    route.addVertex(destinations[i].displayName);
  }
  console.log(destinations.length)



  for (var i = 0; i < destinations.length; i++) {
    for (var j = 0; j < destinations.length; j++ ) {
      if (j!=i) {
        const origin = destinations[i];
        const dest = destinations[j];
        calculateDistance(origin.location, dest.location).then((data) => {
          const distance = parseFloat(data.replace(/[^\d.]/g, ""));
          route.addEdge(origin.displayName, dest.displayName, distance);
        })
      }
    }

  }

  setTimeout(() => {
    route.printGraph()
  }, 2000);
  
  
}

function displayRoute(result) {
  const routeContainer = document.getElementById('route-output');
  
  // Clear previous output
  routeContainer.innerHTML = '';

  // Add total distance
  const distanceText = document.createElement('h3');
  distanceText.textContent = `Total Distance: ${result.minCost.toFixed(2)} km`;
  routeContainer.appendChild(distanceText);

  // Add route details
  const routeList = document.createElement('ul');
  routeList.style.listStyleType = 'none';
  routeList.style.padding = '0';

  result.route.forEach((location, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${location}`;
    routeList.appendChild(listItem);
  });

  routeContainer.appendChild(routeList);
}


function calculateRoute() {
  console.log(route.findShortestRoute()) 
  const result = route.findShortestRoute();

  displayRoute(result);
  
}








