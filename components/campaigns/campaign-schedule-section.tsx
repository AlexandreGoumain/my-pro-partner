import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface CampaignScheduleSectionProps {
    scheduledDate: Date | undefined;
    setScheduledDate: (date: Date | undefined) => void;
    scheduledTime: string;
    setScheduledTime: (time: string) => void;
}

export function CampaignScheduleSection({
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
}: CampaignScheduleSectionProps) {
    return (
        <div className="space-y-4 p-6 border border-black/10 rounded-lg bg-black/2">
            <div className="flex items-center gap-2 mb-2">
                <CalendarIcon
                    className="h-5 w-5 text-black/60"
                    strokeWidth={2}
                />
                <h3 className="text-[15px] font-medium text-black">
                    Planification
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">
                        Date d&apos;envoi
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full h-11 justify-start text-left font-normal border-black/10 bg-white"
                            >
                                <CalendarIcon
                                    className="mr-2 h-4 w-4 text-black/60"
                                    strokeWidth={2}
                                />
                                {scheduledDate ? (
                                    format(scheduledDate, "dd MMMM yyyy", {
                                        locale: fr,
                                    })
                                ) : (
                                    <span className="text-black/40">
                                        Sélectionner une date
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={scheduledDate}
                                onSelect={setScheduledDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-black/80">
                        Heure d&apos;envoi
                    </Label>
                    <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="h-11 border-black/10 text-[14px] bg-white"
                    />
                </div>
            </div>

            {scheduledDate && (
                <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                    <p className="text-[13px] text-blue-900">
                        <Clock
                            className="inline h-4 w-4 mr-1"
                            strokeWidth={2}
                        />
                        La campagne sera envoyée le{" "}
                        <strong>
                            {format(scheduledDate, "dd MMMM yyyy", {
                                locale: fr,
                            })}
                        </strong>{" "}
                        à <strong>{scheduledTime}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}
