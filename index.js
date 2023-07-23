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

const textToPrint = "GAURAV PATHAK";
const interval = 1000; // 1000 milliseconds = 1 second

function printLetterByLetter() {
  const h1Element = document.getElementById("value");
  let currentText = h1Element.textContent;
  const nextLetter = textToPrint[currentText.length];

  if (nextLetter) {
    currentText += nextLetter;
    h1Element.textContent = currentText;
    setTimeout(printLetterByLetter, interval);
  }
  printLetterByLetter();
}