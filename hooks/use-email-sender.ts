import { useState } from "react";
import { toast } from "sonner";

interface UseEmailSenderProps {
    recipientId: string;
    recipientType: "client" | "segment";
    recipientName?: string;
    recipientEmail?: string;
    recipientCount?: number;
    onSuccess: () => void;
}

interface UseEmailSenderReturn {
    subject: string;
    body: string;
    sending: boolean;
    setSubject: (subject: string) => void;
    setBody: (body: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
}

/**
 * Custom hook for sending emails to clients or segments
 * Handles form state, validation, and API submission
 *
 * @param props Recipient info and success callback
 * @returns Email form state and handlers
 */
export function useEmailSender({
    recipientId,
    recipientType,
    recipientName,
    recipientEmail,
    recipientCount,
    onSuccess,
}: UseEmailSenderProps): UseEmailSenderReturn {
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);

    const resetForm = () => {
        setSubject("");
        setBody("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!subject.trim()) {
            toast.error("Le sujet est requis");
            return;
        }

        if (!body.trim()) {
            toast.error("Le message est requis");
            return;
        }

        if (recipientType === "client" && !recipientEmail) {
            toast.error("Ce client n'a pas d'adresse email");
            return;
        }

        setSending(true);

        try {
            const endpoint =
                recipientType === "client"
                    ? `/api/clients/${recipientId}/send-email`
                    : `/api/segments/${recipientId}/send-email`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, body }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de l'envoi de l'email");
            }

            // Success message based on recipient type
            const successMessage =
                recipientType === "client"
                    ? data.message || `Email envoyé avec succès à ${recipientEmail}`
                    : data.message ||
                      `Email envoyé avec succès à ${data.recipientsSent || recipientCount} client${
                          (data.recipientsSent || recipientCount || 0) > 1 ? "s" : ""
                      }`;

            toast.success(successMessage);
            resetForm();
            onSuccess();
        } catch (error: unknown) {
            console.error("[Email Sender] Error sending email:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email";
            toast.error(errorMessage);
        } finally {
            setSending(false);
        }
    };

    return {
        subject,
        body,
        sending,
        setSubject,
        setBody,
        handleSubmit,
        resetForm,
    };
}
