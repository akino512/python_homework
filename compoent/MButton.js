const MButton = (t) => {
    const element = document.createElement("div")
    element.style.height = '40px'
    element.style.width = '60px'
    element.style.background = 'gray'
    element.style.color = 'white'
    element.style.display = 'flex'
    element.style.cursor = 'pointer'

    const text = document.createElement("span")
    text.style.margin = 'auto'
    text.innerText = t
    
    element.appendChild(text)
    return element
}