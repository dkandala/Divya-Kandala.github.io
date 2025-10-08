
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const event1 = document.querySelector('.event1');
const eventBoxes = document.querySelectorAll(".event-box");

const small_txt = document.querySelector('#small-text');
const med_txt = document.querySelector('#med-text');
const large_txt = document.querySelector('#large-text');
const clear_txt = document.querySelector('#clear-preferences');

let category = ""
let color_changed = false
var menu_shown = false;

function showMenu(){
    var shown=navMenu.classList.toggle("show");
    navMenu.classList.toggle("hide");

    if (shown) {
        navToggle.setAttribute("aria-expanded", "true");
    }

    else {
        navToggle.setAttribute("aria-expanded", "false");
    }
}

function changeBgCol(event){
  if (event.key == "c") {
    if (color_changed == false){
      event1.style.backgroundColor = "#79B6F6";
      color_changed = true;
    }
    else {
      event1.style.backgroundColor = "cornflowerblue";
      color_changed = false;
    }
  }
}


function handleKeyFilter(e) {
  // if u is pressed then show upcoming events 
  if (e.key === "u") category = "Upcoming-Events";
  // if p is pressed only past events show 
  else if (e.key === "p") category = "Past-Events";
  // if any key is pressed other than "p" or "u" then default to all events 
  else category = "All"; 

  
  eventBoxes.forEach(box => {
    const match = category === "All" || box.dataset.category === category;
    // hide the boxes if they don't match
    box.style.display = match ? "block" : "none";
  });
}


document.addEventListener("keydown", handleKeyFilter);


function set_text_size() {
    if (localStorage.getItem("fontSize")!== null){
        let temp_size = localStorage.getItem("fontSize");
        document.querySelector("html").style.fontSize = String(temp_size)+"px";
    }
}

function change_text_size(size) {
    let temp_size = size*16;
    document.querySelector('html').style.fontSize = String(temp_size) +"px";
    localStorage.setItem("fontSize",temp_size);
    console.log("works")
}

function clear_local_storage(size) {
    let temp_size = size*16;
    
    localStorage.clear();
    document.querySelector('html').style.fontSize = String(temp_size) + "px";
}

document.addEventListener("keydown", handleKeyFilter);
addEventListener("keydown", (event) => {changeBgCol(event)});
/* navToggle.addEventListener("click", showMenu); */

window.addEventListener('load',set_text_size);

small_txt.addEventListener('click', () => {change_text_size(0.75)});
med_txt.addEventListener('click', () => {change_text_size(1)});
large_txt.addEventListener('click', () => {change_text_size(1.5)});
clear_txt.addEventListener('click', () => {clear_local_storage(1)});


