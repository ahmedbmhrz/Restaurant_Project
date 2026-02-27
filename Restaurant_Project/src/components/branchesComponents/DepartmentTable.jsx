import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const DepartmentTable = ({ departments }) => (
    <div className="mt-4 rounded-2xl border border-border/50 bg-background/20 overflow-hidden">
        <Table>
            <TableHeader className="bg-muted/50">
                <TableRow>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider h-9">Dept</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider h-9 text-right">Share</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider h-9 text-right">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {departments.map((dept) => (
                    <TableRow key={dept.name} className="hover:bg-indigo-500/5 transition-colors">
                        <TableCell className="text-xs font-bold py-3">{dept.name}</TableCell>
                        <TableCell className="text-xs text-right font-medium py-3">
                            <div className="flex flex-col items-end">
                                <span>{dept.share}%</span>
                                <span className={`text-[8px] font-black ${dept.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {dept.growth}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right py-3">
                            <Badge variant="outline" className={`h-4 text-[8px] font-black uppercase ${dept.status === 'Peak' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                dept.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                    'bg-slate-500/10 text-slate-600 border-slate-500/20'
                                }`}>
                                {dept.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);
