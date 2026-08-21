import { useState } from "react";
import { Check, Copy, ShieldAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Credentials = { deviceId: string; apiKey: string };

/** Shows the freshly minted device credentials exactly once. */
export function DeviceCredentialsDialog({
  credentials,
  onClose,
}: {
  credentials: Credentials | null;
  onClose: () => void;
}) {
  const { t } = useI18n();

  return (
    <Dialog open={!!credentials} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>{t("dev.credsTitle")}</DialogTitle>
          <DialogDescription>{t("dev.credsDesc")}</DialogDescription>
        </DialogHeader>

        {credentials && (
          <div className="space-y-3">
            <CopyField label={t("dev.deviceId")} value={credentials.deviceId} />
            <CopyField label={t("dev.apiKey")} value={credentials.apiKey} secret />
          </div>
        )}

        <div className="flex items-start gap-2 rounded-2xl bg-moderate-soft p-3 text-xs text-foreground/80">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-moderate" />
          <p>{t("dev.warning")}</p>
        </div>

        <DialogFooter>
          <Button className="rounded-xl" onClick={onClose}>
            {t("dev.saved")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CopyField({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-2xl border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <code className={`truncate font-mono text-sm ${secret ? "text-primary" : ""}`}>
          {value}
        </code>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 rounded-full"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
            } catch {
              /* clipboard unavailable */
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
        >
          {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
          {copied ? t("dev.copied") : t("dev.copy")}
        </Button>
      </div>
    </div>
  );
}
