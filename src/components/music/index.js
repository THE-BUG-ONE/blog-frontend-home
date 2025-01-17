import { createApp } from 'vue'
import Index from './music.vue'
// const ByMusic = {
//     vm: null,
//     create(options) {
//         if (!this.vm) {
//             const app = createApp(Index, {
//                 options: options
//             })
//             const mountNode = document.createElement('div')
//             document.body.appendChild(mountNode)
//             this.vm = app.mount(mountNode)
//         }
//         return this.vm
//     }
// }
const app = createApp(Index)
const mountNode = document.createElement('div')
document.body.appendChild(mountNode)
const ByMusic = app.mount(mountNode)
export default ByMusic