const MTool = () => {
    const element = document.createElement("div")
    element.style.display = "grid"
    element.style.gridTemplateColumns = "200px auto"
    element.style.width = "100%"
    element.style.minHeight = "100vh"
    const navi = MNavi()
    const naviBack = MNaviBack()
    const content = MContent()

    element.appendChild(navi)
    element.appendChild(naviBack)
    element.appendChild(content)

    return element
}