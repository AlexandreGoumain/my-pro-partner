import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card-section";
import { Download, Package } from "lucide-react";
import Image from "next/image";

export interface ArticleImageSectionProps {
    image?: string;
    nom: string;
    onChangeImage?: () => void;
    className?: string;
}

export function ArticleImageSection({
    image,
    nom,
    onChangeImage,
    className = "",
}: ArticleImageSectionProps) {
    return (
        <CardSection
            title="Image"
            className={`border-black/8 shadow-sm ${className}`}
            titleClassName="text-[16px]"
        >
            <div className="aspect-square relative rounded-lg overflow-hidden bg-black/5">
                {image ? (
                    <Image
                        src={image}
                        alt={nom}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package
                            className="h-24 w-24 text-black/20"
                            strokeWidth={1.5}
                        />
                    </div>
                )}
            </div>
            {onChangeImage && (
                <Button
                    variant="outline"
                    className="w-full mt-4 border-black/10 hover:bg-black/5"
                    onClick={onChangeImage}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Changer l&apos;image
                </Button>
            )}
        </CardSection>
    );
}
