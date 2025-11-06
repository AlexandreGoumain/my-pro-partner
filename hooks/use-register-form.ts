import { useState, useCallback } from "react";

interface RegisterFormData {
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

interface RegisterFormErrors {
  password: string;
  confirmPassword: string;
  invitation: string;
}

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: RegisterFormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  setErrors: React.Dispatch<React.SetStateAction<RegisterFormErrors>>;
  validateForm: () => boolean;
  resetErrors: () => void;
}

/**
 * Custom hook to manage registration form state and validation
 *
 * @returns Form data, errors, handlers, and validation function
 */
export function useRegisterForm(): UseRegisterFormReturn {
  const [formData, setFormData] = useState<RegisterFormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    adresse: "",
    codePostal: "",
    ville: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({
    password: "",
    confirmPassword: "",
    invitation: "",
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error when user types
      if (name === "password" || name === "confirmPassword") {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    []
  );

  const resetErrors = useCallback(() => {
    setErrors({ password: "", confirmPassword: "", invitation: "" });
  }, []);

  const validateForm = useCallback((): boolean => {
    resetErrors();

    if (formData.password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Le mot de passe doit contenir au moins 8 caractères",
      }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Les mots de passe ne correspondent pas",
      }));
      return false;
    }

    return true;
  }, [formData.password, formData.confirmPassword, resetErrors]);

  return {
    formData,
    errors,
    handleChange,
    setFormData,
    setErrors,
    validateForm,
    resetErrors,
  };
}
