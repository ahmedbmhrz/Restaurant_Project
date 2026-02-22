import { Button } from "@/components/ui/button"
import { Card, } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



export function ManagersnBranch() {
    return (
        <Card className="p-4 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Branch Managers</h2>
            <ScrollArea className="flex-1 rounded-md border p-4">
                <div className="flex flex-col gap-4">
                    <Card className="p-4 bg-muted/50 border-none">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>AM</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm"> Ahmed</h4>
                                <p className="text-xs text-muted-foreground">Manager</p>
                            </div>
                            <Button size="sm" variant="outline">Profile</Button>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                            Increased income for Branch A by 10%
                        </p>
                    </Card>

                    <Card className="p-4 bg-muted/50 border-none">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>SA</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm"> Sara</h4>
                                <p className="text-xs text-muted-foreground">Manager</p>
                            </div>
                            <Button size="sm" variant="outline">Profile</Button>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                            Top performing branch in Q4
                        </p>
                    </Card>
                </div>
            </ScrollArea>
        </Card>
    )
}
