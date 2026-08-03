import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "te" | "en";

type Dict = Record<string, { te: string; en: string }>;

export const dict = {
  "brand.tagline": { te: "ఇంటి లోపలి గాలి నాణ్యత పర్యవేక్షణ", en: "Indoor air quality monitoring" },
  "nav.how": { te: "ఎలా పనిచేస్తుంది", en: "How it works" },
  "nav.problem": { te: "సమస్య", en: "The problem" },
  "nav.features": { te: "ఫీచర్లు", en: "Features" },
  "nav.compare": { te: "పోలిక", en: "Compare" },
  "nav.dashboard": { te: "డాష్‌బోర్డ్", en: "Dashboard" },
  "nav.signin": { te: "సైన్ ఇన్", en: "Sign in" },
  "nav.signup": { te: "ఉచితంగా ప్రారంభించండి", en: "Get started" },
  "lang.toggle": { te: "English", en: "తెలుగు" },

  "hero.eyebrow": { te: "ఆంధ్రప్రదేశ్ & తెలంగాణ కుటుంబాలు, పాఠశాలల కోసం", en: "For families and schools across Andhra Pradesh & Telangana" },
  "hero.title": { te: "గది శుభ్రంగా కనిపించవచ్చు. గాలి మాత్రం కాకపోవచ్చు.", en: "The room can look clean. The air often isn't." },
  "hero.sub": {
    te: "పంట వ్యర్థాల దహనం, రోడ్డు దుమ్ము, ట్రాఫిక్ పొగ — ఇవన్నీ తరగతి గదిలోకి, పిల్లల పడక గదిలోకి కనిపించకుండా చేరతాయి. AirSense ప్రతి గదిలోని గాలిని నిరంతరం కొలుస్తుంది, గాలి పాడైన క్షణంలోనే అక్కడే హెచ్చరిస్తుంది, మీ ఫోన్‌కు చూపిస్తుంది.",
    en: "Crop-residue burning, road dust and traffic fumes drift silently into classrooms and children's bedrooms. AirSense measures the air in each room continuously, sounds a local alert the moment it turns poor, and shows it live on your phone.",
  },
  "hero.cta": { te: "ఒక గదిని పర్యవేక్షించడం ప్రారంభించండి", en: "Start monitoring a room" },
  "hero.cta2": { te: "లైవ్ డాష్‌బోర్డ్ చూడండి", en: "See the live dashboard" },
  "hero.badge1": { te: "సెన్సార్ + లోకల్ బజర్", en: "Sensor + local buzzer" },
  "hero.badge2": { te: "తెలుగు-ఫస్ట్", en: "Telugu-first" },
  "hero.badge3": { te: "ఫోన్‌లో ఇన్‌స్టాల్ అవుతుంది", en: "Installs on your phone" },
  "hero.orb.label": { te: "ప్రస్తుత గాలి", en: "Air right now" },

  "problem.kicker": { te: "కనిపించని సమస్య", en: "The invisible problem" },
  "problem.title": { te: "గాలి పాడైనప్పుడు దానికి వాసన ఉండదు, రంగు ఉండదు", en: "Poor air has no smell, no colour, no warning" },
  "problem.body": {
    te: "మూసి ఉంచిన తరగతి గదిలో 40 మంది పిల్లలు ఉంటే, రెండు గంటల్లోనే CO₂ మరియు VOC స్థాయిలు ఏకాగ్రత తగ్గే స్థాయికి చేరతాయి. కిటికీ తెరిస్తే బయటి దుమ్ము లోపలికి. ఏది మెరుగో తెలియాలంటే కొలత కావాలి.",
    en: "Put forty children in a closed classroom and CO₂ and VOC levels reach focus-dulling concentrations within two hours. Open the window and outdoor dust comes in. Knowing which is better requires measurement, not guesswork.",
  },
  "problem.p1.t": { te: "ఏకాగ్రత తగ్గుతుంది", en: "Focus drops" },
  "problem.p1.d": { te: "పేలవమైన గాలిలో పిల్లల శ్రద్ధ, జ్ఞాపకశక్తి గణనీయంగా తగ్గుతాయని అధ్యయనాలు చెబుతున్నాయి.", en: "Studies link stuffy indoor air to measurable drops in children's attention and recall." },
  "problem.p2.t": { te: "శ్వాస సమస్యలు", en: "Breathing suffers" },
  "problem.p2.d": { te: "ఆస్తమా, అలర్జీ ఉన్న పిల్లలకు ఇంటి లోపలి కణాలు బయటి వాటికంటే ఎక్కువ ప్రమాదం.", en: "For asthmatic and allergic children, indoor particles matter more than outdoor ones." },
  "problem.p3.t": { te: "ఎవరూ కొలవడం లేదు", en: "Nobody is measuring" },
  "problem.p3.d": { te: "నగర స్థాయి AQI యాప్‌లు మీ గదిలోని గాలి గురించి ఏమీ చెప్పవు.", en: "City-level AQI apps say nothing about the room your child is sitting in." },

  "how.kicker": { te: "ఎలా పనిచేస్తుంది", en: "How it works" },
  "how.title": { te: "సెన్సార్ నుండి మీ చేతిలోని ఫోన్ వరకు", en: "From the sensor to your hand" },
  "how.s1.t": { te: "గదిలో సెన్సార్", en: "A sensor in the room" },
  "how.s1.d": { te: "MQ135 గాలి నాణ్యతను, DHT22 ఉష్ణోగ్రత & తేమను ప్రతి కొన్ని సెకన్లకు కొలుస్తాయి.", en: "An MQ135 reads air quality and a DHT22 reads temperature and humidity every few seconds." },
  "how.s2.t": { te: "అక్కడికక్కడే హెచ్చరిక", en: "An alert in the room" },
  "how.s2.d": { te: "గాలి పేలవంగా మారితే బజర్ మోగుతుంది, LED ఎరుపుగా మారుతుంది — ఉపాధ్యాయుడు వెంటనే కిటికీ తెరవగలరు.", en: "If air turns poor the buzzer sounds and the LED turns red, so a teacher can act immediately." },
  "how.s3.t": { te: "డేటా లైవ్‌గా ప్రవహిస్తుంది", en: "Data streams live" },
  "how.s3.d": { te: "ప్రతి రీడింగ్ సెకన్లలోనే డాష్‌బోర్డ్‌కు చేరుతుంది, చరిత్రగా భద్రపరచబడుతుంది.", en: "Every reading reaches the dashboard within seconds and is stored as history." },
  "how.s4.t": { te: "ఎక్కడి నుండైనా చూడండి", en: "Check from anywhere" },
  "how.s4.d": { te: "తల్లిదండ్రులు, ఉపాధ్యాయులు ఏ గదినైనా ఫోన్‌లో లేదా వెబ్‌సైట్‌లో చూడవచ్చు.", en: "Parents and teachers can check any room from the app or the website." },

  "preview.kicker": { te: "డాష్‌బోర్డ్ ప్రివ్యూ", en: "Dashboard preview" },
  "preview.title": { te: "సైన్ అప్ చేయకముందే చూడండి", en: "See it before you sign up" },
  "preview.note": { te: "ఇది ఉదాహరణ డేటాతో కూడిన నమూనా వీక్షణ.", en: "Illustrative view with sample data." },

  "compare.kicker": { te: "పోలిక", en: "Comparison" },
  "compare.title": { te: "ఇప్పుడున్న మార్గాలతో పోలిస్తే", en: "Compared with what exists today" },
  "compare.col1": { te: "పర్యవేక్షణే లేదు", en: "No monitoring" },
  "compare.col2": { te: "వాణిజ్య మానిటర్లు", en: "Commercial monitors" },
  "compare.col3": { te: "ప్రభుత్వ AQI యాప్‌లు", en: "Government AQI apps" },
  "compare.col4": { te: "AirSense", en: "AirSense" },
  "compare.r1": { te: "ఖర్చు", en: "Cost" },
  "compare.r1c1": { te: "₹0 — కానీ ఏమీ తెలియదు", en: "₹0 — but zero visibility" },
  "compare.r1c2": { te: "₹3,000–15,000+ ఒక్కో గదికి", en: "₹3,000–15,000+ per room" },
  "compare.r1c3": { te: "ఉచితం", en: "Free" },
  "compare.r1c4": { te: "తక్కువ ఖర్చు హార్డ్‌వేర్", en: "Low-cost hardware" },
  "compare.r2": { te: "గది స్థాయి కచ్చితత్వం", en: "Room-level accuracy" },
  "compare.r3": { te: "తక్షణ స్థానిక హెచ్చరిక", en: "Instant local alert" },
  "compare.r4": { te: "రిమోట్‌గా చూడగలగడం", en: "Remote visibility" },
  "compare.r5": { te: "తెలుగులో", en: "Available in Telugu" },
  "compare.yes": { te: "ఉంది", en: "Yes" },
  "compare.no": { te: "లేదు", en: "No" },
  "compare.partial": { te: "పాక్షికం", en: "Partial" },

  "features.kicker": { te: "ఫీచర్లు", en: "Features" },
  "features.title": { te: "పాఠశాలలకు, ఇళ్లకు అవసరమైనవి మాత్రమే", en: "Only what schools and homes actually need" },
  "features.f1.t": { te: "రియల్-టైమ్ గది పర్యవేక్షణ", en: "Real-time room monitoring" },
  "features.f1.d": { te: "ప్రతి కొన్ని సెకన్లకు తాజా రీడింగ్.", en: "A fresh reading every few seconds." },
  "features.f2.t": { te: "తక్షణ స్థానిక హెచ్చరికలు", en: "Instant local alerts" },
  "features.f2.d": { te: "బజర్ + LED గదిలోనే హెచ్చరిస్తాయి.", en: "Buzzer and LED warn inside the room itself." },
  "features.f3.t": { te: "రిమోట్ డాష్‌బోర్డ్", en: "Remote dashboard" },
  "features.f3.d": { te: "ఎక్కడి నుండైనా ఏ గదినైనా చూడండి.", en: "Check any room from anywhere." },
  "features.f4.t": { te: "యాప్ లేదా వెబ్‌సైట్", en: "App or website" },
  "features.f4.d": { te: "ఫోన్‌లో ఇన్‌స్టాల్ చేసుకోవచ్చు, ఆఫ్‌లైన్‌లోనూ పనిచేస్తుంది.", en: "Installable on your phone and usable offline." },
  "features.f5.t": { te: "చరిత్ర & ధోరణులు", en: "History and trends" },
  "features.f5.d": { te: "24 గంటలు, 7 రోజులు, 30 రోజుల ధోరణులు.", en: "24-hour, 7-day and 30-day trends." },
  "features.f6.t": { te: "తెలుగు-ఫస్ట్", en: "Telugu-first" },
  "features.f6.d": { te: "మొత్తం యాప్ తెలుగులో; హెచ్చరికలు ఎప్పుడూ తెలుగులోనే.", en: "The whole app in Telugu; alerts always in Telugu." },

  "cases.kicker": { te: "ఉపయోగ సందర్భాలు", en: "Use cases" },
  "cases.title": { te: "ఇలా ఉపయోగపడుతుంది", en: "Where it helps" },
  "cases.note": { te: "ఇవి ఉదాహరణ సందర్భాలు — నిజమైన వినియోగదారుల అభిప్రాయాలు కావు.", en: "Illustrative scenarios — not real testimonials." },
  "cases.c1.t": { te: "పరీక్షల సమయంలో తరగతి గది", en: "A classroom during exams" },
  "cases.c1.d": { te: "మూసిన కిటికీలు, 40 మంది విద్యార్థులు. మధ్యాహ్నం 3 గంటలకు గాలి పేలవంగా మారితే బజర్ మోగుతుంది, ఉపాధ్యాయుడు కిటికీ తెరుస్తారు.", en: "Closed windows, forty students. When air turns poor at 3 PM the buzzer sounds and the teacher opens a window." },
  "cases.c2.t": { te: "పిల్లల పడక గది", en: "A child's bedroom" },
  "cases.c2.d": { te: "రాత్రి పొగ, దోమల కాయిల్ పొగ పెరిగితే తల్లిదండ్రుల ఫోన్‌కు నోటిఫికేషన్ వస్తుంది.", en: "If smoke or mosquito-coil fumes build up at night, the parent's phone gets a notification." },
  "cases.c3.t": { te: "హాస్టల్ కామన్ రూమ్", en: "A hostel common room" },
  "cases.c3.d": { te: "వార్డెన్ అన్ని గదులను ఒకే స్క్రీన్‌లో చూసి, ఏ గదిలో గాలి పాడైందో వెంటనే తెలుసుకుంటారు.", en: "A warden sees every room on one screen and knows instantly which one needs air." },

  "cta.title": { te: "ఒక గదితో ప్రారంభించండి", en: "Start with one room" },
  "cta.sub": { te: "సెటప్ కొన్ని నిమిషాలే. మొదటి రీడింగ్ వచ్చాక తేడా మీకే తెలుస్తుంది.", en: "Setup takes minutes. The first reading usually says everything." },
  "footer.rights": { te: "AirSense — ఆంధ్రప్రదేశ్ & తెలంగాణ కోసం రూపొందించబడింది", en: "AirSense — built for Andhra Pradesh & Telangana" },

  "status.good": { te: "బాగుంది", en: "Good" },
  "status.moderate": { te: "మధ్యస్థం", en: "Moderate" },
  "status.poor": { te: "పేలవం", en: "Poor" },
  "status.good.advice": { te: "గాలి బాగుంది — ప్రస్తుతం ఏమీ చేయనవసరం లేదు.", en: "Air is good — nothing to do right now." },
  "status.moderate.advice": { te: "గాలి మధ్యస్థంగా ఉంది — ఒక కిటికీ తెరవడం మంచిది.", en: "Air is moderate — consider opening a window." },
  "status.poor.advice": { te: "గాలి పేలవంగా ఉంది — వెంటనే కిటికీలు తెరవండి, ఫ్యాన్ ఆన్ చేయండి, పొగ మూలాలను ఆపండి.", en: "Air is poor — open windows now, switch on a fan and stop any source of smoke." },

  "dash.title": { te: "డాష్‌బోర్డ్", en: "Dashboard" },
  "dash.overview": { te: "అవలోకనం", en: "Overview" },
  "dash.history": { te: "చరిత్ర", en: "History" },
  "dash.rooms": { te: "గదులు", en: "Rooms" },
  "dash.settings": { te: "సెట్టింగ్‌లు", en: "Settings" },
  "dash.airquality": { te: "గాలి నాణ్యత", en: "Air quality" },
  "dash.sensorReading": { te: "MQ135 రీడింగ్", en: "MQ135 reading" },
  "dash.temp": { te: "ఉష్ణోగ్రత", en: "Temperature" },
  "dash.humidity": { te: "తేమ", en: "Humidity" },
  "dash.comfort.ok": { te: "సౌకర్యవంతమైన పరిధిలో", en: "Within comfort range" },
  "dash.comfort.high": { te: "సౌకర్య పరిధి కంటే ఎక్కువ", en: "Above comfort range" },
  "dash.comfort.low": { te: "సౌకర్య పరిధి కంటే తక్కువ", en: "Below comfort range" },
  "dash.device": { te: "పరికరం", en: "Device" },
  "dash.online": { te: "ఆన్‌లైన్", en: "Online" },
  "dash.offline": { te: "ఆఫ్‌లైన్", en: "Offline" },
  "dash.updated": { te: "చివరిగా నవీకరించబడింది", en: "Last updated" },
  "dash.rename": { te: "పేరు మార్చు", en: "Rename" },
  "dash.save": { te: "సేవ్ చేయి", en: "Save" },
  "dash.cancel": { te: "రద్దు", en: "Cancel" },
  "dash.alertStatus": { te: "హెచ్చరిక స్థితి", en: "Alert status" },
  "dash.lastPoor": { te: "చివరి 'పేలవం' సంఘటన", en: "Last poor-air event" },
  "dash.noPoor": { te: "గత 30 రోజుల్లో పేలవమైన గాలి నమోదు కాలేదు.", en: "No poor-air event in the last 30 days." },
  "dash.buzzerFired": { te: "బజర్ మోగింది", en: "Buzzer triggered" },
  "dash.guidance": { te: "ఇప్పుడు ఏం చేయాలి", en: "What to do now" },
  "dash.live": { te: "లైవ్", en: "Live" },
  "dash.offlineBanner": { te: "ఆఫ్‌లైన్ — చివరిగా తెలిసిన డేటా చూపిస్తున్నాం", en: "Offline — showing last known data from" },
  "dash.viewRoom": { te: "ఈ గదిని చూడండి", en: "View room" },

  "hist.title": { te: "చరిత్ర & ధోరణులు", en: "History & trends" },
  "hist.24h": { te: "24 గంటలు", en: "24 hours" },
  "hist.7d": { te: "7 రోజులు", en: "7 days" },
  "hist.30d": { te: "30 రోజులు", en: "30 days" },
  "hist.aqChart": { te: "గాలి నాణ్యత ధోరణి", en: "Air quality trend" },
  "hist.thChart": { te: "ఉష్ణోగ్రత & తేమ", en: "Temperature & humidity" },
  "hist.events": { te: "సంఘటనల లాగ్", en: "Event log" },
  "hist.eventPoor": { te: "గాలి 'పేలవం' స్థాయికి చేరింది", en: "Air crossed into Poor" },
  "hist.insight": { te: "గమనిక", en: "Insight" },
  "hist.noEvents": { te: "ఈ కాలంలో సంఘటనలు లేవు.", en: "No events in this period." },

  "rooms.title": { te: "అన్ని గదులు", en: "All rooms" },
  "rooms.add": { te: "కొత్త గది జోడించండి", en: "Add a room" },
  "rooms.addDesc": { te: "పరికరం పేరు ఇవ్వండి — ఉదా. \"తరగతి 4B\"", en: "Give the device a name — e.g. \"Classroom 4B\"" },
  "rooms.name": { te: "గది పేరు", en: "Room name" },
  "rooms.created": { te: "గది జోడించబడింది", en: "Room added" },
  "rooms.removed": { te: "గది తొలగించబడింది", en: "Room removed" },
  "rooms.renamed": { te: "పేరు మార్చబడింది", en: "Renamed" },
  "rooms.remove": { te: "తొలగించు", en: "Remove" },
  "rooms.live": { te: "లైవ్ స్ట్రీమ్", en: "Live stream" },
  "rooms.reconnecting": { te: "మళ్లీ కలుపుతున్నాం…", en: "Reconnecting…" },
  "rooms.connecting": { te: "కలుపుతున్నాం…", en: "Connecting…" },

  "dev.created": { te: "పరికరం నమోదైంది", en: "Device registered" },
  "dev.credsTitle": { te: "ఈ వివరాలు ఇప్పుడే కాపీ చేసుకోండి", en: "Copy these credentials now" },
  "dev.credsDesc": {
    te: "ఈ API కీ ఒక్కసారి మాత్రమే చూపబడుతుంది. దీన్ని మీ ESP32 పరికర కోడ్‌లో పెట్టండి.",
    en: "This API key is shown only once. Paste it into your ESP32 device firmware.",
  },
  "dev.deviceId": { te: "పరికర ID", en: "Device ID" },
  "dev.apiKey": { te: "API కీ", en: "API key" },
  "dev.copy": { te: "కాపీ", en: "Copy" },
  "dev.copied": { te: "కాపీ అయ్యింది", en: "Copied" },
  "dev.warning": {
    te: "హెచ్చరిక: ఈ విండో మూసిన తర్వాత API కీ మళ్లీ చూడలేరు.",
    en: "Warning: once you close this window the API key cannot be retrieved again.",
  },
  "dev.saved": { te: "నేను భద్రపరిచాను", en: "I've saved it" },
  "dev.lastSeen": { te: "చివరిగా కనిపించింది", en: "Last seen" },
  "dev.never": { te: "ఇంకా కనెక్ట్ కాలేదు", en: "Not connected yet" },
  "dev.manageDesc": { te: "మీ సెన్సార్ పరికరాలకు పేరు మార్చండి లేదా తొలగించండి.", en: "Rename or remove your sensor devices." },
  "dev.removeConfirm": { te: "ఈ పరికరాన్ని తొలగించాలా?", en: "Remove this device?" },
  "dev.removeDesc": { te: "దాని రీడింగ్‌లు ఇకపై డాష్‌బోర్డ్‌లో కనిపించవు.", en: "Its readings will no longer appear on your dashboard." },

  "push.title": { te: "గాలి పాడైతే వెంటనే తెలుసుకోండి", en: "Know the moment air turns poor" },
  "push.desc": {
    te: "బ్రౌజర్ నోటిఫికేషన్లు ఆన్ చేయండి — యాప్ మూసి ఉన్నా హెచ్చరిక వస్తుంది.",
    en: "Turn on browser notifications — alerts reach you even when the app is closed.",
  },
  "push.enable": { te: "నోటిఫికేషన్లు ఆన్ చేయండి", en: "Turn on alerts" },
  "push.later": { te: "తర్వాత", en: "Not now" },
  "push.enabled": { te: "నోటిఫికేషన్లు ఆన్‌లో ఉన్నాయి", en: "Alerts are on" },
  "push.blocked": {
    te: "బ్రౌజర్‌లో నోటిఫికేషన్లు నిరోధించబడ్డాయి. సైట్ సెట్టింగ్‌లలో అనుమతించండి.",
    en: "Notifications are blocked in your browser. Allow them in site settings.",
  },
  "push.unsupported": { te: "ఈ బ్రౌజర్‌లో నోటిఫికేషన్లు పనిచేయవు.", en: "This browser does not support notifications." },


  "set.title": { te: "సెట్టింగ్‌లు", en: "Settings" },
  "set.notif": { te: "నోటిఫికేషన్ ప్రాధాన్యతలు", en: "Notification preferences" },
  "set.push": { te: "పుష్ హెచ్చరికలు", en: "Push alerts" },
  "set.pushDesc": { te: "పర్యవేక్షిస్తున్న గదిలో గాలి పేలవంగా మారిన క్షణంలోనే మీకు తెలియజేస్తాం.", en: "Get notified the moment air quality turns poor in a monitored room." },
  "set.pushNote": { te: "హెచ్చరికలు ఎప్పుడూ తెలుగులోనే పంపబడతాయి — అవి అత్యవసర సందేశాలు.", en: "Alerts are always sent in Telugu, since they are time-critical." },
  "set.enable": { te: "అనుమతించండి", en: "Enable" },
  "set.threshold": { te: "హెచ్చరిక థ్రెషోల్డ్ (MQ135)", en: "Alert threshold (MQ135)" },
  "set.devices": { te: "పరికర నిర్వహణ", en: "Device management" },
  "set.lang": { te: "భాష", en: "Language" },
  "set.account": { te: "ఖాతా", en: "Account" },
  "set.signout": { te: "సైన్ అవుట్", en: "Sign out" },
  "set.saved": { te: "సేవ్ చేయబడింది", en: "Saved" },

  "auth.signin": { te: "మీ ఖాతాలోకి సైన్ ఇన్", en: "Sign in to AirSense" },
  "auth.signup": { te: "AirSense ఖాతా సృష్టించండి", en: "Create your AirSense account" },
  "auth.email": { te: "ఇమెయిల్ లేదా ఫోన్ నంబర్", en: "Email or phone number" },
  "auth.password": { te: "పాస్‌వర్డ్", en: "Password" },
  "auth.continue": { te: "కొనసాగించండి", en: "Continue" },
  "auth.toSignup": { te: "ఖాతా లేదా? సృష్టించండి", en: "No account? Create one" },
  "auth.toSignin": { te: "ఇప్పటికే ఖాతా ఉందా? సైన్ ఇన్", en: "Already have an account? Sign in" },
  "auth.note": { te: "డెమో మోడ్: ఏ వివరాలతోనైనా డాష్‌బోర్డ్‌లోకి ప్రవేశించవచ్చు.", en: "Demo mode: any details will take you to the dashboard." },

  "pwa.install": { te: "AirSense ను ఫోన్‌లో ఇన్‌స్టాల్ చేయండి", en: "Install AirSense on your phone" },
  "pwa.installDesc": { te: "హోమ్ స్క్రీన్ నుండే తెరవండి, ఆఫ్‌లైన్‌లోనూ చివరి రీడింగ్ చూడండి.", en: "Open it from your home screen and see the last reading even offline." },
  "pwa.installBtn": { te: "ఇన్‌స్టాల్", en: "Install" },
  "pwa.later": { te: "తర్వాత", en: "Later" },

  "today.title": { te: "ఈ రోజు సారాంశం", en: "Today's summary" },
  "today.typical": { te: "ఈ రోజు సాధారణ స్థితి", en: "Typical today" },
  "today.episodes": { te: "'పేలవం' సంఘటనలు", en: "Poor episodes" },
  "today.duration": { te: "పేలవమైన గాలిలో గడిచిన సమయం", en: "Time in poor air" },
  "today.best": { te: "ప్రస్తుతం ఉత్తమ గది", en: "Best room now" },
  "today.worst": { te: "ప్రస్తుతం చెత్త గది", en: "Worst room now" },
  "today.minutes": { te: "నిమిషాలు", en: "min" },
  "today.none": { te: "ఈ రోజుకి ఇంకా డేటా లేదు.", en: "No readings for today yet." },

  "out.title": { te: "లోపల vs బయట", en: "Indoor vs outdoor" },
  "out.indoor": { te: "లోపల", en: "Indoor" },
  "out.outdoor": { te: "బయట", en: "Outdoor" },
  "out.tooltip": {
    te: "బయటి AQI అనేది నగరం మొత్తానికి సగటు — ఈ గదిలోని నిజమైన గాలిని అది చూపించకపోవచ్చు.",
    en: "Outdoor AQI is a citywide average and may not reflect this room's actual air",
  },
  "out.unavailable": { te: "బయటి AQI ప్రస్తుతం అందుబాటులో లేదు", en: "Outdoor AQI unavailable right now" },
  "out.loading": { te: "బయటి AQI తెస్తున్నాం…", en: "Fetching outdoor AQI…" },
  "out.city": { te: "నగరం", en: "City" },
  "out.cityDesc": {
    te: "బయటి AQI పోలిక కోసం మీకు దగ్గరి నగరాన్ని ఎంచుకోండి.",
    en: "Pick the city nearest you for the outdoor AQI comparison.",
  },
  "out.source": { te: "మూలం: Open-Meteo పబ్లిక్ AQI", en: "Source: Open-Meteo public AQI" },
  "out.aqi": { te: "AQI", en: "AQI" },
  "out.gap": {
    te: "ఈ గదిలోని గాలి బయటి నగర సగటుతో సరిపోలడం లేదు.",
    en: "This room's air does not match the citywide average.",
  },

  "action.title": { te: "ఇప్పుడు ఏం చేయాలి", en: "What to do now" },
  "action.good": { te: "గాలి బాగుంది — ప్రస్తుతం ఏమీ చేయనవసరం లేదు.", en: "Air quality is good — no action needed." },
  "action.goodRising": {
    te: "గాలి ఇంకా బాగానే ఉంది, కానీ రీడింగ్ పెరుగుతోంది — గమనిస్తూ ఉండండి.",
    en: "Air is still good but the reading is climbing — keep an eye on it.",
  },
  "action.moderate": { te: "గాలి మధ్యస్థంగా ఉంది — ఒక కిటికీ తెరవడం మంచిది.", en: "Air is moderate — opening a window would help." },
  "action.moderateRising": {
    te: "గాలి నాణ్యత తగ్గుతోంది — త్వరలో ఒక కిటికీ తెరవడం మంచిది.",
    en: "Air quality is declining — consider opening a window soon.",
  },
  "action.moderateFalling": {
    te: "గాలి మెరుగవుతోంది — ప్రస్తుత వెంటిలేషన్ పనిచేస్తోంది.",
    en: "Air is improving — whatever you changed is working.",
  },
  "action.poor": {
    te: "గాలి పేలవంగా ఉంది — వెంటనే కిటికీ తెరవండి లేదా ఫ్యాన్/వెంటిలేషన్ ఆన్ చేయండి.",
    en: "Air quality is poor — open a window or turn on ventilation now.",
  },
  "action.poorFalling": {
    te: "గాలి ఇంకా పేలవంగానే ఉంది కానీ మెరుగవుతోంది — వెంటిలేషన్ కొనసాగించండి.",
    en: "Air is still poor but improving — keep the ventilation going.",
  },
  "action.trend.rising": { te: "పెరుగుతోంది", en: "Rising" },
  "action.trend.falling": { te: "తగ్గుతోంది", en: "Improving" },
  "action.trend.steady": { te: "స్థిరంగా ఉంది", en: "Steady" },
  "action.disclaimer": {
    te: "AirSense ఒక ముందస్తు హెచ్చరిక & అవగాహన సాధనం — ఇది వైద్య పరికరం కాదు, రోగ నిర్ధారణకు ఉపయోగించరాదు.",
    en: "AirSense is an early-warning and awareness tool — not a medical or diagnostic device.",
  },

  "cmp.title": { te: "గదుల పోలిక", en: "Room comparison" },
  "cmp.desc": { te: "చెత్త గాలి ఉన్న గది మొదట చూపిస్తున్నాం.", en: "Sorted worst-air-first so the room needing attention comes first." },
  "cmp.room": { te: "గది", en: "Room" },
  "cmp.status": { te: "స్థితి", en: "Status" },
  "cmp.reading": { te: "రీడింగ్", en: "Reading" },
  "cmp.climate": { te: "ఉష్ణోగ్రత / తేమ", en: "Temp / humidity" },
  "cmp.updated": { te: "నవీకరణ", en: "Updated" },
  "cmp.sortStatus": { te: "గాలి నాణ్యత", en: "Air quality" },
  "cmp.sortName": { te: "పేరు", en: "Name" },
  "cmp.sortBy": { te: "క్రమబద్ధీకరణ", en: "Sort by" },

  "week.title": { te: "ఈ వారం నమూనా", en: "Weekly pattern" },
  "week.clean": { te: "ఈ వారం ఒక్క 'పేలవం' సంఘటన కూడా లేదు — బాగుంది.", en: "No poor episodes this week — trending well." },
  "week.none": { te: "నమూనా చెప్పడానికి తగిన డేటా ఇంకా లేదు.", en: "Not enough data yet to describe a pattern." },
  "week.note": {
    te: "ఇది గత 7 రోజుల రీడింగ్‌ల సాధారణ సగటు — అంచనా కాదు.",
    en: "A plain average of the last 7 days of readings — not a prediction.",
  },

  "rep.title": { te: "నివేదిక", en: "Report" },
  "rep.download": { te: "నివేదిక డౌన్‌లోడ్ చేయండి", en: "Download report" },
  "rep.csv": { te: "CSV డౌన్‌లోడ్", en: "Download CSV" },
  "rep.pdf": { te: "PDF డౌన్‌లోడ్", en: "Download PDF" },
  "rep.desc": {
    te: "ఎంచుకున్న కాలానికి రీడింగ్‌లు, స్థితి మార్పులు, హెచ్చరికలు — పాఠశాలకు ఇవ్వడానికి సిద్ధం.",
    en: "Readings, classification changes and alerts for the selected period — ready to share with a school.",
  },
  "rep.done": { te: "నివేదిక డౌన్‌లోడ్ అయింది", en: "Report downloaded" },
  "rep.pdfNote": { te: "PDF ఆంగ్లంలో ఉంటుంది (ఫాంట్ పరిమితి).", en: "The PDF is generated in English." },

  "diag.title": { te: "పరికర వివరాలు", en: "Device diagnostics" },
  "diag.raw": { te: "ముడి MQ135 విలువ", en: "Raw MQ135 value" },
  "diag.wifi": { te: "WiFi సిగ్నల్", en: "WiFi signal" },
  "diag.uptime": { te: "అప్‌టైమ్", en: "Uptime" },
  "diag.firmware": { te: "ఫర్మ్‌వేర్", en: "Firmware" },
  "diag.lastData": { te: "చివరి డేటా", en: "Last data" },
  "diag.na": { te: "అందుబాటులో లేదు", en: "Not available" },

  "tl.title": { te: "హెచ్చరికల టైమ్‌లైన్", en: "Alert timeline" },
  "tl.desc": { te: "ఎంచుకున్న కాలంలో గాలి స్థితి — ఎడమ నుండి కుడికి.", en: "Air state across the selected period, left to right." },

  "quiet.title": { te: "నిశ్శబ్ద గంటలు", en: "Quiet hours" },
  "quiet.desc": {
    te: "ఈ సమయంలో హెచ్చరికలు పంపబడవు — అవి లాగ్‌లో మాత్రం నమోదవుతాయి.",
    en: "Alerts are not sent during this window — they are still recorded in history.",
  },
  "quiet.enable": { te: "నిశ్శబ్ద గంటలు ఆన్", en: "Enable quiet hours" },
  "quiet.from": { te: "నుండి", en: "From" },
  "quiet.to": { te: "వరకు", en: "To" },
  "quiet.critical": { te: "'పేలవం' హెచ్చరికలు అప్పుడూ పంపు", en: "Still send critical Poor alerts" },
  "quiet.criticalDesc": {
    te: "గాలి పేలవంగా మారితే నిశ్శబ్ద గంటల్లోనూ నోటిఫికేషన్ వస్తుంది.",
    en: "A poor-air alert will still come through during quiet hours.",
  },
  "quiet.active": { te: "ఇప్పుడు నిశ్శబ్ద గంటల్లో ఉన్నాం", en: "Quiet hours are active right now" },

  "empty.title": { te: "ఇంకా ఏ గదీ పర్యవేక్షణలో లేదు", en: "No rooms monitored yet" },
  "empty.desc": {
    te: "ఒక గదిని జోడించండి — పరికర ID, API కీ వెంటనే ఇస్తాం, సెన్సార్ కనెక్ట్ చేసిన క్షణం నుండి లైవ్ రీడింగ్‌లు కనిపిస్తాయి.",
    en: "Add a room and we'll issue its device ID and API key immediately — live readings appear the moment your sensor connects.",
  },
  "empty.cta": { te: "మొదటి గదిని జోడించండి", en: "Add your first room" },
} satisfies Dict;

export type TKey = keyof typeof dict;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "te",
  setLang: () => {},
  t: (k) => dict[k].te,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("te");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("airsense-lang") as Lang | null) : null;
    if (saved === "en" || saved === "te") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("airsense-lang", l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((k: TKey) => dict[k][lang] ?? dict[k].te, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  return useContext(LangContext);
}
