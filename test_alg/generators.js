const numbers = [0,1,2,3,4,5,6];
let i = numbers.length, transfer, randomIndex;


function shuffle(){
  while(i){
    randomIndex = Math.floor(Math.random() * i--);

    transfer = numbers[i];
    numbers[i] = numbers[randomIndex];
    numbers[randomIndex] = transfer;
  }
  console.log(numbers);
}

shuffle();
