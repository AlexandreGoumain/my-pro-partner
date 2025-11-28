/**
 * Custom hook for account page state management
 *
 * Consolidates multiple useState calls into a single hook with
 * organized state and computed properties.
 */

import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";

interface ProfileState {
    name: string;
    email: string;
}

interface NotificationState {
    emailNotifications: boolean;
    newsUpdates: boolean;
}

interface DeleteAccountState {
    dialogOpen: boolean;
    reason: string;
    comment: string;
}

interface UseAccountPageStateReturn {
    // Loading state
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;

    // Profile state
    profile: ProfileState;
    setProfileName: (name: string) => void;
    setProfileEmail: (email: string) => void;
    hasProfileChanged: boolean;

    // Notification state
    notifications: NotificationState;
    setEmailNotifications: (value: boolean) => void;
    setNewsUpdates: (value: boolean) => void;
    hasNotificationsChanged: boolean;
    saveNotificationInitialValues: () => void;

    // Delete account state
    deleteAccount: DeleteAccountState;
    setDeleteDialogOpen: (open: boolean) => void;
    setDeleteReason: (reason: string) => void;
    setDeleteComment: (comment: string) => void;
    resetDeleteState: () => void;
}

export function useAccountPageState(
    session: Session | null
): UseAccountPageStateReturn {
    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Profile state
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");

    // Notification state
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [newsUpdates, setNewsUpdates] = useState(false);
    const [initialEmailNotifications, setInitialEmailNotifications] =
        useState(true);
    const [initialNewsUpdates, setInitialNewsUpdates] = useState(false);

    // Delete account state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [deleteComment, setDeleteComment] = useState("");

    // Sync profile from session
    useEffect(() => {
        if (session?.user) {
            setProfileName(session.user.name || "");
            setProfileEmail(session.user.email || "");
        }
    }, [session]);

    // Computed: check if profile has changed
    const hasProfileChanged =
        profileName !== (session?.user?.name || "") ||
        profileEmail !== (session?.user?.email || "");

    // Computed: check if notifications have changed
    const hasNotificationsChanged =
        emailNotifications !== initialEmailNotifications ||
        newsUpdates !== initialNewsUpdates;

    // Save notification initial values (after successful save)
    const saveNotificationInitialValues = useCallback(() => {
        setInitialEmailNotifications(emailNotifications);
        setInitialNewsUpdates(newsUpdates);
    }, [emailNotifications, newsUpdates]);

    // Reset delete state
    const resetDeleteState = useCallback(() => {
        setDeleteDialogOpen(false);
        setDeleteReason("");
        setDeleteComment("");
    }, []);

    return {
        // Loading
        isLoading,
        setIsLoading,

        // Profile
        profile: {
            name: profileName,
            email: profileEmail,
        },
        setProfileName,
        setProfileEmail,
        hasProfileChanged,

        // Notifications
        notifications: {
            emailNotifications,
            newsUpdates,
        },
        setEmailNotifications,
        setNewsUpdates,
        hasNotificationsChanged,
        saveNotificationInitialValues,

        // Delete account
        deleteAccount: {
            dialogOpen: deleteDialogOpen,
            reason: deleteReason,
            comment: deleteComment,
        },
        setDeleteDialogOpen,
        setDeleteReason,
        setDeleteComment,
        resetDeleteState,
    };
}
