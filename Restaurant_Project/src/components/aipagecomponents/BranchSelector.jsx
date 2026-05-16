
import {
    NativeSelect,
    NativeSelectOption
} from "@/components/ui/native-select"

export function BranchSelector({ selected, onChange, branches = [] }) {
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
