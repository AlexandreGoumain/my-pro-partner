/**
 * Authentication and Registration Types
 */

// Client Registration
export interface ClientRegisterData {
    nom: string;
    prenom?: string;
    email: string;
    telephone: string;
    password: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    invitationToken: string;
}

export interface RegisterFormData {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
    adresse: string;
    codePostal: string;
    ville: string;
}

export interface RegisterFormErrors {
    password: string;
    confirmPassword: string;
    invitation: string;
}

// Invitation
export interface InvitationData {
    email: string;
    nom: string | null;
    prenom: string | null;
    telephone: string | null;
    entrepriseName: string;
    expiresAt: string;
}

export interface InvitationVerificationResult {
    invitationData: InvitationData | null;
    isVerifying: boolean;
    error: string;
}

// Hook return types
export interface UseClientRegisterReturn {
    isLoading: boolean;
    success: boolean;
    register: (data: ClientRegisterData) => Promise<boolean>;
}

export interface UseRegisterFormReturn {
    formData: RegisterFormData;
    errors: RegisterFormErrors;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
    setErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>;
    validateForm: () => boolean;
    resetErrors: () => void;
}

// Password Reset
export interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}
