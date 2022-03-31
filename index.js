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
                    const { id, code, lat, lon, label } = tile

                    const rect = document.createElementNS(xmlns, 'rect')
                    rect.setAttributeNS(null, 'width', size - gap)
                    rect.setAttributeNS(null, 'height', size - gap)
                    rect.setAttributeNS(null, 'x', lon * size)
                    rect.setAttributeNS(null, 'y', lat * size)
                    rect.setAttributeNS(null, 'fill', '#eee')

                    const text = document.createElementNS(xmlns, 'text')
                    text.setAttributeNS(null, 'x', lon * size + size / 2 - gap / 2)
                    text.setAttributeNS(null, 'y', lat * size + size / 5 * 3 - gap / 2)
                    text.textContent = label

                    const region = document.createElementNS(xmlns, 'g')
                    region.setAttributeNS(null, 'text-anchor', 'middle')
                    region.setAttributeNS(null, 'font-family', 'sans-serif')
                    region.setAttributeNS(null, 'font-size', size / 4)
                    region.dataset.id = id
                    region.dataset.code = code
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

    const start = async url => {
        try {
            const response = await fetch(url)
            const json = await response.json()
            const result = await tilemap(json)

            const body = document.querySelector('body')
            body.appendChild(result)

        } catch (error) {
            console.error(error)
        }
    }

    start('tilemap.json')
})()
