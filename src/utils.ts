import { webgl } from "./engine/webgl"



export function loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
        const image = new Image()
        image.src = path
        image.addEventListener('load', () => {
            webgl.loading.progress += 3
            webgl.updateLoading()
            resolve(image)
        })
    })
}
