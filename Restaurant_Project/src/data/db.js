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
    }
};
