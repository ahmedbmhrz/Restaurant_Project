import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ManagerCard({ name, role, avatarSrc, avatarFallback, achievement, onClick, onProfileClick, isSelected }) {
    return (
        <Card 
            className={`p-4 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isSelected 
                    ? 'scale-95 bg-slate-100/60 shadow-inner border border-primary/20' 
                    : 'bg-white hover:scale-[0.98] hover:shadow-md border border-transparent'
            }`}
            onClick={onClick}
        >
            {isSelected && (
                <div className="absolute top-1/2 -right-1 w-2 h-8 -translate-y-1/2 bg-primary rounded-l-full shadow-sm" />
            )}
            <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    {avatarSrc && <AvatarImage src={avatarSrc} className="object-cover" />}
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">{name}</h4>
                    <p className="text-xs text-muted-foreground">{role}</p>
                </div>
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-[10px] font-bold"
                    onClick={(e) => {
                        e.stopPropagation();
                        onProfileClick && onProfileClick();
                    }}
                >
                    Profile
                </Button>
            </div>
            {achievement && (
                <p className="mt-3 text-xs text-muted-foreground">
                    {achievement}
                </p>
            )}
        </Card>
    )
}
