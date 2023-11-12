const MRadio = (name,value) => {
    const element = document.createElement("div")
    element.style.height = '40px'
    element.style.width = '80px'
    element.style.display = 'flex'
    element.style.justifyContent = 'center'
    element.style.alignItems = 'center'
    element.style.cursor = 'pointer'
    element.value = value
    element.name = name
    element.innerHTML = name
    
    return element
}