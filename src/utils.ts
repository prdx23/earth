import { webgl } from "./engine/webgl"



export function loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {

        const image = new Image()

        image.src = path
        image.addEventListener('load', () => {
            webgl.loading.progress += 2
            webgl.updateLoading()
            resolve(image)
        })

        image.addEventListener('error', (event) => {
            console.error(`Error: loading image ${path} failed`)
            reject(event)
        })

    })
}
