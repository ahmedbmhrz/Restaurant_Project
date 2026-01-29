import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  return (
    <div className="min-h-svh flex flex-col bg-muted/50">
      <Navbar />
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center">
        <Card className="w-full max-w-6xl shadow-md min-h-[500px]">

        </Card>
      </main>
    </div>
  )
}

export default App