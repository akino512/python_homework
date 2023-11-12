(() => {
    const dir = 'compoent'
    const srcArr = [
        `./${dir}/MButton.js`,
        `./${dir}/MContent.js`,
        `./${dir}/MDateselector.js`,
        `./${dir}/MFieldnumber.js`,
        `./${dir}/MFieldtext.js`,
        `./${dir}/MGriditem.js`,
        `./${dir}/MGridtext.js`,
        `./${dir}/MMenu.js`,
        `./${dir}/MNavi.js`,
        `./${dir}/MRadio.js`,
        `./${dir}/MRadios.js`,
        `./${dir}/MSpacer.js`,
        `./${dir}/MText.js`,
        `./${dir}/MTool.js`,
        `./${dir}/MToolcase.js`,
    ]
    for (const src of srcArr) {
        TOOL.addScript(src)
    }
})()