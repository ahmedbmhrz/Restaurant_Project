export const db = {
    branchData: {
        id: "branch-alpha",
        name: "Branch Alpha",
        location: "Downtown District",
        revenue: "$42,300",
        staff: "24 Active",
        growth: "+12.5%",
        status: "Operational",
        description: "Our flagship location in the heart of the city, specializing in premium culinary experiences with a modern touch."
    },
    managers: [
        {
            id: "mgr-1",
            name: "John Doe",
            role: "General Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "JD",
            achievement: "Highest customer satisfaction in Q1",
            tenure: "5.2 Years",
            performance: 4.9,
            growth: 8.4,
            isTopManager: true
        },
        {
            id: "mgr-2",
            name: "Ahmed",
            role: "Branch Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "AM",
            achievement: "Increased income for Branch A by 10%",
            tenure: "3.1 Years",
            performance: 4.7,
            growth: 12.5,
            isTopManager: false
        },
        {
            id: "mgr-3",
            name: "Sara",
            role: "Regional Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "SA",
            achievement: "Top performing branch in Q4",
            tenure: "4.5 Years",
            performance: 4.8,
            growth: 9.2,
            isTopManager: false
        },
        {
            id: "mgr-3",
            name: "Sara",
            role: "Regional Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "SA",
            achievement: "Top performing branch in Q4",
            tenure: "4.5 Years",
            performance: 4.8,
            growth: 9.2,
            isTopManager: false
        },
        {
            id: "mgr-3",
            name: "Sara",
            role: "Regional Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "SA",
            achievement: "Top performing branch in Q4",
            tenure: "4.5 Years",
            performance: 4.8,
            growth: 9.2,
            isTopManager: false
        },
        {
            id: "mgr-3",
            name: "Sara",
            role: "Regional Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "SA",
            achievement: "Top performing branch in Q4",
            tenure: "4.5 Years",
            performance: 4.8,
            growth: 9.2,
            isTopManager: false
        },
        {
            id: "mgr-3",
            name: "Sara",
            role: "Regional Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "SA",
            achievement: "Top performing branch in Q4",
            tenure: "4.5 Years",
            performance: 4.8,
            growth: 9.2,
            isTopManager: false
        },
        {
            id: "mgr-3",
            name: "Sara",
            role: "Regional Manager",
            avatarSrc: "https://github.com/shadcn.png",
            avatarFallback: "SA",
            achievement: "Top performing branch in Q4",
            tenure: "4.5 Years",
            performance: 4.8,
            growth: 9.2,
            isTopManager: false
        }
    ],
    incomeData: {
        total: 128430,
        currency: "$",
        trend: "+15.2%",
        history: [
            { day: "Mon", amount: 15200 },
            { day: "Tue", amount: 18400 },
            { day: "Wed", amount: 16800 },
            { day: "Thu", amount: 21000 },
            { day: "Fri", amount: 24500 },
            { day: "Sat", amount: 28900 },
            { day: "Sun", amount: 26300 }
        ],
        breakdown: [
            { label: "Net Profit", value: "$98,200", color: "bg-emerald-500" },
            { label: "Tax (15%)", value: "$19,264", color: "bg-blue-500" },
            { label: "Tips/Fees", value: "$10,966", color: "bg-amber-500" }
        ]
    },
    menuData: {
        stats: {
            active: 142,
            outOfStock: 8,
            categories: 12,
            health: "94%"
        },
        highlightDish: {
            name: "Signature Wagyu Burger",
            price: "$24.50",
            rating: 4.9,
            orders: 1250,
            image: "🍔"
        },
        topItems: [
            { name: "Truffle Pasta", orders: 840, price: "$22.00", status: "Trending" },
            { name: "Lobster Bisque", orders: 620, price: "$18.50", status: "Popular" },
            { name: "Avocado Toast", orders: 510, price: "$14.00", status: "Steady" }
        ]
    },
    operationalData: {
        traffic: [
            { time: "8 AM", count: 45 },
            { time: "11 AM", count: 120 },
            { time: "2 PM", count: 85 },
            { time: "5 PM", count: 160 },
            { time: "8 PM", count: 210 },
            { time: "11 PM", count: 95 }
        ],
        departments: [
            { name: "Dining", share: 55, growth: "+8%", status: "Optimal" },
            { name: "Delivery", share: 30, growth: "+15%", status: "Peak" },
            { name: "Takeaway", share: 15, growth: "-2%", status: "Slow" }
        ],
        activity: [
            { id: 1, type: "Order", title: "New Order #4451", time: "2 mins ago", status: "Pending" },
            { id: 2, type: "Inventory", title: "Low Stock: Wagyu Beef", time: "15 mins ago", status: "Critical" },
            { id: 3, type: "Staff", title: "Sara clocked in", time: "45 mins ago", status: "System" }
        ]
    }
};
