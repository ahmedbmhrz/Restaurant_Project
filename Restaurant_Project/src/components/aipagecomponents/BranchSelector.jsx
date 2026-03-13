
import {
    NativeSelect,
    NativeSelectOption
} from "@/components/ui/native-select"

const branches = [
    { id: "all", name: "All Branches" },
    { id: "A", name: "Branch A" },
    { id: "B", name: "Branch B" },
    { id: "C", name: "Branch C" },
    { id: "D", name: "Branch D" },
    { id: "E", name: "Branch E" },
]

export function BranchSelector({ selected, onChange }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <label htmlFor="branch-select" className="text-sm font-semibold text-slate-600">
                Viewing data for:
            </label>
            <NativeSelect
                id="branch-select"
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="w-64 bg-white shadow-sm"
            >
                {branches.map((branch) => (
                    <NativeSelectOption key={branch.id} value={branch.id}>
                        {branch.name}
                    </NativeSelectOption>
                ))}
            </NativeSelect>
        </div>
    );
}
