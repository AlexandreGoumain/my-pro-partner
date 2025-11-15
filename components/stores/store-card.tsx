import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Settings, Store as StoreIcon } from "lucide-react";
import { type StoreDisplay } from "@/lib/types/store";

export interface StoreCardProps {
    store: StoreDisplay;
    onEdit?: (store: StoreDisplay) => void;
}

export function StoreCard({ store, onEdit }: StoreCardProps) {
    return (
        <Card className="hover:shadow-md transition-all duration-200 border-black/8">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <StoreIcon className="h-5 w-5 text-black/60" strokeWidth={2} />
                        </div>
                        <div>
                            <CardTitle className="text-[17px] font-semibold tracking-[-0.01em]">
                                {store.nom}
                            </CardTitle>
                            <CardDescription className="text-[13px] font-mono">
                                {store.code}
                            </CardDescription>
                        </div>
                    </div>
                    {store.isMainStore && (
                        <Badge className="bg-black/5 text-black border-black/10 text-[12px] h-6 px-2">
                            Principal
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {store.localisation && (
                    <div className="flex items-start gap-2 text-[14px]">
                        <MapPin className="h-4 w-4 text-black/40 mt-0.5" strokeWidth={2} />
                        <div>
                            <div className="text-black">{store.adresse}</div>
                            <div className="text-black/60">{store.localisation}</div>
                        </div>
                    </div>
                )}

                {store.telephone && (
                    <div className="flex items-center gap-2 text-[14px]">
                        <Phone className="h-4 w-4 text-black/40" strokeWidth={2} />
                        <span className="text-black/60">{store.telephone}</span>
                    </div>
                )}

                {store.email && (
                    <div className="flex items-center gap-2 text-[14px]">
                        <Mail className="h-4 w-4 text-black/40" strokeWidth={2} />
                        <span className="text-black/60">{store.email}</span>
                    </div>
                )}

                <div className="pt-3 border-t border-black/8 flex justify-between items-center text-[14px]">
                    <span className="text-black/60">
                        {store.registersCount} caisse(s)
                    </span>
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(store)}
                            className="h-8 w-8 p-0 hover:bg-black/5"
                        >
                            <Settings className="h-4 w-4 text-black/60" strokeWidth={2} />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
