
import './main.css'
import { init } from './render'


init()


document.getElementById('controls-btn')!.addEventListener('click', () => {
    document.getElementById('controls')!.classList.remove('fade-out')
    setTimeout(() => {
        document.getElementById('controls')!.classList.add('fade-out')
    }, 5000)
})


document.getElementById('about-btn')!.addEventListener('click', () => {
    document.getElementById('about')!.style.display = 'block'
})

document.getElementById('close-about-btn')!.addEventListener('click', () => {
    document.getElementById('about')!.style.display = 'none'
})
