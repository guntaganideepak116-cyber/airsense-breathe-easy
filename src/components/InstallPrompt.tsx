import { useEffect, useState } from "react";
import { Download, X, Wind } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallPrompt() {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem("airsense-install-dismissed") === "1");
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!deferred || dismissed) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border bg-card p-4 shadow-lg sm:inset-x-auto sm:right-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary">
          <Wind className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{t("pwa.install")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("pwa.installDesc")}</p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              className="rounded-full"
              onClick={async () => {
                await deferred.prompt();
                setDeferred(null);
              }}
            >
              <Download className="mr-1 h-4 w-4" />
              {t("pwa.installBtn")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                localStorage.setItem("airsense-install-dismissed", "1");
                setDismissed(true);
              }}
            >
              {t("pwa.later")}
            </Button>
          </div>
        </div>
        <button
          aria-label="Close"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setDismissed(true)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
