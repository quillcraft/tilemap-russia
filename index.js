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

    const handlerMove = popup => {
        return event => {
            const { id, code, county, region } = event.target.dataset

            const params = popup.getBoundingClientRect()
            const x = Math.floor(event.x - params.width / 2)
            const y = Math.floor(event.pageY - params.height - 10)

            popup.style.transform = `translate(${x}px, ${y}px)`
            popup.innerHTML = 
                `<ul>
                    <li>id: ${id}</li>
                    <li>code: ${code}</li>
                    <li>county: ${county}</li>
                    <li>region: ${region}</li>
                </ul>`
        }
    }

    const handlerOver = (result, popup) => {
        return event => {
            if (event.target.classList.contains('region')) {
                popup.classList.add('active')
                result.addEventListener('mousemove', handlerMove(popup), false)
            }
        }
    }

    const handlerOut = (result, popup) => {
        return () => {
            popup.classList.remove('active')
            result.removeEventListener('mousemove', handlerMove(popup), false)
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

            result.addEventListener('mouseover', handlerOver(result, popup), false)
            result.addEventListener('mouseout', handlerOut(result, popup), false)

        } catch (error) {
            console.error(error)
        }
    }

    start('tilemap.json')
})()
