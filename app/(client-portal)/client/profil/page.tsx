"use client";

import {
    ProfileFormCard,
    ProfileInfoCard,
} from "@/components/client/profile";
import { ClientTabSkeleton } from "@/components/ui/client-tab-skeleton";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useClientProfile } from "@/hooks/use-client-profile";

export default function ClientProfilPage() {
    const { profile, isLoading, isSaving, updateProfile } = useClientProfile();

    const nomComplet = `${profile?.nom || ""} ${profile?.prenom || ""}`.trim();

    return (
        <ConditionalSkeleton
            isLoading={isLoading}
            fallback={<ClientTabSkeleton variant="profile" />}
        >
            {!profile ? (
                <EmptyState
                    title="Impossible de charger votre profil"
                    variant="inline"
                />
            ) : (
                <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Mon profil"
                description="Consultez et modifiez vos informations personnelles"
            />

            {/* Profile Info (Read-Only) */}
            <ProfileInfoCard nomComplet={nomComplet} email={profile.email} />

            {/* Editable Contact Info */}
            <ProfileFormCard
                profile={profile}
                isSaving={isSaving}
                onSave={updateProfile}
            />
                </div>
            )}
        </ConditionalSkeleton>
    );
}
