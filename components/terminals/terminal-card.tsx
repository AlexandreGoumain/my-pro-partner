import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, Trash2 } from "lucide-react";
import type { Terminal } from "@/lib/types/pos";
import { TerminalStatusBadge } from "./terminal-status-badge";

interface TerminalCardProps {
    terminal: Terminal;
    onSync: (terminalId: string) => void;
    onDelete: (terminalId: string) => void;
}

export function TerminalCard({
    terminal,
    onSync,
    onDelete,
}: TerminalCardProps) {
    return (
        <Card className="p-6 border-black/8">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-[16px] font-semibold text-black mb-1">
                        {terminal.label}
                    </h3>
                    {terminal.location && (
                        <p className="text-[13px] text-black/60">
                            {terminal.location}
                        </p>
                    )}
                </div>
                <TerminalStatusBadge status={terminal.status} />
            </div>

            <div className="space-y-2 mb-4">
                {terminal.device_type && (
                    <div className="flex justify-between text-[13px]">
                        <span className="text-black/60">Type</span>
                        <span className="text-black font-medium">
                            {terminal.device_type}
                        </span>
                    </div>
                )}
                {terminal.serial_number && (
                    <div className="flex justify-between text-[13px]">
                        <span className="text-black/60">Série</span>
                        <span className="text-black font-medium font-mono text-[12px]">
                            {terminal.serial_number}
                        </span>
                    </div>
                )}
                {terminal.ip_address && (
                    <div className="flex justify-between text-[13px]">
                        <span className="text-black/60">IP</span>
                        <span className="text-black font-medium font-mono text-[12px]">
                            {terminal.ip_address}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={() => onSync(terminal.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-black/10 hover:bg-black/5"
                >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Sync
                </Button>
                <Button
                    onClick={() => onDelete(terminal.id)}
                    variant="outline"
                    size="sm"
                    className="border-black/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </Card>
    );
}
