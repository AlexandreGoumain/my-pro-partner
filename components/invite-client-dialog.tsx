"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Copy, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface InviteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function InviteClientDialog({
  open,
  onOpenChange,
  onSuccess,
}: InviteClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    nom: "",
    prenom: "",
    telephone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("L'email est requis");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/clients/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erreur lors de l'envoi de l'invitation");
        return;
      }

      toast.success(data.message);

      // In development, show the invitation link
      if (data.invitationLink) {
        setInvitationLink(data.invitationLink);
      } else {
        // In production, close dialog after success
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!invitationLink) return;

    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast.success("Lien copié dans le presse-papier");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Erreur lors de la copie");
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      nom: "",
      prenom: "",
      telephone: "",
      message: "",
    });
    setInvitationLink(null);
    setCopied(false);
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
            <Mail className="h-5 w-5 inline mr-2" strokeWidth={2} />
            Inviter un client
          </DialogTitle>
        </DialogHeader>

        {invitationLink ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-black/5 border border-black/10 p-4">
              <p className="text-[14px] text-black/80 mb-3">
                Invitation envoyée avec succès ! Voici le lien d&apos;inscription :
              </p>
              <div className="flex gap-2">
                <Input
                  value={invitationLink}
                  readOnly
                  className="h-10 border-black/10 bg-white text-[13px] font-mono flex-1"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-4 w-4 mr-2" strokeWidth={2} />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" strokeWidth={2} />
                      Copier
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleClose}
              className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
            >
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[14px] font-medium text-black">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@example.com"
                required
                className="h-11 border-black/10 focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-[14px] font-medium text-black/60">
                  Nom
                </Label>
                <Input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Optionnel"
                  className="h-11 border-black/10 focus:border-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-[14px] font-medium text-black/60">
                  Prénom
                </Label>
                <Input
                  id="prenom"
                  name="prenom"
                  type="text"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Optionnel"
                  className="h-11 border-black/10 focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-[14px] font-medium text-black/60">
                Téléphone
              </Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Optionnel"
                className="h-11 border-black/10 focus:border-black"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-[14px] font-medium text-black/60">
                Message personnalisé
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Optionnel - Un message personnalisé pour le client"
                className="border-black/10 focus:border-black resize-none"
                rows={3}
              />
            </div>

            <div className="rounded-lg bg-black/2 p-4">
              <p className="text-[13px] text-black/60">
                Le client recevra un email avec un lien pour créer son compte. Les informations
                pré-remplies faciliteront son inscription.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1 h-11 text-[14px] font-medium border-black/10 hover:bg-black/5"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white"
              >
                {isLoading ? "Envoi..." : "Envoyer l'invitation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
