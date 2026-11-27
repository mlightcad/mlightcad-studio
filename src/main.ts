import 'element-plus/dist/index.css'

import { createApp } from 'vue'

import App from './App.vue'
import { initHostLocale } from './i18n'

const bootstrap = async () => {
  // Resolve the startup language (OS locale unless the user chose one) before
  // the first render so the window never flashes another language.
  await initHostLocale()

  const app = createApp(App)
  app.mount('#app')

  // Hide the loading spinner
  const loader = document.getElementById('loader')
  if (loader) {
    loader.style.display = 'none'
  }
}

void bootstrap()
