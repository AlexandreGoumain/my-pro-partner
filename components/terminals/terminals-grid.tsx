import type { Terminal } from "@/lib/types/pos";
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {terminals.map((terminal) => (
                <TerminalCard
                    key={terminal.id}
                    terminal={terminal}
                    onSync={onSync}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
