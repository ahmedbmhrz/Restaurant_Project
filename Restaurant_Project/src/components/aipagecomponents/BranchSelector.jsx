
import {
    NativeSelect,
    NativeSelectOption
} from "@/components/ui/native-select"

const branches = [
  { id: "all", name: "All Branches" },
  { id: "11111111-1111-1111-1111-111111111111", name: "Branch A" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Branch B" },
  { id: "cccc3333-3333-3333-3333-333333333333", name: "Branch C" },
  { id: "aaaa1111-1111-1111-1111-111111111111", name: "Branch D" },
  { id: "bbbb2222-2222-2222-2222-222222222222", name: "Branch E" },
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
