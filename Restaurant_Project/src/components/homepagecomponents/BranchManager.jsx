import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function BranchManager() {
    const [managers, setManagers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats/branch-managers')
                const data = await res.json()
                setManagers(data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching managers:", error)
                setLoading(false)
            }
        }
        fetchManagers()
    }, [])

    return (
        <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Branch Manager</h2>
            <ScrollArea className="h-48 w-full rounded-md border-2 p-4">
                <div className="flex flex-col gap-6">
                    {loading ? (
                        <p className="text-muted-foreground">Loading managers...</p>
                    ) : managers.length === 0 ? (
                        <p className="text-muted-foreground">No managers found.</p>
                    ) : (
                        managers.map((manager) => (
                            <Card key={manager.id} className="p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${manager.full_name}`} />
                                        <AvatarFallback>{manager.full_name ? manager.full_name.substring(0, 2).toUpperCase() : 'MG'}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <h4 className="font-semibold">{manager.full_name}</h4>
                                        <p className="text-muted-foreground">Manager</p>
                                    </div>

                                    <Button variant="outline">Profile</Button>
                                </div>
                                <div className="mt-2 text-muted-foreground">
                                    Managing branch operations effectively.
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
