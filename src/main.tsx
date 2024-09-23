import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";

import {ConfigProvider} from "antd";
import ruRU from 'antd/es/locale/ru_RU';

import {AuthProvider} from "./hooks/Auth.tsx";

import App from './App.tsx'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ConfigProvider locale={ruRU}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </ConfigProvider>
    </AuthProvider>
  </StrictMode>
)
