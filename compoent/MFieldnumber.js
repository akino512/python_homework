const MFieldnumber = () => {
    const element = document.createElement("input")
    element.style.height = '40px'
    element.style.width = '150px'
    element.style.fontSize = '20px'
    element.step = ".01"
    element.type = 'number'
    element.onkeyup = () => {
        element.value = parseFloat(element.value).toFixed(2)
    }
    element.onchange = () => {
        if (element.value < 0) {
            element.value = 0
        }
    }
    return element
}