const MRadios = (radioArray) => {
    const element = document.createElement("div")
    element.style.height = '40px'
    element.style.display = 'flex'
    element.bvalue = ''
    Object.defineProperty(element, 'value', {
        set: function (val) {
            if (element.bvalue === val) return
            for (const item of element.children) {
                if (item.value != val)
                    item.style.border = ''
                else
                    item.style.border = '1px solid black'
            }
            element.bvalue = val
            if(this.onchange) this.onchange()
        },
        get: function () {
            return element.bvalue
        }
    });

    for (const radio of radioArray) {
        radio.onclick = () => {
            element.value = radio.value
        }
        element.appendChild(radio)
    }

    element.firstChild.click()
    return element
}