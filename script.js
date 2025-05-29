console.log("heheh i am back ")
const txtemp = document.getElementById("txtemp")
const mainbox = document.getElementById("mainbox")
const txtperm = document.getElementById("txtperm")
const righttxt = document.getElementById("righttxt")
const rightbox = document.querySelector(".rightbox")
let temp = [];
let righttext;
let api = "https://api.quotable.io/random?maxLength=50";
let api2 = "https://random-word-api.herokuapp.com/word?number=100"

async function getdata(){
    try {
        const response = await fetch(api2);
        const data = await response.json();
        console.log(data)
        righttext = data;
    } catch (error) {
        console.log(error)
            righttext = ["Oops","it","seems","like","the","api","couldn't","fetch","new","strings","anyway","dont","worry","here","is","a","text","for","you","The", "curious", "student", "uploaded", "a", "PDF", "file", "to", "the", "website",
          "which", "processed", "the", "document", "and", "extracted", "a", "QR", "code", "from",
          "the", "first", "page", "using", "an", "intelligent", "algorithm", "that", "quickly", "decoded",
          "user", "information", "such", "as", "name", "age", "email", "and", "phone", "number",
          "then", "displayed", "it", "on", "the", "screen", "for", "confirmation", "and", "review"];
    }
    updateDisplay(0, 0);
    mainbox.focus()
    rightbox.classList.add("focus", "blink")

}
getdata()

//loads the theme
window.onload = ()=>{
    if(localStorage.getItem("theme")=="dark"){
        document.body.classList.toggle("dark-mode")
    }
}

let index = 0
let slice_index = 0
let length_correct = 0;
let carettimeout;
let charectertyped = 0;
let keystroke_type = "creamy"; //default
let timerrunning = false;
let typingallowed = true;
// let timerreached = false;
mainbox.addEventListener("keydown",(e)=>{
    e.preventDefault()
    if(typingallowed == true){
        if(e.key.length === 1 && e.key !== ' '){
            //starting the timer
            if(timerrunning == false){
                timerstart()
            }
            //
            temp.push(e.key)
            audiotest(keystroke_type)
            //caret blinking animation stop while typing and restarting after delay
            rightbox.classList.remove("blink")
            
            clearTimeout(carettimeout)
            
            carettimeout = setTimeout(() => {
                rightbox.classList.add("blink")
            }, 2000);
            //
            let word = righttext[index]
            
            if(word.startsWith(temp.join(""))){
                slice_index ++;
                updateDisplay(index,slice_index)
                length_correct++;
                txtemp.classList.remove("temp_word")
            }
            else{
                txtemp.classList.add("temp_word")
            }
            
        }
        else if (e.code == "Space" || e.code == "Enter"){
            audiotest(keystroke_type+"_spacebar")
            if(temp.length != 0){
                //creates a span element and add whatever written by the user and appends it to the left 
                let span = document.createElement("span")
                span.textContent = `${temp.join("")}`
                if(temp.join("") == righttext[index]){
                    charectertyped += temp.length
                    console.log(charectertyped)
                    updateWPM();
                }
                else{
                    span.className = "Word_incorrect"
                }
                txtperm.append(span);
                temp = [];
                //shifts the right text for the next word
                index ++;
                slice_index = 0;
                updateDisplay(index,slice_index)
                length_correct = 0;
            }
        }
        else if(e.code == "Backspace"){
            //whatever the user writes slice it
            temp = temp.slice(0,-1);
            audiotest(keystroke_type)
            //
            
            if (temp.length < length_correct){
                slice_index--;
                updateDisplay(index,slice_index)
                length_correct--;
                // txtemp.classList.remove("temp_word")
            }
            else if(temp.length <= length_correct){
                txtemp.classList.remove("temp_word")
            }
        }
        txtemp.textContent = temp.join("")
    }
        
   
})

//default behaviour
// window.onload = ()=>{
    
// }

mainbox.addEventListener("focus",()=>{
    rightbox.classList.add("focus", "blink")
})
mainbox.addEventListener("blur",()=>{
    rightbox.classList.remove("focus")
})

//dark mode
let btn = document.getElementById("darkmode")
btn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-mode")
    if(localStorage.getItem("theme")=="dark"){
        localStorage.setItem("theme","light")
    }
    else{
        localStorage.setItem("theme","dark")
    }
})

// console.log(righttext.split(" ").slice(0).join(" "))

function updateDisplay(index,sliceindex){
    let text = righttext.slice(index).join(" ").slice(sliceindex);
    righttxt.textContent = text
    if (index >= righttext.length) {
        rightbox.classList.remove("focus")
        charectertyped = 0;
        updateWPM()
        getdata();
        resetState();
    }
}

function updateWPM(){
    let wpm = charectertyped/5;
    document.getElementById("wpm_value").textContent = wpm;
}

function resetState() {
    index = 0;
    slice_index = 0;
    length_correct = 0;
    temp = [];
    txtperm.innerHTML = ""; // Clear the left display
    txtemp.textContent = ""; // Clear the user’s temporary input
    charectertyped = 0;
}

//keyboard sound
const soundTypes = {
    creamy:[
        new Audio('Testcreamy_amp.mp3'),
        new Audio('testcreamy2.mp3'),
        // new Audio('testcreamy3_amp.mp3'),
        // new Audio('testcreamy4_amp.mp3'),
        new Audio('testcreamy5_amp.mp3'),    
    ],
    creamy_spacebar:[
        // console.log("spacebar")
        new Audio('Spacebar1.mp3'),    

    ]
}

function audiotest(type){
    const sounds = soundTypes[type];
    if (!sounds) return;
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    sound.currentTime = 0;
    sound.play();
}
//timer
let sec = 60;
let timerinterval;
let timer_element = document.querySelector(".timer")
console.log(timer_element)
function timerstart(){
    let sec_inst = sec;
    //shows the timer ui
    document.getElementById("timer_id").textContent = sec_inst
    timer_element.classList.add("up")
    //
    timerrunning = true;
    timerinterval  = setInterval(() => {
        sec_inst--
        document.getElementById("timer_id").textContent = sec_inst //updates the frontend ui
        if(sec_inst == 0){
            timer_element.classList.remove("up")
            typingallowed = false;
            clearInterval(timerinterval)
            timerrunning = false
            scoredisplay(charectertyped/5,charectertyped)
            getdata()
            resetState()
        }
    }, 1000);
}
//
//displays the scoreboard after the timer reached
function scoredisplay(wpm,cpm){
    document.getElementById("result-wpm").textContent = wpm;
    document.getElementById("result-cpm").textContent = cpm;
    let resultdisplay = document.querySelector(".result");

    resultdisplay.classList.add("show");
    document.querySelector(".result-container").classList.add("pan")
    setTimeout(() => {
        const hideOnSpace = (e) => {
            if (e.code === "Space") {
                resultdisplay.classList.remove("show");
                document.querySelector(".result-container").classList.remove("pan")
                document.removeEventListener("keydown", hideOnSpace);
                typingallowed = true;
            }
        };
        document.addEventListener("keydown", hideOnSpace);
    }, 1000);

}