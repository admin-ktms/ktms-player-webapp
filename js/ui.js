export function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


export function formatDate(
  value
) {

  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "—";

  }

  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ).format(date);

}


export function formatCurrency(
  value
) {

  const amount =
    Number(value);

  if (
    Number.isNaN(amount)
  ) {

    return "—";

  }

  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }
  ).format(amount);

}


export function setPage(
  html
) {

  const app =
    document.querySelector("#app");

  if (!app) {
    return;
  }

  app.innerHTML = html;

}


export function showError(
  message
) {

  setPage(`
    <main class="page page-centered">
      <section class="state-card">
        <div class="state-icon">!</div>

        <h1>Something went wrong</h1>

        <p>
          ${escapeHtml(message)}
        </p>

        <button
          class="button button-primary"
          data-action="reload"
        >
          TRY AGAIN
        </button>
      </section>
    </main>
  `);

}
