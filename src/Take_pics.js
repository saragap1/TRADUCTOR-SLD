var actual_letter = 'A'
let letters = ['A','B','C','D','E','F','G','H','I','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y'];
const full_vid = document.getElementById("full_vid");
const mini_vid = document.getElementById("mini_vid");
const canvas = document.getElementById("mini_pic");
const context = canvas.getContext("2d");

function focus_letter(letter){
    actual_letter = letter
}

for (let i = 0; i < letters.length; i++) {
    document.getElementById(letters[i]).addEventListener("click", function() {
        focus_letter(letters[i]);
    });
}

const CONSTRAINTS_FULLIMAGE = {
    video: {weight:{ideal:854}, height:{ideal:480}},
    audio: false
}
const CONSTRAINTS_MINIIMAGE = {
    video: {width:28, height:28},
    audio: false
}

const getVideo = async () => {
    try{
        const STREAM_FULL = await navigator.mediaDevices.getUserMedia(CONSTRAINTS_FULLIMAGE);
        SHOW_full(STREAM_FULL);
        console.log(STREAM_FULL);
        
        const STREAM_MINI = await navigator.mediaDevices.getUserMedia(CONSTRAINTS_MINIIMAGE);
        SHOW_mini(STREAM_MINI);
        console.log(STREAM_MINI);
    }
    catch (err){
        console.log(err);
    }
};

const SHOW_full = (stream) => {
    full_vid.srcObject = stream;   
    full_vid.play();
};

const SHOW_mini = (stream) => {
    mini_vid.srcObject = stream;
    mini_vid.play();
};

getVideo();

function take_pic(event) {
    if (event.key === 'Enter') {
        const selectedVideo = actual_letter === 'A' ? full_vid : mini_vid;
        context.drawImage(selectedVideo, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL();
        console.log(imageData);
    }
}


document.addEventListener('keydown', take_pic);
