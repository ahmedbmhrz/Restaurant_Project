import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ManagerCard({ name, role, avatarSrc, avatarFallback, achievement }) {
    return (
        <Card className="p-4 bg-muted/50 border-none">
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">{name}</h4>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
                <Button size="sm" variant="outline">Profile</Button>
            </div>
            {achievement && (
                <p className="mt-3 text-xs text-muted-foreground">
                    {achievement}
                </p>
            )}
        </Card>
    )
}
