import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './tailwind.css'
import './styles/tree.css'

console.log('Starting OSINT Framework...')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')

console.log('OSINT Framework started!')
