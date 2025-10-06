import './App.css'
import Pages from "@/pages/index.jsx"
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <Pages />
      <SpeedInsights />
      <Analytics />
    </>
  )
}

export default App 