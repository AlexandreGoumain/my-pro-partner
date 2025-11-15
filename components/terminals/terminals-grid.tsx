import type { Terminal } from "@/lib/types/pos";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { TerminalCard } from "./terminal-card";

interface TerminalsGridProps {
    terminals: Terminal[];
    onSync: (terminalId: string) => void;
    onDelete: (terminalId: string) => void;
}

export function TerminalsGrid({
    terminals,
    onSync,
    onDelete,
}: TerminalsGridProps) {
    return (
        <ResponsiveGrid columns={{ md: 2, lg: 3 }} gap={4}>
            {terminals.map((terminal) => (
                <TerminalCard
                    key={terminal.id}
                    terminal={terminal}
                    onSync={onSync}
                    onDelete={onDelete}
                />
            ))}
        </ResponsiveGrid>
    );
}
