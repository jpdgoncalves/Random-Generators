
/**
 * 
 * @param {[]} array 
 */
export function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

/**
 * 
 * @param {[]} array 
 * @param {number} amount 
 */
export function choices(array, amount = 1) {
    let choices = [];
    let arrayCopy = array.slice();
    amount = amount > arrayCopy.length ? arrayCopy.length : amount;

    shuffle(arrayCopy);

    for(let i = 0; i < amount; i++) {
        choices.push(arrayCopy[i]);
    }

    return choices;
}