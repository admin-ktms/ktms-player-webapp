export function renderTournamentCard(tournament) {
  const id =
    tournament?.tournament_id ||
    tournament?.Tournament_ID ||
    "—";

  const name =
    tournament?.tournament_name ||
    tournament?.Tournament_Name ||
    "KickOff Tournament";

  const status =
    tournament?.tournament_status ||
    tournament?.Tournament_Status ||
    "Upcoming";

  const startDate =
    tournament?.tournament_start_date ||
    tournament?.Tournament_Start_Date;

  const registrationClose =
    tournament?.registration_close_datetime ||
    tournament?.Registration_Close_DateTime;

  const fee =
    tournament?.registration_fee ??
    tournament?.Registration_Fee ??
    0;

  const capacity =
    tournament?.maximum_players ??
    tournament?.Maximum_Players ??
    "—";

  const edition = extractEdition(name);

  const statusClass = getStatusClass(status);

  const statusLabel = formatStatus(status);

  const startLabel = formatDate(startDate);
  const closeLabel = formatDate(registrationClose);

  const feeLabel =
    Number(fee) > 0
      ? formatCurrency(fee)
      : "FREE";

  const action = getAction(status);

  return `
    <article
      class="tournament-card"
      data-tournament-id="${escapeHtml(id)}"
    >
      <div class="tournament-card-inner">

        <div class="tournament-card-top">
          <span class="tournament-id">
            ${escapeHtml(id)}
          </span>

          <span class="tournament-status ${statusClass}">
            ${escapeHtml(statusLabel)}
          </span>
        </div>

        <h3 class="tournament-name">
          ${escapeHtml(cleanTournamentName(name))}
        </h3>

        ${
          edition
            ? `
              <div class="tournament-edition">
                ${escapeHtml(edition)}
              </div>
            `
            : ""
        }

        <div class="tournament-divider"></div>

        <div class="tournament-meta">

          <div class="tournament-meta-item">
            <span class="tournament-meta-label">
              Registration closes
            </span>

            <span class="tournament-meta-value">
              ${escapeHtml(closeLabel)}
            </span>
          </div>

          <div class="tournament-meta-item">
            <span class="tournament-meta-label">
              Tournament starts
            </span>

            <span class="tournament-meta-value">
              ${escapeHtml(startLabel)}
            </span>
          </div>

          <div class="tournament-meta-item">
            <span class="tournament-meta-label">
              Entry
            </span>

            <span class="tournament-meta-value">
              ${escapeHtml(feeLabel)}
            </span>
          </div>

          <div class="tournament-meta-item">
            <span class="tournament-meta-label">
              Players
            </span>

            <span class="tournament-meta-value">
              ${escapeHtml(String(capacity))}
            </span>
          </div>

        </div>

        <button
          type="button"
          class="tournament-card-action"
          data-action="open-tournament"
          data-tournament-id="${escapeHtml(id)}"
        >
          <span>${escapeHtml(action)}</span>
          <span class="tournament-card-action-arrow">→</span>
        </button>

      </div>
    </article>
  `;
}

function cleanTournamentName(name) {
  return String(name)
    .replace(/\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*['’]?\d{2,4}$/i, "")
    .trim();
}

function extractEdition(name) {
  const match = String(name).match(
    /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*['’]?\d{2,4})$/i
  );

  return match ? match[1] : "";
}

function formatStatus(status) {
  const normalized = String(status)
    .trim()
    .toLowerCase();

  switch (normalized) {
    case "registration open":
      return "Registration Open";

    case "live":
      return "Live";

    case "completed":
      return "Completed";

    case "upcoming":
      return "Upcoming";

    default:
      return String(status);
  }
}

function getStatusClass(status) {
  const normalized = String(status)
    .trim()
    .toLowerCase();

  if (normalized.includes("registration")) {
    return "status-live";
  }

  if (normalized.includes("live")) {
    return "status-live";
  }

  if (normalized.includes("completed")) {
    return "status-completed";
  }

  return "status-upcoming";
}

function getAction(status) {
  const normalized = String(status)
    .trim()
    .toLowerCase();

  if (normalized === "registration open") {
    return "Enter Tournament";
  }

  if (normalized === "live") {
    return "View Matchday";
  }

  if (normalized === "completed") {
    return "View Results";
  }

  return "View Tournament";
}

function formatDate(value) {
  if (!value) {
    return "TBA";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
