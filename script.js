/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/
// function that updates the coffee counter on page
function updateCoffeeView(coffeeQty) {
  // create a variable to store and update the coffee counter
  let coffeeCounter = document.getElementById('coffee_counter');
  coffeeCounter.innerText = coffeeQty;
}

// function to update coffee count linked to object on data file
function clickCoffee(data) { 
  // increments the coffee count by 1
  data.coffee += 1;
  //updates the coffee counter element with the incremented value
  updateCoffeeView(data.coffee);
  //updates the DOM to reflect any newly unlocked producers
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/
  // changes 'unlocked' to 'true when the player's coffee count is equal or larger than half the initial price of the producer -- data.producers[0].unlocked = true;
  function unlockProducers(producers, coffeeCount) {
    producers.forEach(producer => {
      if (coffeeCount >= producer.price / 2) {
        producer.unlocked = true;
      }
    })
   }

// returns an array of unlocked producer objects
function getUnlockedProducers(data) {
  // create array - does not mutate the data
  let unlockedProducers = [];
    // filters out producer objects which are not unlocked
    data.producers.forEach(producer => {
      if (producer.unlocked) { // unlocked: true,
        unlockedProducers.push(producer);
      }
    })
    // returns an array of producer objects unlockedProducers
    return unlockedProducers;
}

// transforms its input string from snake_case (input_string) to Title Case(Input String)
function makeDisplayNameFromId(id) {
  let words = id.split('_');
  let titleCaseWords = [];

  words.forEach(word => {
    titleCaseWords.push(word.charAt(0).toUpperCase() + word.slice(1));
  })

  // returns a string - from [] to '' w' join plus add a space between words
  return titleCaseWords.join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

// calls the `.removeChild()` method on the dom node passed in at least once
// gets rid of all of the children of the DOM node passed in
function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/*
The renderProducers function
    4) calls document.getElementById() or document.querySelector()
    5) appends some producer div elements to the producer container
    6) unlocks any locked producers which need to be unlocked
    7) only appends unlocked producers
    8) deletes the producer container's children before appending new producers
    9) is not in some way hardcoded to pass the tests
*/
function renderProducers(data) {
  // calls document.getElementById() or document.querySelector()
  let container = document.getElementById('producer_container');

  // unlocks any locked producers which need to be unlocked
  unlockProducers(data.producers, data.coffee);
  let unlockedProducers = getUnlockedProducers(data);
 
  // deletes the producer container's children before appending new producers
  deleteAllChildNodes(container);
  unlockedProducers.forEach(producer => {
    // appends some producer div elements to the producer container
    let producerDiv = makeProducerDiv(producer);
    // only appends unlocked producers
    container.appendChild(producerDiv);
  })
 }

/**************
 *   SLICE 3
 **************/

// returns an object
// returns the correct producer object (selected by id, e.g. id: 'chemex')
function getProducerById(data, producerId) {
  //return {};
  // find only returns object that matches ID first
  return data.producers.find(producer => producerId === producer.id);
}

// returns true if the player can afford the producer
// returns false if the player cannot afford the producer

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  if (data.coffee >= producer.price) {
    return true;
  } else {
    return false;
  }
}

// calls document.getElementById() or document.querySelector()
// updates the total cps indicator to display the current total cps
function updateCPSView(cps) {
  let cpsIndicator = document.getElementById('cps');
  cpsIndicator.innerText = cps;
}

// returns an integer, not a float
//returns 125% of the input price, rounded down
function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let isPlayerCanAfford = canAffordProducer(data, producerId);
   // returns false if the player cannot afford the producer
  // returns true if the player can afford the producer

  if (isPlayerCanAfford) { // only if true
    let producer = getProducerById(data, producerId); // returns the producer Object that matches the ID
    // increments the quantity of the producer in question only if the player can afford it
    producer.qty += 1;
    // decrements the player's coffee by the *current* price of the producer, but only if the player can afford it
    data.coffee = data.coffee - producer.price;
    // updates the price of the producer to 125% of the previous price, rounded down, but only if the player can afford the producer
    producer.price = updatePrice(producer.price);
    // updates the total CPS, but only if the player can afford the producer
    data.totalCPS += producer.cps;
  }
  return isPlayerCanAfford; // returns a boolean
}

function buyButtonClick(event, data) {
  //does not modify data or show an alert box if the event passed in doesn't represent a click on a button element
  //https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName REMEMBER CAPS!
  if (event.target.tagName === 'BUTTON') {
    let producerId = event.target.id.slice(4);
    let isPurchased = attemptToBuyProducer(data, producerId);
      // mutates the data only if the player can afford the producer
      if (isPurchased) {
        //renders the updated producers when a purchase succeeds
        renderProducers(data);
        //updates the coffee count on the DOM, reflecting that coffee has been spent, when a purchase succeeds
        updateCoffeeView(data.coffee);
        //updates the total CPS on the DOM, reflecting that the new producer's CPS has been added
        updateCPSView(data.totalCPS);
      } else {
        //shows an alert box with the message "Not enough coffee!" only if the player cannot afford the producer
        window.alert('Not enough coffee!');
      }
  }
}

function tick(data) {
  // increases coffee count by the total CPS
  data.coffee += data.totalCPS;
  // updates the dom to reflect this new coffee count
  // updates the dom to reflect any newly unlocked producers
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}

