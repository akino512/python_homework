const MToolcase = (tools) => {
    const element = document.createElement("div")
    element.style.background = 'var(--gray2)'
    element.style.width = '100%'
    element.style.minHeight = '100vh'
    element.style.display = 'flex'

    const box = document.createElement("div")
    box.style.width = '800px'
    box.style.height = '400px'
    box.style.margin = 'auto'
    box.style.padding = '20px'
    box.style.background = '#f2f3f4'
    box.style.borderColor = "#e5e5e5 #dbdbdb #d2d2d2"
    box.style.boxShadow = "2px 2px 2px rgb(0,0,0,.3)"

    for (const tool of tools) {
        const row = document.createElement("div")
        row.style.display = "flex"

        const name = document.createElement("a")
        name.innerText = `${tool.name}`
        name.style.cursor = "pointer"
        name.style.display = "block"
        name.style.flexBasis = "45%"
        name.onclick = function () {
            GLOBAL.reload(tool.id)
        }

        row.appendChild(name)
        box.appendChild(row)
    }

    element.appendChild(box)
    return element
}