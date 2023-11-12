GLOBAL.tool = {
    name: "Python小账本",
    get dir(){
      return `tool`
    },
    read: function () {
        const srcArr = [
            `./${this.dir}/section/Section1.js`,
            `./${this.dir}/section/Section2.js`,
        ]
        for (const src of srcArr) {
            TOOL.addScript(src)
        }
    },
}
