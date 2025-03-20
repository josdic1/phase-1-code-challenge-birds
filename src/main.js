const birdForm = document.getElementById('bird-form')
const birdList = document.getElementById('bird-list')
const birdName = document.getElementById('bird-name')
const birdColor = document.getElementById('bird-color')
const birdDate = document.getElementById('bird-date')
const submit = document.getElementById('submit')

let inEditMode = false

let birds = []

let formData = {
  name: '',
  color: '',
  date: ''
}

let selectedItem = {
  id: '',
  name: '',
  color: '',
  date: ''
}

const init = () => {


  birdDate.value = "";
  fetchBirds()

}



document.getElementById("search").addEventListener("input", filterBirds);

function filterBirds(e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredBirds = birds.filter(bird => bird.name.toLowerCase().includes(searchTerm));
  renderList(filteredBirds);
}

document.getElementById("sort").addEventListener("change", sortBirds);

function sortBirds(e) {
  let sortedBirds = [...birds];

  if (e.target.value === "name") {
    sortedBirds.sort((a, b) => a.name.localeCompare(b.name));
  } else if (e.target.value === "color") {
    sortedBirds.sort((a, b) => a.color.localeCompare(b.color));
  }

  renderList(sortedBirds);
}

function renderList(data) {
  const birdData = data.map(item => (
    `<div id=${item.id}><li>${item.color} ${item.name} Seen on ${item.date_seen}</li>
     <button type='button' id=${item.id} class='edit-button' style="background-color: orange">Edit</button>
    <button type='button' id=${item.id}  class='delete-button' style="background-color: red">Delete</button>
    </div>`
  ))

  birdList.innerHTML = birdData.join('')

 document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', editBirdItem)
  })

  document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', deleteBirdItem)
  })

}

submit.addEventListener('click', submitClick)

function editBirdItem(e) {
  inEditMode =  true
  submit.textContent = 'Update'
  const { id } = e.target
  const itemToUpdate = birds.find(bird => bird.id === id)
  selectedItem = itemToUpdate
  birdName.value = itemToUpdate.name
  birdColor.value = itemToUpdate.color
  birdDate.value = itemToUpdate.date_seen 
  ? new Date(itemToUpdate.date_seen).toISOString().split("T")[0] 
  : "";
}


function submitClick(e) {
  if(inEditMode) {
    e.preventDefault()
  let payload = {
      ...selectedItem,
      name: birdName.value,
      color: birdColor.value,
      date_seen: birdDate.value
    }
    updateItem(payload)
    return
  } else {
    let payload = {
      name: birdName.value,
      color: birdColor.value,
      date_seen: birdDate.value
    }
    addItem(payload)

  }
  
}





function deleteBirdItem(e) {
  const { id } = e.target
  deleteItem(id)
}

async function fetchBirds() {
  try {
    const r = await fetch(`http://localhost:3000/birds`)
    if(!r.ok) {
      throw new Error(`BAD FETCH: ${r.status}`);
    }
    const data = await r.json()
    birds = data
    renderList(data)

  }catch(error) { console.error(error.message) }
}

async function addItem(bird) {
  try {
    const r = await fetch(`http://localhost:3000/birds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bird)
    })
    if(!r.ok) {
      throw new Error(`BAD POST: ${r.status}`);
    }
    const data = await r.json()
    const updatedList = [...birds, data]
    birds = updatedList
    renderList(updatedList)
    clearForm()
  }catch(error) { console.error(error.message) }
}

async function deleteItem(id) {
  try {
    const r = await fetch(`http://localhost:3000/birds/${id}`, {
      method: 'DELETE'
    })
    if(!r.ok) {
      throw new Error(`BAD DELETE: ${r.status}`);
    }
    const updatedList = birds.filter(bird => bird.id !== id);
    birds = updatedList;  
    renderList(updatedList);
  }catch(error) { console.error(error.message) }
}

async function updateItem(bird) {
  try {
    const r = await fetch(`http://localhost:3000/birds/${bird.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bird)
    })
    if(!r.ok) {
      throw new Error(`BAD PATCH: ${r.status}`);
    }
    const data = await r.json()
    const updatedList = birds.map(bird => bird.id === data.id ? data : bird)
    birds = updatedList;
    clearForm(); 
    renderList(updatedList);
  }catch(error) { console.error(error.message) }
}

const clearForm = () => {
  inEditMode = false
  submit.textContent = "Add Bird"; 
  birdName.value = ""
  birdColor.value = ""
  birdDate.value = ""
}

window.addEventListener("DOMContentLoaded", init)