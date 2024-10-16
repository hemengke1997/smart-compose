import React from 'react'
import { ConfigProvider, theme } from 'antd'
import ReactDOM from 'react-dom/client'
import { SuggestionContext } from './contexts/suggestion-context'
import App from './views/app'
import './css/index.css'

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        cssVar: true,
        algorithm: [theme.darkAlgorithm],
      }}
    >
      <SuggestionContext.Provider>
        <App />
      </SuggestionContext.Provider>
    </ConfigProvider>
  </React.StrictMode>,
)
