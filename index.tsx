
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PostHogProvider } from 'posthog-js/react'
import 'mapbox-gl/dist/mapbox-gl.css';


const options = {
  api_host: process.env.PUBLIC_POSTHOG_HOST,
  defaults: '2025-12-27',
} as const

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* <PostHogProvider apiKey={process.env.PUBLIC_POSTHOG_KEY} options={options}> */}
      <App />
    {/* </PostHogProvider> */}
  </React.StrictMode>
);
