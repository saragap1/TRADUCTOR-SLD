var actual_letter = 'A'
let letters = ['A','B','C','D','E','F','G','H','I','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y'];

function focus_letter(letter){
    actual_letter = letter
}

function take_pic(event) {
    if (event.key == 'Enter'){
        console.log(actual_letter)
    }
}

for (let i = 0; i < letters.length; i++) {
    document.getElementById(letters[i]).addEventListener("click", function() {
        focus_letter(letters[i]);
    });
}

document.addEventListener('keydown', take_pic);
