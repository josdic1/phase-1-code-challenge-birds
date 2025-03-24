const items = [
    {label: "milk", price: 2}, 
    {label: "banana", price: 10}, 
    {label: "ice cubes", price: 1}, 
    {label: "chocolate milk", price: 3}
  ]


  const searchInput = document.getElementById('searchInput')
  const clickButton = document.getElementById('clickButton')
  clickButton.addEventListener('click', onButtonClick)
  
  function onButtonClick() {
    const searchInputValue = searchInput.value.trim().toLowerCase()
    const filteredResult = items.filter(item => (
      item.label.toLowerCase() === searchInputValue
    ))

    if (filteredResult.length > 0) {
      filteredResult.forEach(item => {
        const p = document.createElement('p')
        p.textContent = `${item.label}: ${item.price}`
        clickButton.appendChild(p)
      })
    }
  }

//   function onTextInput(e) {
//     const input = e.target.value
//     console.log(input)
//     debugger
//   }