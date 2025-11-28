import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CampaignContentSectionProps {
    type: "EMAIL" | "SMS" | "NOTIFICATION";
    subject: string;
    setSubject: (value: string) => void;
    body: string;
    setBody: (value: string) => void;
}

export function CampaignContentSection({
    type,
    subject,
    setSubject,
    body,
    setBody,
}: CampaignContentSectionProps) {
    if (type === "EMAIL") {
        return (
            <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">
                        Sujet de l&apos;email *
                    </Label>
                    <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-11 border-black/10 text-[14px] bg-white"
                        placeholder="Ex: Découvrez nos nouveautés printemps"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">
                        Corps de l&apos;email *
                    </Label>
                    <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="min-h-[200px] border-black/10 text-[14px] bg-white"
                        placeholder="Bonjour {prenom},&#10;&#10;Nous sommes ravis de vous présenter..."
                    />
                    <p className="text-[12px] text-black/60">
                        Variables disponibles: {"{nom}"}, {"{prenom}"},{" "}
                        {"{email}"}
                    </p>
                </div>
            </div>
        );
    }

    if (type === "SMS") {
        return (
            <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">
                        Message SMS *
                    </Label>
                    <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="min-h-[120px] border-black/10 text-[14px] bg-white"
                        placeholder="Bonjour {prenom}, découvrez nos offres..."
                        maxLength={160}
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-[12px] text-black/60">
                            Variables: {"{nom}"}, {"{prenom}"}
                        </p>
                        <p className="text-[12px] text-black/60">
                            {body.length}/160 caractères
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // NOTIFICATION / PUSH
    return (
        <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
            <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                    Titre de la notification *
                </Label>
                <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-11 border-black/10 text-[14px] bg-white"
                    placeholder="Ex: Nouvelle offre disponible"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-[13px] font-medium text-black/80">
                    Message *
                </Label>
                <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[100px] border-black/10 text-[14px] bg-white"
                    placeholder="Découvrez nos nouveautés..."
                    maxLength={200}
                />
                <p className="text-[12px] text-black/60">
                    {body.length}/200 caractères
                </p>
            </div>
        </div>
    );
}
