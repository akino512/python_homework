GLOBAL.sections.push({
    title: "交易历史",
    financial(x) {
        return Number.parseFloat(x / 100).toFixed(2);
    },
    newChart(className, tit) {
        const element = document.createElement("figure")
        element.classList.add('pie-chart')
        element.classList.add(className)
        const title = document.createElement("h2")
        title.innerText = tit
        const cite = document.createElement('cite')
        const nodata = document.createElement("div")
        nodata.style.position = 'absolute'
        nodata.style.display = 'flex'
        nodata.style.width = '100%'
        nodata.style.height = '100%'
        nodata.style.justifyContent = 'center'
        nodata.style.alignItems = 'center'
        nodata.innerText = 'NO DATA'
        const figcaption = document.createElement('figcaption')
        figcaption.style.textAlign = 'right'
        element.appendChild(title)
        element.appendChild(figcaption)
        element.appendChild(cite)
        element.appendChild(nodata)
        element.set = (chart, date_from, date_to) => {
            if (element.preStyle) element.preStyle.remove()
            cite.innerText = `
            ${date_from == STATIC.MIN_DATE ? '' : date_from + ' ~ '}
            ${date_to == STATIC.MAX_DATE ? '' : ' ~ ' + date_to}`
            figcaption.innerHTML = ''
            let conic_gradient = ''
            let conic_pointer = 0
            if (chart.items.length == 0) {
                nodata.style.display = 'flex'
                return
            }
            nodata.style.display = 'none'
            for (const idx in chart.items) {
                const item = chart.items[idx]
                figcaption.innerHTML += `<span style="color:${item.color}">${item.desc}</span><b>　${TOOL.financial(item.money)}</b><b>　${item.share.toFixed(2)}%</b>`
                conic_gradient += idx == chart.items.length - 1
                    ? `${item.color} 0,\n${item.color} 100%`
                    : `${item.color} 0,\n${item.color} ${conic_pointer += item.share}%,\n`
            }
            figcaption.innerHTML += `<b>合计：</b><b>　${TOOL.financial(chart.total)}</b><b>　-</b>`
            const style = document.createElement("style")
            style.innerHTML = `
            .${className} {
                background:
                    radial-gradient(
                        circle closest-side,
                        transparent 66%,
                        white 0
                    ),
                    conic-gradient(
                        ${conic_gradient}
                    )
            }`
            document.body.appendChild(style)
            element.preStyle = style
        }
        return element
    },

    dialogConclusion: function () {
        const element = document.createElement("dialog")
        element.style.margin = 'auto'
        const info = document.createElement('div')
        info.style.padding = '20px 0'
        const bOk = MButton('知道了')
        bOk.style.margin = 'auto'
        bOk.onclick = function () {
            element.close()
        }
        const chartBox = document.createElement("div")
        chartBox.style.display = 'flex'
        const chart1 = this.newChart('chart1', '收入')
        const chart2 = this.newChart('chart2', '支出')
        chartBox.appendChild(chart1)
        chartBox.appendChild(chart2)
        element.appendChild(chartBox)
        element.appendChild(info)
        element.appendChild(bOk)
        element.set = (conc, params) => {
            chart1.set(conc.chart1, params.date_from, params.date_to)
            chart2.set(conc.chart2, params.date_from, params.date_to)
            info.innerHTML = ''
            info.innerHTML += `<p>结余：${TOOL.financial(conc.balance)}</p>`
            info.innerHTML += `<p>${conc.chart1.most}</p>`
            info.innerHTML += `<p>${conc.chart2.most}</p>`
        }
        return element
    },
    dialogHistoryAdd: function (reload) {
        const params = {
            get date() { return iDate.value },
            get money() { return iMoney.value * 100 },
            get type() { return iType.value },
            get desc() { return this.type == 1 ? iDesc1.value : iDesc2.value }
        }
        const element = document.createElement("dialog")
        element.style.margin = 'auto'
        const content = document.createElement("div")
        content.style.display = 'flex'
        content.style.flexDirection = 'column'
        content.style.padding = '10px'
        content.style.width = 'fit-content'

        const row1 = document.createElement("div")
        row1.style.display = 'flex'
        const row2 = document.createElement("div")
        row2.style.display = 'flex'
        const row3 = document.createElement("div")
        row3.style.display = 'flex'
        const row4 = document.createElement("div")
        row4.style.display = 'flex'

        const tDate = MText('日期：', '20px')
        const iDate = MDateselector()

        const tMoney = MText('金额：', '20px')
        const iMoney = MFieldnumber()

        const tDesc = MText('描述：', '20px')
        const iDesc1 = MRadios(
            [
                MRadio('薪水', '薪水'),
                MRadio('奖金', '奖金'),
                MRadio('理财', '理财'),
                MRadio('其他', '其他'),
            ])
        const iDesc2 = MRadios(
            [
                MRadio('交通', '交通'),
                MRadio('饮食', '饮食'),
                MRadio('娱乐', '娱乐'),
                MRadio('其他', '其他'),
            ])
        iDesc1.style.display = 'none'
        iDesc2.style.display = 'none'

        const tType = MText('收支：', '20px')
        const r1 = MRadio('收入', 1)
        const r2 = MRadio('支出', -1)
        r1.addEventListener('click', () => {
            iDesc1.style.display = 'flex'
            iDesc2.style.display = 'none'
        })
        r2.addEventListener('click', () => {
            iDesc1.style.display = 'none'
            iDesc2.style.display = 'flex'
        })
        const iType = MRadios([r1, r2])

        const buttonBox = document.createElement("div")
        buttonBox.style.display = 'flex'
        buttonBox.style.justifyContent = 'space-around'
        const bOk = MButton('确定')
        const bCancel = MButton('取消')

        bOk.onclick = () => {
            if (iDate.value === '') {
                alert('请输入必须项')
                iDate.focus()
                return
            } else if (iMoney.value === '') {
                alert('请输入必须项')
                iMoney.focus()
                return
            }
            fetch("/history_add", {
                method: "POST",
                body: JSON.stringify(params)
            }).finally(() => {
                element.close()
                reload()
            })
        }
        bCancel.onclick = () => {
            element.close()
        }

        row1.appendChild(tDate)
        row1.appendChild(iDate)
        row2.appendChild(tMoney)
        row2.appendChild(iMoney)
        row3.appendChild(tType)
        row3.appendChild(iType)
        row4.appendChild(tDesc)
        row4.appendChild(iDesc1)
        row4.appendChild(iDesc2)
        buttonBox.appendChild(bOk)
        buttonBox.appendChild(bCancel)

        content.appendChild(row1)
        content.appendChild(MSpacer('10px'))
        content.appendChild(row2)
        content.appendChild(MSpacer('10px'))
        content.appendChild(row3)
        content.appendChild(MSpacer('10px'))
        content.appendChild(row4)
        content.appendChild(MSpacer('20px'))
        content.appendChild(buttonBox)
        element.appendChild(content)
        return element
    },
    read: function () {
        const params = {
            get date_from() { return iDateFrom.value == '' ? STATIC.MIN_DATE : iDateFrom.value },
            get date_to() { return iDateTo.value == '' ? STATIC.MAX_DATE : iDateTo.value },
            get type() { return iType.value }
        }
        const element = document.createElement("div")
        element.style.padding = '20px'

        const header = document.createElement("div")
        header.style.width = '800px'
        header.style.display = 'flex'
        header.style.justifyContent = 'space-between'
        const headerLeft = document.createElement("div")
        const headerRight = document.createElement("div")
        headerRight.style.display = 'flex'


        const headerLeft1 = document.createElement("div")
        headerLeft1.style.display = 'flex'
        const headerLeft2 = document.createElement("div")
        headerLeft2.style.display = 'flex'

        const tDate = MText('日期：', '20px')
        const iDateFrom = MDateselector()
        const tDateA = MText('　~　', '20px')
        const iDateTo = MDateselector()

        const tType = MText('收支：', '20px')

        const iType = MRadios([MRadio('所有', 0), MRadio('收入', 1), MRadio('支出', -1)])

        const bGen = MButton('随机\n生成')
        bGen.style.height = '100%'

        const bConc = MButton('收支\n分析')
        bConc.style.height = '100%'

        const bAdd = MButton('添加\n记录')
        bAdd.style.height = '100%'

        const footer = document.createElement("div")
        footer.style.width = '800px'
        footer.style.display = 'flex'
        footer.style.justifyContent = 'start'

        const gridTitle = document.createElement("div")
        gridTitle.style.marginTop = '20px'
        gridTitle.style.display = 'grid'
        gridTitle.style.width = 'fit-content'
        gridTitle.style.height = 'fit-content'
        gridTitle.style.gridTemplateColumns = '120px 120px 120px 120px 120px 200px'
        gridTitle.style.border = '1px solid gray'
        gridTitle.appendChild(MGridtext('ID', true))
        gridTitle.appendChild(MGridtext('日期', true))
        gridTitle.appendChild(MGridtext('金额', true))
        gridTitle.appendChild(MGridtext('收支', true))
        gridTitle.appendChild(MGridtext('描述', true))
        gridTitle.appendChild(MGridtext('操作', true))

        const gridContent = document.createElement("div")
        gridContent.style.display = 'grid'
        gridContent.style.width = 'fit-content'
        gridContent.style.height = 'fit-content'
        gridContent.style.gridTemplateColumns = '120px 120px 120px 120px 120px 200px'
        gridContent.style.border = '1px solid gray'

        const historyDelete = async (id) => {
            await fetch("/history_delete", {
                method: "POST",
                body: JSON.stringify({
                    id: id
                })
            })
            historyReload()
        }
        const historyReload = async () => {
            const response = await fetch("/history_query", {
                method: "POST",
                body: JSON.stringify(params)
            })
            gridContent.innerText = ''
            const list = await response.json()
            for (const item of list) {
                gridContent.appendChild(MGridtext(item.id))
                gridContent.appendChild(MGridtext(item.date))
                gridContent.appendChild(MGridtext(this.financial(item.money)))
                gridContent.appendChild(MGridtext(item.type == 1 ? '收入' : '支出', false, item.type == 1 ? '#009900' : '#CC3333'))
                gridContent.appendChild(MGridtext(item.desc))
                const del = document.createElement('a')
                del.style.cursor = 'pointer'
                del.innerText = '删除'
                del.onclick = () => { historyDelete(item.id) }
                gridContent.appendChild(MGriditem(del))
            }
        }
        const historyConclusion = async () => {
            const response = await fetch("/history_conclusion", {
                method: "POST",
                body: JSON.stringify(params)
            })
            return await response.json()
        }
        const historyGenerate = async () => {
            const response = await fetch("/history_generate", {
                method: "POST",
                body: JSON.stringify({})
            })
        }

        iDateFrom.onchange = () => {
            historyReload()
        }
        iDateTo.onchange = () => {
            historyReload()
        }
        iType.onchange = () => {
            historyReload()
        }
        bGen.onclick = async () => {
            await historyGenerate()
            historyReload()
        }
        bConc.onclick = async () => {
            iType.value = 0
            const conc = await historyConclusion()
            dialogConclusion.set(conc, params)
            dialogConclusion.showModal()
        }
        bAdd.onclick = () => {
            dialogHistoryAdd.showModal()
        }

        headerLeft1.appendChild(tDate)
        headerLeft1.appendChild(iDateFrom)
        headerLeft1.appendChild(tDateA)
        headerLeft1.appendChild(iDateTo)

        headerLeft2.appendChild(tType)
        headerLeft2.appendChild(iType)

        headerLeft.appendChild(headerLeft1)
        headerLeft.appendChild(MSpacer('10px'))
        headerLeft.appendChild(headerLeft2)

        headerRight.appendChild(bGen)
        headerRight.appendChild(MSpacer(undefined, '10px'))
        headerRight.appendChild(bConc)
        headerRight.appendChild(MSpacer(undefined, '10px'))
        headerRight.appendChild(bAdd)
        header.appendChild(headerLeft)
        header.appendChild(headerRight)

        // footer.appendChild(tSum)
        // footer.appendChild(iSum)

        element.appendChild(header)
        element.appendChild(gridTitle)
        element.appendChild(gridContent)
        element.appendChild(MSpacer('10px'))
        element.appendChild(footer)
        const dialogHistoryAdd = this.dialogHistoryAdd(historyReload)
        const dialogConclusion = this.dialogConclusion()
        element.appendChild(dialogHistoryAdd)
        element.appendChild(dialogConclusion)

        historyReload()
        return element
    },
})