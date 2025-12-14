import './assets/css/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import * as DB from './data/db'
import * as DefaultImporter from './data/default_importer'

async function startApp(): Promise<void> {
  await DB.openDB()
  DefaultImporter.run()
  createApp(App).mount('#app')
}

startApp()
