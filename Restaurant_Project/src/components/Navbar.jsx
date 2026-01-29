import { Pizza } from "lucide-react"

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 font-bold text-xl mr-8">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Pizza className="h-5 w-5" />
                    </div>
                    <span>Nexus Food</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <a href="#" className="transition-colors hover:text-primary text-foreground">
                        Home
                    </a>
                    <a href="#" className="transition-colors hover:text-primary">
                        Branches
                    </a>
                    <a href="#" className="transition-colors hover:text-primary">
                        AI Prediction
                    </a>
                </div>
            </div>
        </nav>
    )
}
