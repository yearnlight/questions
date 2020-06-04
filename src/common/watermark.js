'use strict'

let watermark = {}

let setWatermark = (str, containerId) => {
    let id = '1.23452384164.123412415'
    let quality = 0.2;//压缩率
    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    let can = document.createElement('canvas')
    can.width = 200
    can.height = 180

    let cans = can.getContext('2d')
    cans.rotate(-20 * Math.PI / 180)
    cans.font = '20px Vedana'
    cans.fillStyle = 'rgba(200, 200, 200, 0.20)'
    cans.textAlign = 'left'
    cans.textBaseline = 'Middle'
    cans.fillText(str, can.width / 3, can.height / 2)

    let div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '100px'
    div.style.left = '20px'
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.position = 'absolute'
    //div.style.zIndex = '999'
    div.style.width = document.getElementById(containerId).offsetWidth - 100 + 'px'
    div.style.height = document.getElementById(containerId).offsetHeight - 100 + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png',quality) + ') left top repeat'
    document.getElementById(containerId).appendChild(div)
    return id;
}

// 该方法只允许调用一次
watermark.set = (str, containerId) => {
    
    let id = setWatermark(str, containerId);
    // window.onresize = () => {
    //     setWatermark(str, containerId)
    // }
}

export default watermark;