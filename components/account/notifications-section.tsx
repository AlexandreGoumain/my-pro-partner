import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

interface NotificationsSectionProps {
    notifications: {
        emailNotifications: boolean;
        newsUpdates: boolean;
    };
    setEmailNotifications: (value: boolean) => void;
    setNewsUpdates: (value: boolean) => void;
    hasNotificationsChanged: boolean;
    isLoading: boolean;
    onSave: () => void;
}

export function NotificationsSection({
    notifications,
    setEmailNotifications,
    setNewsUpdates,
    hasNotificationsChanged,
    isLoading,
    onSave,
}: NotificationsSectionProps) {
    return (
        <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                        <Bell
                            className="w-5 h-5 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Notifications
                        </h2>
                        <p className="text-[13px] text-black/40">
                            Gérez vos préférences de notifications
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="email-notifications"
                                className="text-[14px] font-medium text-black"
                            >
                                Notifications par email
                            </Label>
                            <p className="text-[13px] text-black/40">
                                Recevoir des notifications importantes par email
                            </p>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={notifications.emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>

                    <Separator className="bg-black/10" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="news-updates"
                                className="text-[14px] font-medium text-black"
                            >
                                Actualités et mises à jour
                            </Label>
                            <p className="text-[13px] text-black/40">
                                Recevoir les nouveautés et fonctionnalités
                            </p>
                        </div>
                        <Switch
                            id="news-updates"
                            checked={notifications.newsUpdates}
                            onCheckedChange={setNewsUpdates}
                        />
                    </div>

                    <Separator className="bg-black/10" />

                    <Button
                        onClick={onSave}
                        disabled={isLoading || !hasNotificationsChanged}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? "Enregistrement..."
                            : "Enregistrer les préférences"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
