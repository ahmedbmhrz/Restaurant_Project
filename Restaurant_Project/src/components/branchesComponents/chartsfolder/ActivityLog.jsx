export const ActivityLog = ({ activity }) => (
    <div className="mt-4 space-y-3">
        {activity.map((item) => (
            <div key={item.id} className="group/item flex items-center gap-4 rounded-2xl bg-white/40 backdrop-blur-md p-3 border border-white/40 shadow-sm transition-all hover:bg-white hover:shadow-lg hover:-translate-y-0.5">
                <div className={`h-2 w-2 rounded-full shrink-0 ${
                    item.status === 'Success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' :
                    item.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-indigo-400'
                }`} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black text-slate-700 truncate tracking-tight">{item.title}</span>
                        <span className="text-[9px] font-bold text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <div className="text-[10px] font-medium text-slate-400/80 truncate italic">
                        {item.description || `${item.type} processed successfully`}
                    </div>
                </div>
            </div>
        ))}
    </div>
);
