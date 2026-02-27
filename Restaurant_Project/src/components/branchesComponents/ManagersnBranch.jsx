import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ManagerCard } from "./ManagerCard"

export function ManagersnBranch({ managers = [] }) {
    return (
        <Card className="p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Branch Managers</h2>
            <ScrollArea className="flex-1 rounded-md border p-4">
                <div className="flex flex-col gap-4">
                    {managers.map((manager, index) => (
                        <ManagerCard key={index} {...manager} />
                    ))}
                </div>
            </ScrollArea>
        </Card>
    )
}

