const MGridtext = (str,bold,color) => {
    const element = document.createElement('span')
    element.style.color = color
    element.innerText = str
    if(bold){
        element.style.fontWeight = 'bold'
    }
    return MGriditem(element)
}