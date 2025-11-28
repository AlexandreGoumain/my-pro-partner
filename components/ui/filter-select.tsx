import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterSelectOption<T extends string = string> {
    value: T;
    label: string;
}

export interface FilterSelectProps<T extends string = string> {
    value?: T;
    onValueChange: (value: T) => void;
    options: FilterSelectOption<T>[];
    placeholder?: string;
    allLabel?: string;
    className?: string;
    triggerClassName?: string;
}

export function FilterSelect<T extends string = string>({
    value,
    onValueChange,
    options,
    placeholder = "Tous",
    allLabel = "Tous",
    className,
    triggerClassName,
}: FilterSelectProps<T>) {
    return (
        <Select
            value={value || "ALL"}
            onValueChange={(v) => onValueChange(v as T)}
        >
            <SelectTrigger
                className={cn(
                    "h-10 w-[180px] border-black/10",
                    triggerClassName,
                    className
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">{allLabel}</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
