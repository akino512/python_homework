const MNavi = () => {
    const element = document.createElement("div");
    element.style.width = "200px"
    element.style.position = "fixed"
    element.style.height = "100vh"
    element.style.background = "var(--gray1)"
    element.style.borderRight = "2px solid var(--gray3)"
    element.style.zIndex = "1"
    element.style.left = 0;
    element.style.top = 0;

    element.style.display = "grid";
    element.style.gridTemplateRows = "auto 100px"

    const menu = MMenu();

    element.appendChild(menu)

    return element
}

const MNaviBack = () => {
    const element = document.createElement("div");
    return element
}