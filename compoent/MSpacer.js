const MSpacer = (height,width) => {
    const element = document.createElement("div")
    element.style.height = height ? height : '0'
    element.style.width = width ? width : '0'
    return element
}