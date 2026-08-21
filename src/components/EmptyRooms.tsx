import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { BreathingOrb } from "@/components/BreathingOrb";
import { Button } from "@/components/ui/button";

/** Guided first-run state shown when no device has been registered yet. */
export function EmptyRooms({ onAdd }: { onAdd: () => void }) {
  const { t } = useI18n();
  return (
    <section className="rounded-3xl border border-dashed bg-card/50 px-6 py-12 text-center">
      <BreathingOrb status="good" size="sm" className="mx-auto !h-36 !w-36 opacity-80" />
      <h2 className="mt-6 font-display text-xl text-ink sm:text-2xl">{t("empty.title")}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {t("empty.desc")}
      </p>
      <Button className="mt-6 rounded-full" onClick={onAdd}>
        <Plus className="mr-1 h-4 w-4" />
        {t("empty.cta")}
      </Button>
    </section>
  );
}
