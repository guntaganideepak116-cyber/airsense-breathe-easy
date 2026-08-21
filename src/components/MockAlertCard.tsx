import { useState } from "react";
import { AlertTriangle, CheckCircle2, FlaskConical, Loader2, Send, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSendMockAlert } from "@/lib/queries";
import type { MockAlertResult } from "@/lib/airsense";
import { toast } from "sonner";

export function MockAlertCard() {
  const sendMock = useSendMockAlert();
  const [result, setResult] = useState<MockAlertResult | null>(null);
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    sendMock.mutate(undefined, {
      onSuccess: (data) => {
        setResult(data);
        setOpen(true);
        if (data.whatsapp?.sent || data.email?.sent) {
          toast.success("Mock alert dispatched via backend services!");
        } else {
          toast.warning("Mock alert finished, but check API key credentials.");
        }
      },
      onError: (err) => {
        toast.error(`Failed to send mock alert: ${err.message}`);
      },
    });
  };

  return (
    <>
      <section className="rounded-3xl border bg-card p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <FlaskConical className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink">Multi-Channel Alert Test System</h3>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  Testing Only
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Trigger a simulated critical sensor reading (MQ-135: 850, Temp: 32°C, Humidity: 72%
                in Test Room) through both WhatsApp & Resend Email using your server-side API
                credentials.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-muted/40 p-4">
          <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-4">
            <div>
              <span className="font-medium text-foreground">Room:</span> Test Room
            </div>
            <div>
              <span className="font-medium text-foreground">MQ-135:</span> 850 ppm (Critical)
            </div>
            <div>
              <span className="font-medium text-foreground">Temp:</span> 32°C
            </div>
            <div>
              <span className="font-medium text-foreground">Humidity:</span> 72%
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Saves event to <strong className="text-foreground">Alert History</strong> as{" "}
            <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
              "TEST ALERT"
            </span>
            .
          </p>

          <Button
            type="button"
            onClick={handleSend}
            disabled={sendMock.isPending}
            className="rounded-full bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 gap-2 px-5 shrink-0"
          >
            {sendMock.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Dispatching Alert...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Mock Alert
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Dispatch Results Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              Mock Alert Dispatch Results
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Simulated reading: <strong>Test Room</strong> (MQ-135: 850, Temp: 32°C, Hum: 72%).
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4 py-2">
              {/* WhatsApp Status */}
              <div className="rounded-2xl border p-4 bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">WhatsApp Dispatch</span>
                  {result.whatsapp?.sent ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />✓ Sent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <XCircle className="h-4 w-4" />✗ Failed
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  {result.whatsapp?.reason ||
                    (result.whatsapp?.sent ? "Delivered" : "Not delivered")}
                  {result.whatsapp?.provider && ` (via ${result.whatsapp.provider})`}
                </p>
              </div>

              {/* Email Status */}
              <div className="rounded-2xl border p-4 bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Email (Resend) Dispatch</span>
                  {result.email?.sent ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />✓ Sent
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <XCircle className="h-4 w-4" />✗ Failed
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Status:{" "}
                  {result.email?.reason || (result.email?.sent ? "Delivered" : "Not delivered")}
                </p>
              </div>

              <div className="rounded-2xl bg-muted/60 p-3 text-center text-xs text-muted-foreground">
                Notice logged in <strong>Alert History</strong> as{" "}
                <span className="font-semibold text-foreground">"TEST ALERT"</span>.
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full px-6"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
