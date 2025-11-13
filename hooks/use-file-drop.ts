import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseFileDropProps {
    acceptedTypes?: string[];
    maxSize?: number;
}

const DEFAULT_ACCEPTED_TYPES = [".csv", ".json", "text/csv", "application/json"];
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function useFileDrop({
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    maxSize = DEFAULT_MAX_SIZE,
}: UseFileDropProps = {}) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const isValidFile = useCallback(
        (file: File) => {
            // Check file size
            if (file.size > maxSize) {
                toast.error("Fichier trop volumineux", {
                    description: `La taille maximale est de ${maxSize / 1024 / 1024}MB`,
                });
                return false;
            }

            // Check file type
            const isValidType = acceptedTypes.some(
                (type) =>
                    file.type === type ||
                    file.name.endsWith(type.replace(".", ""))
            );

            if (!isValidType) {
                toast.error("Format de fichier non supporté", {
                    description: `Formats acceptés: ${acceptedTypes.filter(t => t.startsWith('.')).join(", ")}`,
                });
                return false;
            }

            return true;
        },
        [acceptedTypes, maxSize]
    );

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (isValidFile(file)) {
                    setSelectedFile(file);
                    toast.info("Fichier sélectionné", {
                        description: `${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
                    });
                }
            }
        },
        [isValidFile]
    );

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                const file = files[0];
                if (isValidFile(file)) {
                    setSelectedFile(file);
                    toast.info("Fichier sélectionné", {
                        description: `${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
                    });
                }
            }
        },
        [isValidFile]
    );

    const clearFile = useCallback(() => {
        setSelectedFile(null);
    }, []);

    return {
        isDragging,
        selectedFile,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleFileSelect,
        clearFile,
    };
}
