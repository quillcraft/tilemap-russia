(function() {
    const tilemap = json => {
        return new Promise((resolve, reject) => {
            try {
                const xmlns = 'http://www.w3.org/2000/svg'
                const size = 50
                const gap = 2

                const svg = document.createElementNS(xmlns, 'svg')
                svg.setAttributeNS(null, 'viewbox', `0 0 ${size * 17} ${size * 10}`)
                svg.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet')

                json.forEach(tile => {
                    const { id, code, lat, lon, label, name_ru, county_ru } = tile

                    const rect = document.createElementNS(xmlns, 'rect')
                    rect.setAttributeNS(null, 'width', size - gap)
                    rect.setAttributeNS(null, 'height', size - gap)
                    rect.setAttributeNS(null, 'fill', '#eee')
                    rect.classList.add('region')
                    rect.dataset.id = id
                    rect.dataset.code = code
                    rect.dataset.region = name_ru
                    rect.dataset.county = county_ru

                    const text = document.createElementNS(xmlns, 'text')
                    text.setAttributeNS(null, 'x', size / 2 - gap / 2)
                    text.setAttributeNS(null, 'y', size / 5 * 3 - gap / 2)
                    text.textContent = label

                    const region = document.createElementNS(xmlns, 'g')
                    region.setAttributeNS(null, 'transform', `matrix(1 0 0 1 ${lon * size} ${lat * size})`)
                    region.setAttributeNS(null, 'text-anchor', 'middle')
                    region.setAttributeNS(null, 'font-family', 'sans-serif')
                    region.setAttributeNS(null, 'font-size', size / 4)
                    region.appendChild(rect)
                    region.appendChild(text)

                    svg.appendChild(region)
                })

                resolve(svg)

            } catch (error) {
                reject(error)
            }
        })
    }

    const getList = dataset => {
        let listItems = ''

        for (key in dataset) {
            listItems += `<li><span>${key}</span>: <span>${dataset[key]}</span></li>`
        }

        return `<ul>${listItems}</ul>`
    }

    const handlerOver = popup => {
        return event => {
            if (!event.target.classList.contains('region')) return

            popup.innerHTML = getList(event.target.dataset)

            const popupRect = popup.getBoundingClientRect()
            const regionRect = event.target.getBoundingClientRect()

            const x = regionRect.left
            const y = regionRect.top - popupRect.height

            popup.style.transform = `translate(${x}px, ${y}px)`
            popup.classList.add('active')
        }
    }

    const handlerOut = popup => {
        return () => {
            popup.classList.remove('active')
        }
    }

    const start = async url => {
        try {
            const response = await fetch(url)
            const json = await response.json()
            const result = await tilemap(json)

            const popup = document.createElement('div')
            popup.classList.add('popup')

            const body = document.querySelector('body')
            body.appendChild(result)
            body.appendChild(popup)

            result.addEventListener('mouseover', handlerOver(popup), false)
            result.addEventListener('mouseout', handlerOut(popup), false)

        } catch (error) {
            console.error(error)
        }
    }

    start('tilemap.json')
})()
