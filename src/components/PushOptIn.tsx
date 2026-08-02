import { useEffect, useState } from "react";
import { BellRing, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { disablePush, enablePush, pushPreference, pushState, type PushState } from "@/lib/push";

const DISMISS_KEY = "airsense-push-dismissed";

/** Non-intrusive opt-in card. Hides itself once alerts are on or dismissed. */
export function PushOptIn() {
  const { t } = useI18n();
  const [state, setState] = useState<PushState | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setState(pushState());
    setEnabled(pushPreference());
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (state === null || state === "unsupported") return null;
  if (state === "granted" && enabled) return null;
  if (dismissed && state !== "denied") return null;
  if (state === "denied" && dismissed) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-card p-5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 pr-8">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary">
          <BellRing className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold">{t("push.title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {state === "denied" ? t("push.blocked") : t("push.desc")}
          </p>
          {state !== "denied" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="rounded-full"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  const next = await enablePush();
                  setState(next);
                  setEnabled(next === "granted");
                  setBusy(false);
                  if (next === "granted") toast.success(t("push.enabled"));
                  else if (next === "denied") toast.error(t("push.blocked"));
                }}
              >
                {t("push.enable")}
              </Button>
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  localStorage.setItem(DISMISS_KEY, "1");
                  setDismissed(true);
                  void disablePush();
                }}
              >
                {t("push.later")}
              </Button>
            </div>
          )}
        </div>
      </div>
      <button
        aria-label={t("push.later")}
        className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </section>
  );
}
