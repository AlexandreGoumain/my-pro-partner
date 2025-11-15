import Image from "next/image";
import { cn } from "@/lib/utils";

export interface PaymentLinkQRCodeProps {
    qrCode: string;
    className?: string;
}

/**
 * Display payment link QR code
 */
export function PaymentLinkQRCode({ qrCode, className }: PaymentLinkQRCodeProps) {
    return (
        <div className={cn("text-center", className)}>
            <div className="bg-white p-4 rounded-lg border border-black/8 inline-block">
                <Image
                    src={qrCode}
                    alt="QR Code"
                    width={300}
                    height={300}
                />
            </div>
            <p className="text-[13px] text-black/60 mt-3">
                Scannez ce QR code pour payer
            </p>
        </div>
    );
}
