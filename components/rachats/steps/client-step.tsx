"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClients } from "@/hooks/use-clients";
import { Info } from "lucide-react";

interface ClientStepProps {
  form: UseFormReturn<any>;
}

export function ClientStep({ form }: ClientStepProps) {
  const { data: clients = [], isLoading } = useClients();

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-[20px] font-semibold text-black tracking-[-0.02em]">
          Client (optionnel)
        </h3>
        <p className="text-[14px] text-black/60">
          Sélectionnez le client dont vous rachetez l'article, ou laissez vide
          pour un rachat anonyme.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" strokeWidth={2} />
        <div className="text-[13px] text-blue-900">
          <p className="font-medium mb-1">Information</p>
          <p>
            Associer un client permet de conserver l'historique des rachats et
            facilite la fidélisation. Vous pourrez toujours ajouter le client
            plus tard.
          </p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px] font-medium text-black">
              Client
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-11 border-black/10 focus:border-black/20">
                  <SelectValue placeholder="Sélectionner un client (optionnel)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Chargement...
                  </SelectItem>
                ) : clients.length > 0 ? (
                  <>
                    <SelectItem value="no-client">Aucun client</SelectItem>
                    {clients
                      .filter((client) => client.id && client.id.trim() !== "")
                      .map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nom}
                          {client.email && (
                            <span className="text-black/50 ml-2">
                              ({client.email})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                  </>
                ) : (
                  <SelectItem value="no-clients-available" disabled>
                    Aucun client disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormDescription className="text-[13px] text-black/50">
              Laissez vide si vous ne souhaitez pas associer de client
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
