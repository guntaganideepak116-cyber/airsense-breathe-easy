import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function LangToggle({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const { lang, setLang, t } = useI18n();
  return (
    <Button
      variant={variant}
      size="sm"
      className="gap-2 rounded-full"
      onClick={() => setLang(lang === "te" ? "en" : "te")}
      aria-label="Toggle language"
    >
      <Languages className="h-4 w-4" />
      {t("lang.toggle")}
    </Button>
  );
}
