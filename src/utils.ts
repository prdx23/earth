
import { webgl } from "./engine/webgl"


declare const DEV_CDN_URL: string
declare const PROD_CDN_URL: string


export function loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {

        const image = new Image()
        const baseURL = import.meta.env.PROD ? PROD_CDN_URL : DEV_CDN_URL

        image.src = baseURL + path
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


export function rng(a: number, b: number): number {
    return Math.floor(Math.random() * (Math.floor(b) - Math.ceil(a) + 1) + Math.ceil(a))
}

export function choice<T>(array: Array<T>): T {
    return array[rng(0, array.length - 1)]
}
