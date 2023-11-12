const MText = (str,size) => {
    const element = document.createElement("div")
    element.style.fontSize = size
    element.style.lineHeight = size
    element.style.display = 'flex'
    element.style.justifyContent = 'center'
    element.style.alignItems = 'center'
    element.bvalue = ''
    const span = document.createElement("span")
    Object.defineProperty(element, 'value', {
        set: function (val) {
            if (element.bvalue === val) return
            span.innerText = str
            element.bvalue = val
        },
        get: function () {
            return element.bvalue
        }
    });
    element.appendChild(span)
    element.value = str
    return element
}