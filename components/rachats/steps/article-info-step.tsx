"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArticleInfoStepProps {
  form: UseFormReturn<any>;
  categories: any[];
  loadingCategories: boolean;
}

export function ArticleInfoStep({
  form,
  categories,
  loadingCategories,
}: ArticleInfoStepProps) {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-[20px] font-semibold text-black tracking-[-0.02em]">
          Informations sur l'article
        </h3>
        <p className="text-[14px] text-black/60">
          Décrivez l'article que vous rachetez
        </p>
      </div>

      <FormField
        control={form.control}
        name="nom"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px] font-medium text-black">
              Nom de l'article <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: iPhone 13 Pro 128GB Noir"
                className="h-11 border-black/10 focus:border-black/20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categorieId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px] font-medium text-black">
              Catégorie <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-11 border-black/10 focus:border-black/20">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {loadingCategories ? (
                  <SelectItem value="loading" disabled>
                    Chargement...
                  </SelectItem>
                ) : categories.length > 0 ? (
                  categories
                    .filter((category) => category.id && category.id.trim() !== "")
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nom}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="no-categories" disabled>
                    Aucune catégorie disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[14px] font-medium text-black">
              Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez l'article, son état général, les accessoires inclus..."
                className="min-h-[100px] border-black/10 focus:border-black/20 resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription className="text-[13px] text-black/50">
              Informations complémentaires sur l'article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
