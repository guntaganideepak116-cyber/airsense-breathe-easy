import { i as __toESM } from "../_runtime.mjs";
import { a as useClerk, c as require_react } from "../_libs/@clerk/clerk-react+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { G as BellRing, T as LogOut, b as MessageSquare, c as Trash2, g as Radio, h as Save, w as Mail, x as MessageCircle } from "../_libs/lucide-react.mjs";
import { i as useI18n, r as cn } from "./router-DPkWkbV_.mjs";
import { t as Button } from "./router-DPkWkbV_2.mjs";
import { t as formatTime } from "./status-Ba2cWdOL.mjs";
import { h as useUserPreferences, l as useDevices, m as useUpdateUserPreferences, s as useDeviceMutations } from "./queries-Dt74LbKo.mjs";
import { a as pushState, i as pushPreference, n as disablePush, r as enablePush, t as Input } from "./input-ft3feVIc.mjs";
import { t as Label } from "./label-Co5OE-nu.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.settings-DLu-Ectq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function SettingsPage() {
	const { t, lang, setLang } = useI18n();
	const { data: devices } = useDevices();
	const { rename, remove } = useDeviceMutations();
	const [push, setPush] = (0, import_react.useState)(false);
	const [supported, setSupported] = (0, import_react.useState)(true);
	const [threshold, setThreshold] = (0, import_react.useState)(700);
	(0, import_react.useEffect)(() => {
		const state = pushState();
		setSupported(state !== "unsupported");
		setPush(state === "granted" && pushPreference());
		const saved = localStorage.getItem("airsense-threshold");
		if (saved) setThreshold(Number(saved));
	}, []);
	const turnOn = async () => {
		const next = await enablePush();
		setPush(next === "granted");
		if (next === "granted") toast.success(t("push.enabled"));
		else if (next === "denied") toast.error(t("push.blocked"));
		else if (next === "unsupported") toast.error(t("push.unsupported"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl text-ink sm:text-3xl",
				children: t("set.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiChannelAlertsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: t("set.notif")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: t("set.pushDesc")
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center justify-between gap-4 rounded-2xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: t("set.push")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: t("set.pushNote")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: push,
							disabled: !supported,
							"aria-label": t("set.push"),
							onCheckedChange: (v) => {
								if (v) turnOn();
								else {
									setPush(false);
									disablePush();
								}
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-2xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: t("set.threshold") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm tabular-nums text-muted-foreground",
								children: [threshold, " (Sensor Value)"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							className: "mt-4",
							min: 400,
							max: 1e3,
							step: 25,
							value: [threshold],
							onValueChange: ([v]) => setThreshold(v ?? 700),
							onValueCommit: ([v]) => {
								localStorage.setItem("airsense-threshold", String(v));
								toast.success(t("set.saved"));
							}
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: t("set.devices")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("dev.manageDesc")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-3",
						children: (devices ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									defaultValue: d.name,
									className: "rounded-xl",
									onBlur: (e) => {
										const value = e.target.value.trim();
										if (value && value !== d.name) {
											rename.mutate({
												id: d.id,
												name: value
											});
											toast.success(t("rooms.renamed"));
										}
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "shrink-0 rounded-full text-poor",
									"aria-label": t("rooms.remove"),
									onClick: () => {
										if (!window.confirm(`${t("dev.removeConfirm")}\n${t("dev.removeDesc")}`)) return;
										remove.mutate(d.id);
										toast.success(t("rooms.removed"));
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 grid gap-1 px-1 text-xs text-muted-foreground sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate font-mono",
									children: d.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "sm:text-right",
									children: [
										t("dev.lastSeen"),
										": ",
										d.lastSeen ? formatTime(d.lastSeen, lang) : t("dev.never")
									]
								})]
							})]
						}, d.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "mt-4 rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/rooms",
							children: t("rooms.add")
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: t("set.lang")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex gap-2",
					children: ["te", "en"].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: lang === l ? "default" : "outline",
						className: "rounded-full",
						onClick: () => setLang(l),
						children: l === "te" ? "తెలుగు" : "English"
					}, l))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountSection, {})
		]
	});
}
function MultiChannelAlertsSection() {
	const { data: prefs, isLoading } = useUserPreferences();
	const updatePrefs = useUpdateUserPreferences();
	const [phone, setPhone] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [channels, setChannels] = (0, import_react.useState)({
		sms: true,
		whatsapp: true,
		email: true
	});
	(0, import_react.useEffect)(() => {
		if (prefs) {
			setPhone(prefs.phoneNumber ?? "");
			setWhatsapp(prefs.whatsappNumber ?? "");
			setEmail(prefs.email ?? "");
			setChannels(prefs.alertChannels ?? {
				sms: true,
				whatsapp: true,
				email: true
			});
		}
	}, [prefs]);
	const handleToggleChannel = (channel, enabled) => {
		const nextChannels = {
			...channels,
			[channel]: enabled
		};
		setChannels(nextChannels);
		updatePrefs.mutate({ alertChannels: nextChannels }, {
			onSuccess: () => toast.success("Alert channel updated!"),
			onError: () => toast.error("Failed to update channel preference.")
		});
	};
	const handleSaveContactDetails = (e) => {
		e.preventDefault();
		updatePrefs.mutate({
			phoneNumber: phone.trim(),
			whatsappNumber: whatsapp.trim(),
			email: email.trim()
		}, {
			onSuccess: () => toast.success("Alert contact details saved successfully!"),
			onError: () => toast.error("Failed to save contact details.")
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl border bg-card p-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-ink",
						children: "Multi-Channel Alert Dispatch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Configure independent parallel alert channels (SMS via Fast2SMS, WhatsApp via Meta Cloud API, and Email via Resend) for instant notifications."
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 rounded-2xl border p-4 bg-background/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "SMS Alerts (Fast2SMS)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Instant SMS for air hazards & device offline events"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: channels.sms,
							disabled: isLoading,
							onCheckedChange: (v) => handleToggleChannel("sms", v)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 rounded-2xl border p-4 bg-background/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "WhatsApp Alerts (Meta Cloud API)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Template notification messages delivered to WhatsApp"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: channels.whatsapp,
							disabled: isLoading,
							onCheckedChange: (v) => handleToggleChannel("whatsapp", v)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 rounded-2xl border p-4 bg-background/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Email Alerts (Resend)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Detailed HTML metrics summary and dashboard action link"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: channels.email,
							disabled: isLoading,
							onCheckedChange: (v) => handleToggleChannel("email", v)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveContactDetails,
				className: "mt-6 border-t pt-5 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Recipient Contact Numbers & Address"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "smsPhone",
								className: "text-xs",
								children: "SMS Mobile Number (10-digit Indian No.)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "smsPhone",
								placeholder: "e.g. 9876543210",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								className: "rounded-xl"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "whatsappPhone",
								className: "text-xs",
								children: "WhatsApp Number (with country code)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "whatsappPhone",
								placeholder: "e.g. 919876543210",
								value: whatsapp,
								onChange: (e) => setWhatsapp(e.target.value),
								className: "rounded-xl"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "emailAddr",
							className: "text-xs",
							children: "Recipient Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "emailAddr",
							type: "email",
							placeholder: "e.g. user@example.com",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "rounded-xl"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: updatePrefs.isPending,
							className: "rounded-full gap-2 px-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), updatePrefs.isPending ? "Saving..." : "Save Contact Details"]
						})
					})
				]
			})
		]
	});
}
function AccountSection() {
	const { t } = useI18n();
	const clerk = useClerk();
	const handleLogout = async () => {
		try {
			await clerk.signOut();
		} catch (err) {
			console.error("Sign out error:", err);
		}
		window.location.href = "/";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-3xl border bg-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold text-foreground",
				children: t("set.account")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: t("nav.logoutDesc")
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border bg-background/50 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground",
				children: "Sign out of your session"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: "Safely end your AirSense session on this device."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "destructive",
				onClick: handleLogout,
				className: "rounded-full gap-2 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), t("nav.logout")]
			})]
		})]
	});
}
//#endregion
export { SettingsPage as component };
