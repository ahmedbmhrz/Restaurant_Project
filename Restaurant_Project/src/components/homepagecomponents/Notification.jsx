
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TriangleAlert } from 'lucide-react';



const notifications = [
    {
        title: "Heads up!",
        description: "hello there hello",
        time: "Just now",
        color: "bg-[#D9D9D9]",
        action: true
    },
    {
        title: "New Order",
        description: "Table 5 placed an order",
        time: "2m ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "Payment Received",
        description: "Order #1234 paid successfully",
        time: "15m ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "Shift Change",
        description: "Evening shift starts in 30 mins",
        time: "1h ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "System Update",
        description: "System maintenance at midnight",
        time: "4h ago",
        color: "bg-[#D9D9D9]"
    },
    {
        title: "System Update",
        description: "System maintenance at midnight",
        time: "4h ago",
        color: "bg-[#D9D9D9]"
    }
]

export function Notification() {
    return (

        <div className="flex-1">
            <h2>Notification</h2>
            <ScrollArea className="h-[300px] w-full rounded-md border-2 p-4">
                <div className="flex flex-col gap-4">
                    {notifications.map((notification, index) => (
                        <Alert
                            key={index}
                            className={`${notification.color} text-black border-none shadow-sm`}
                        >
                            <TriangleAlert />

                            <AlertTitle className="flex justify-between items-center">
                                {notification.title}
                                <span className="text-xs font-normal opacity-70">
                                    {notification.time}
                                </span>
                            </AlertTitle>
                            <AlertDescription>
                                {notification.description}

                            </AlertDescription>

                        </Alert>
                    ))}
                </div>
            </ScrollArea>

        </div>
    )
}
