import type { TeamInvitationData } from "@/lib/types/auth";

export interface InvitationInfoCardProps {
    invitation: TeamInvitationData;
    className?: string;
}

export function InvitationInfoCard({
    invitation,
    className,
}: InvitationInfoCardProps) {
    return (
        <div
            className={`bg-black/5 border border-black/10 rounded-md p-4 ${className || ""}`}
        >
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-[13px] text-black/40">Email</span>
                    <span className="text-[14px] font-medium text-black">
                        {invitation.email}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[13px] text-black/40">Rôle</span>
                    <span className="text-[14px] font-medium text-black">
                        {invitation.role}
                    </span>
                </div>
            </div>
        </div>
    );
}
