import { Card, } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ManagerCard } from "./ManagerCard"

const managersData = [
    {
        name: "Ahmed",
        role: "Manager",
        avatarSrc: "https://github.com/shadcn.png",
        avatarFallback: "AM",
        achievement: "Increased income for Branch A by 10%"
    },
    {
        name: "Sara",
        role: "Manager",
        avatarSrc: "https://github.com/shadcn.png",
        avatarFallback: "SA",
        achievement: "Top performing branch in Q4"
    }
]



export function ManagersnBranch() {
    return (


        <Card className="p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Branch Managers</h2>
            <ScrollArea className="flex-1 rounded-md border p-4">
                <div className="flex flex-col gap-4">
                    {managersData.map((manager, index) => (
                        <ManagerCard key={index} {...manager} />
                    ))}
                </div>
            </ScrollArea>
        </Card>
    )
}
