function myFunction() {
  var x = document.getElementById("myNavbar");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
}

function addContent(button) {
  const liElement = button.parentNode;
  liElement.classList.add("li-expanded");
}

function removeContent(button){
  const liElement = button.parentNode.parentNode;
  liElement.classList.remove("li-expanded");
}

// Hero section
const textToPrint = "I AM GAURAV PATHAK";
const interval = 500;
const restartDelay = 1000;

function printLetterByLetter(index) {
  const h1Element = document.getElementById("myName");
  const currentText = textToPrint.substring(0, index);
  h1Element.textContent = currentText;

  if (index < textToPrint.length) {
    setTimeout(function () {
      printLetterByLetter(index + 1);
    }, interval);
  } else {
    
    setTimeout(function () {
      printLetterByLetter(0);
    }, restartDelay);
  }
}

window.onload = function () {
  printLetterByLetter(0);
};