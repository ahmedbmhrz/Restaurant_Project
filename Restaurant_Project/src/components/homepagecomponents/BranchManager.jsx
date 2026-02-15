import { Button } from "@/components/ui/button"
import { Card, } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"




export function BranchManager() {
    return (
        <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Branch Manager</h2>
            <ScrollArea className="h-48 w-full rounded-md border-2 p-4">
                <div className="flex flex-col gap-6">
                    <Card className="p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <h4 className="font-semibold"> Ahmed</h4>
                                <p className="text-muted-foreground">Manger</p>
                            </div>

                            <Button variant="outline">Profile</Button>
                        </div>
                        <div className="mt-2 text-muted-foreground">
                            this manger has increased income for barnh A by 10%
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <h4 className="font-semibold"> Ahmed</h4>
                                <p className="text-muted-foreground">Manger</p>
                            </div>

                            <Button variant="outline">Profile</Button>
                        </div>
                        <div className="mt-2 text-muted-foreground">
                            this manger has increased income for barnh A by 10%
                        </div>
                    </Card>
                </div>
            </ScrollArea>
        </div>

    )
}
