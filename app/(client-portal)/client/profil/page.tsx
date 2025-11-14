"use client";

import {
    ProfileFormCard,
    ProfileInfoCard,
} from "@/components/client/profile";
import { EmptyState } from "@/components/client-portal/shared/empty-state";
import { ClientTabSkeleton } from "@/components/ui/client-tab-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { useClientProfile } from "@/hooks/use-client-profile";

export default function ClientProfilPage() {
    const { profile, isLoading, isSaving, updateProfile } = useClientProfile();

    if (isLoading) {
        return <ClientTabSkeleton variant="profile" />;
    }

    if (!profile) {
        return (
            <EmptyState message="Impossible de charger votre profil" />
        );
    }

    const nomComplet = `${profile.nom} ${profile.prenom || ""}`.trim();

    return (
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
    );
}
