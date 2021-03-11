//Empty arries to store data
let cityInformation = [];
let storedData = [];

//Excutation of functions
fetchInformation();
showInfromation();
selectInformation();

//Fetch API data
async function fetchInformation() {
  const response = await fetch("https://avancera.app/cities/");
  let myData = await response.json();
  cityInformation.push(myData);
}

//Function to display API data
async function showInfromation() {
  await fetchInformation();
  for (i = 0; i < cityInformation[0].length; i++) {
    let newDiv = document.createElement("div");
    newDiv.innerHTML =
      "ID: " +
      cityInformation[0][i].id +
      " Name: " +
      cityInformation[0][i].name +
      " Population: " +
      cityInformation[0][i].population;

    newDiv.setAttribute("id", "showInformationBox");

    let currentDiv = document.getElementById("container");
    document.body.insertBefore(newDiv, currentDiv);
  }
}

//Post information function
//Post ID
let currentDiv = document.getElementById("enterID");
let inputID = document.createElement("input");
inputID.setAttribute("type", "text");
inputID.setAttribute("id", "inputID");
inputID.setAttribute("value", " ");
inputID.required = "true";
currentDiv.appendChild(inputID);

//Post name
let inputName = document.createElement("input");
let currentDiv1 = document.getElementById("enterName");
inputName.setAttribute("type", "text");
inputName.setAttribute("value", " ");
inputName.required = "true";
currentDiv1.appendChild(inputName);

//Post population
let inputPopulation = document.createElement("input");
let currentDiv2 = document.getElementById("enterPopulation");
inputPopulation.setAttribute("type", "text");
inputPopulation.setAttribute("value", " ");
inputPopulation.required = "true";
currentDiv2.appendChild(inputPopulation);

//Function of post information
function postInfromation() {
  fetch("https://avancera.app/cities/", {
    body: JSON.stringify({
      id: inputID.value,
      name: inputName.value,
      population: inputPopulation.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  //data local store, after the post function
  localStorage.setItem("x", inputID.value);
}

//Local web storage data
inputID.value = localStorage.getItem("x");
let postElement = document.getElementById("postButton");
postElement.addEventListener("click", postInfromation);

//Page refresh function
function refreshPage() {
  window.location.reload();
}
let refreshElement = document.getElementById("refreshButton");
refreshElement.addEventListener("click", refreshPage);

//Drop-down list to show current id of cities, and enble the selection
async function selectInformation() {
  await fetchInformation();
  let editDiv = document.getElementById("editSelectID");
  let deleteDiv = document.getElementById("deleteSelectID");
  let Select1 = document.createElement("select");
  let Select2 = document.createElement("select");
  Select1.setAttribute("id", "editOptions");
  Select2.setAttribute("id", "deleteOptions");
  for (i = 0; i < cityInformation[0].length; i++) {
    let selectOption1 = document.createElement("option");
    selectOption1.setAttribute("value", cityInformation[0][i].id);
    selectOption1.innerHTML = cityInformation[0][i].id;
    Select1.appendChild(selectOption1);
    let selectOption2 = document.createElement("option");
    selectOption2.setAttribute("value", cityInformation[0][i].id);
    selectOption2.innerHTML = cityInformation[0][i].id;
    Select2.appendChild(selectOption2);
  }
  editDiv.appendChild(Select1);
  deleteDiv.appendChild(Select2);
}

//Edit and delete part
let editInputName = document.createElement("input");
let editDiv1 = document.getElementById("editEnterName");
editInputName.setAttribute("type", "text");
editInputName.setAttribute("value", " ");
editInputName.required = "true";
editDiv1.appendChild(editInputName);

let editInputPopulation = document.createElement("input");
let editDiv2 = document.getElementById("editEnterPopulation");
editInputPopulation.setAttribute("type", "text");
editInputPopulation.setAttribute("value", " ");
editInputPopulation.required = "true";
editDiv2.appendChild(editInputPopulation);

function editInformation() {
  fetch(
    "https://avancera.app/cities/" +
      document.getElementById("editOptions").value,
    {
      body: JSON.stringify({
        name: editInputName.value,
        population: editInputPopulation.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    }
  );
}
let editElement = document.getElementById("editButton");
editElement.addEventListener("click", editInformation);

function deleteInformation() {
  fetch(
    "https://avancera.app/cities/" +
      document.getElementById("deleteOptions").value,
    {
      method: "DELETE",
    }
  );
}
let deleteElement = document.getElementById("deleteButton");
deleteElement.addEventListener("click", deleteInformation);
