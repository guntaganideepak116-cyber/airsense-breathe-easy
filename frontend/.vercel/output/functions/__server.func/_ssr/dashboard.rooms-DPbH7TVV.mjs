import { i as __toESM } from "../_runtime.mjs";
import { c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as MapPin, L as Copy, W as Check, _ as Plus, g as Radio, i as WifiOff, p as ShieldAlert, r as Wifi, t as X } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { t as Button } from "./router-DPkWkbV_2.mjs";
import { n as statusTheme, t as formatTime } from "./status-Ba2cWdOL.mjs";
import { c as useDeviceStream, f as useSelectedDevice, s as useDeviceMutations } from "./queries-Dt74LbKo.mjs";
import { t as Input } from "./input-ft3feVIc.mjs";
import { t as useAirAlert } from "./use-air-alert-BG53I9XP.mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Label } from "./label-Co5OE-nu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.rooms-DPbH7TVV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
/** Shows the freshly minted device credentials exactly once. */
function DeviceCredentialsDialog({ credentials, onClose }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!credentials,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "rounded-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("dev.credsTitle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("dev.credsDesc") })] }),
				credentials && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyField, {
						label: t("dev.deviceId"),
						value: credentials.deviceId
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyField, {
						label: t("dev.apiKey"),
						value: credentials.apiKey,
						secret: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 rounded-2xl bg-moderate-soft p-3 text-xs text-foreground/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-moderate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("dev.warning") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "rounded-xl",
					onClick: onClose,
					children: t("dev.saved")
				}) })
			]
		})
	});
}
function CopyField({ label, value, secret }) {
	const { t } = useI18n();
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: `truncate font-mono text-sm ${secret ? "text-primary" : ""}`,
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "shrink-0 rounded-full",
				onClick: async () => {
					try {
						await navigator.clipboard.writeText(value);
					} catch {}
					setCopied(true);
					setTimeout(() => setCopied(false), 1800);
				},
				children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-3.5 w-3.5" }), copied ? t("dev.copied") : t("dev.copy")]
			})]
		})]
	});
}
function RoomsPage() {
	const { t, lang } = useI18n();
	const { devices, select } = useSelectedDevice();
	const { create } = useDeviceMutations();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [credentials, setCredentials] = (0, import_react.useState)(null);
	const [activeRoom, setActiveRoom] = (0, import_react.useState)(null);
	const submit = () => {
		const value = name.trim();
		if (!value) return;
		create.mutate(value, { onSuccess: ({ device, apiKey }) => {
			setCredentials({
				deviceId: device.id,
				apiKey
			});
			toast.success(t("dev.created"));
		} });
		setName("");
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl text-ink sm:text-3xl",
					children: t("dash.rooms")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Interactive room locations and sensor hardware status."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "rounded-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), t("rooms.add")]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "rounded-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: t("rooms.add") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: t("rooms.addDesc") })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "room",
									children: t("rooms.name")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "room",
									value: name,
									onChange: (e) => setName(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && submit(),
									className: "rounded-xl"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "rounded-xl",
								disabled: create.isPending,
								onClick: submit,
								children: t("dash.save")
							}) })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative overflow-hidden rounded-3xl border bg-card p-6 lg:col-span-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg",
							children: "Building Floor Plan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Click a pin to view room details"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-4 grid h-80 w-full place-items-center rounded-2xl border bg-secondary/20 p-4 grain-panel",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 500 320",
							className: "h-full w-full opacity-60",
							role: "img",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "20",
									y: "20",
									width: "460",
									height: "280",
									rx: "16",
									fill: "none",
									stroke: "var(--border)",
									strokeWidth: "2",
									strokeDasharray: "4 4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "180",
									y1: "20",
									x2: "180",
									y2: "300",
									stroke: "var(--border)",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "340",
									y1: "20",
									x2: "340",
									y2: "300",
									stroke: "var(--border)",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "20",
									y1: "160",
									x2: "480",
									y2: "160",
									stroke: "var(--border)",
									strokeWidth: "2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "70",
									y: "100",
									fill: "var(--muted-foreground)",
									fontSize: "14",
									children: "Classroom A"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "230",
									y: "100",
									fill: "var(--muted-foreground)",
									fontSize: "14",
									children: "Classroom B"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "390",
									y: "100",
									fill: "var(--muted-foreground)",
									fontSize: "14",
									children: "Hostel Hall"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "70",
									y: "240",
									fill: "var(--muted-foreground)",
									fontSize: "14",
									children: "Bedroom 1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "230",
									y: "240",
									fill: "var(--muted-foreground)",
									fontSize: "14",
									children: "Common Area"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "390",
									y: "240",
									fill: "var(--muted-foreground)",
									fontSize: "14",
									children: "Staff Room"
								})
							]
						}), devices.map((d, i) => {
							const coords = [
								{
									top: "28%",
									left: "24%"
								},
								{
									top: "68%",
									left: "55%"
								},
								{
									top: "35%",
									left: "78%"
								},
								{
									top: "72%",
									left: "22%"
								}
							][i % 4] || {
								top: "50%",
								left: "50%"
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								style: {
									top: coords.top,
									left: coords.left
								},
								onClick: () => {
									select(d.id);
									setActiveRoom(d);
								},
								className: cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-card px-3 py-1.5 shadow-lg transition-all duration-200 hover:scale-110", d.id === activeRoom?.id && "ring-2 ring-primary ring-offset-2"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 text-xs font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.name })]
								})
							}, d.id);
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-4 lg:col-span-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Sensor Status List"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: devices.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomCard, {
							device: d,
							isSelected: d.id === activeRoom?.id,
							onSelect: () => {
								select(d.id);
								setActiveRoom(d);
							}
						}, d.id))
					})]
				})]
			}),
			activeRoom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative rounded-3xl border bg-card p-6 shadow-md transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveRoom(null),
						className: "absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-xl font-bold",
							children: ["Sensor Details — ", activeRoom.name]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-6 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border bg-secondary/30 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Basic Information"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between border-b pb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Device ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-primary font-bold",
											children: activeRoom.id
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between border-b pb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Assigned Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeRoom.name })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Created At"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs",
											children: activeRoom.createdAt ? formatTime(activeRoom.createdAt, lang) : "Registered"
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border bg-secondary/30 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Current Hardware Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between border-b pb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Connection State"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: cn("flex items-center gap-1 font-medium", activeRoom.online ? "text-good" : "text-muted-foreground"),
											children: [activeRoom.online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "h-3.5 w-3.5" }), activeRoom.online ? "Online (Live stream)" : activeRoom.lastSeen ? "Offline" : "Never Connected"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between border-b pb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Last Seen"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs",
											children: activeRoom.lastSeen ? formatTime(activeRoom.lastSeen, lang) : "Never"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "API Data Endpoint"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-primary",
											children: "POST /api/devices/data"
										})]
									})
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeviceCredentialsDialog, {
				credentials,
				onClose: () => setCredentials(null)
			})
		]
	});
}
function RoomCard({ device, isSelected, onSelect }) {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { reading, status: streamStatus, tick } = useDeviceStream(device.id);
	useAirAlert(reading, device.name);
	const hasReading = Boolean(reading);
	const status = reading?.status ?? "good";
	const theme = statusTheme[status];
	const live = (streamStatus === "live" || device.online) && hasReading;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: onSelect,
		className: cn("status-transition cursor-pointer rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition-all hover:shadow-md", hasReading ? theme.soft : "bg-card", isSelected && "ring-2 ring-primary shadow-sm"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b pb-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-w-0 truncate font-display font-semibold text-base text-foreground",
					children: device.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex shrink-0 items-center gap-1 rounded-full border bg-card/90 px-2.5 py-0.5 text-[11px] font-medium", live ? "text-good border-good/30" : "text-muted-foreground border-border"),
					children: [live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "h-3 w-3" }), live ? t("dash.online") : device.lastSeen ? t("dash.offline") : "Never Connected"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: hasReading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-3 w-3 animate-pulse rounded-full shrink-0", theme.dot) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("font-display text-lg sm:text-xl font-bold", theme.text),
						children: t(theme.label)
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground font-medium",
						children: "Waiting for sensor data"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-wider text-muted-foreground block",
						children: "MQ-135"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-base font-bold text-foreground tabular-nums",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "value-pulse inline-block",
							children: reading?.mq135 ?? "—"
						}, tick)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground border-t pt-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 truncate text-[11px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: cn("h-3 w-3 shrink-0", live && "text-good") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: live ? t("rooms.live") : streamStatus === "reconnecting" ? t("rooms.reconnecting") : t("rooms.connecting")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: (e) => {
						e.stopPropagation();
						onSelect();
						navigate({ to: "/dashboard" });
					},
					className: "shrink-0 font-semibold text-primary hover:underline text-xs flex items-center gap-1",
					children: [t("dash.viewRoom"), " →"]
				})]
			})
		]
	});
}
//#endregion
export { RoomsPage as component };
