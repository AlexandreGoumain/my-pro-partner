interface ErrorAlertProps {
    message: string;
    className?: string;
}

export function ErrorAlert({ message, className }: ErrorAlertProps) {
    return (
        <div
            className={`rounded-lg bg-red-50 border border-red-200 p-4 ${className || ""}`}
        >
            <p className="text-[14px] text-red-800">{message}</p>
        </div>
    );
}
