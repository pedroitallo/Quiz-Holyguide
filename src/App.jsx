import './App.css'
import Pages from "@/pages/index.jsx"
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <>
      <Pages />
      <SpeedInsights />
    </>
  )
}

export default App 