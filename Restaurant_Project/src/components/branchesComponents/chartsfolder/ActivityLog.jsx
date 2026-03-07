export const ActivityLog = ({ activity }) => (
    <div className="mt-4 space-y-4">
        {activity.map((item) => (
            <div key={item.id} className="group/item flex items-start gap-3 rounded-2xl bg-muted/30 p-3 transition-all hover:bg-background hover:shadow-md hover:ring-1 hover:ring-indigo-500/20">
                <div className={`mt-1 h-2 w-2 rounded-full ${item.status === 'Critical' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse' :
                    item.status === 'Pending' ? 'bg-amber-500' : 'bg-indigo-400'
                    }`} />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight">{item.title}</span>
                        <span className="text-[9px] font-medium text-muted-foreground/60">{item.time}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/70">{item.type} notification</div>
                </div>
            </div>
        ))}
    </div>
);
