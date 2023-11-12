GLOBAL.sections.push({
    title: "设置",
    read: function () {
        const element = document.createElement("div")
        element.style.padding = '20px'
        const shutdown = () => {
            fetch("/shutdown", {
                method: "POST",
            })
        }
        const bShutdown = MButton('关机')
        bShutdown.onclick = shutdown
        element.appendChild(bShutdown)
        return element
    },
})