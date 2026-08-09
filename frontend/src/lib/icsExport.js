import { PALIO_NOTE } from "@/lib/tripPlan";

// iCalendar export of the generated itinerary. Every event is built from the
// same verified content templates the tools already render — nothing is
// invented here. All-day DATE events sidestep timezone maths entirely: the
// plan's start_date is a plain YYYY-MM-DD and stays one.

// RFC 5545: backslash, semicolon, comma and newline must be escaped in text.
function escapeText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545 content lines fold at 75 OCTETS (not characters) with CRLF +
// single space. The itinerary text is full of 2-3 byte characters (à, ’, —),
// so byte counting is load-bearing, and splits must land on character
// boundaries — never inside a multi-byte sequence.
const utf8len = (ch) => new TextEncoder().encode(ch).length;
function foldLine(line) {
  const out = [];
  let current = "";
  let octets = 0;
  for (const ch of line) {
    const chLen = utf8len(ch);
    if (octets + chLen > 74) {
      out.push(current);
      current = " ";
      octets = 1;
    }
    current += ch;
    octets += chLen;
  }
  out.push(current);
  return out.join("\r\n");
}

// Local-date arithmetic on a YYYY-MM-DD string, no Date-string parsing.
function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

// "Mon, 14 Sep" for UI day labels; null when no valid start date.
export function dayDateLabel(startDate, dayIndex) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate || "")) return null;
  const [y, m, d] = startDate.split("-").map(Number);
  const date = new Date(y, m - 1, d + dayIndex);
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function itineraryToIcs({ plan, itinerary }) {
  if (!plan || !itinerary || !/^\d{4}-\d{2}-\d{2}$/.test(plan.start_date || "")) return null;

  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Archi Travel Guide//Trip Sheet//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  const pushEvent = ({ uid, date, endDate, summary, description }) => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}@affittacameregliarchi.com`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART;VALUE=DATE:${date}`);
    lines.push(`DTEND;VALUE=DATE:${endDate}`);
    lines.push(foldLine(`SUMMARY:${escapeText(summary)}`));
    if (description) lines.push(foldLine(`DESCRIPTION:${escapeText(description)}`));
    lines.push("END:VEVENT");
  };

  itinerary.days.forEach((day, i) => {
    const parts = [
      `Morning: ${day.morning}`,
      `Afternoon: ${day.afternoon}`,
      `Evening: ${day.evening}`,
    ];
    for (const note of day.notes || []) {
      parts.push(`Plan around this: ${note.text}${note.checked ? ` (Checked ${note.checked})` : ""}`);
    }
    pushEvent({
      uid: `archi-${plan.destination.toLowerCase()}-${plan.start_date}-day${day.day}`,
      date: addDays(plan.start_date, i),
      endDate: addDays(plan.start_date, i + 1),
      summary: `${plan.destination} · Day ${day.day}: ${day.morning}`,
      description: parts.join("\n"),
    });
  });

  // Verified Palio warning as its own all-day event on each race date the
  // exported span touches (2 July / 16 August). The window covers whichever
  // is longer — the saved plan or the exported itinerary — INCLUSIVE of the
  // checkout day, matching tripOverlapsPalio's boundary. The window is
  // computed here directly (not via tripOverlapsPalio) because that helper
  // only knows plan.trip_length, and this export may carry a longer itinerary.
  {
    const [startY] = plan.start_date.split("-").map(Number);
    const start = addDays(plan.start_date, 0);
    const end = addDays(plan.start_date, Math.max(plan.trip_length, itinerary.days.length));
    for (const year of [startY, startY + 1]) {
      for (const [m, d] of [[7, 2], [8, 16]]) {
        const raceIso = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const race = addDays(raceIso, 0);
        if (race >= start && race <= end) {
          pushEvent({
            uid: `archi-${plan.destination.toLowerCase()}-${plan.start_date}-palio-${race}`,
            date: race,
            endDate: addDays(raceIso, 1),
            summary: "Palio di Siena — plan around it",
            description: `${PALIO_NOTE.text} (Checked ${PALIO_NOTE.checked})`,
          });
        }
      }
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function downloadIcs(icsText, filename) {
  const blob = new Blob([icsText], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
