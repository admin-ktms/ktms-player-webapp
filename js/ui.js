export function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


export function renderLoading(
  message = "Loading..."
) {

  return `
    <section
      class="loading-state"
      aria-live="polite"
    >
      <div>
        <div
          class="loading-spinner"
          aria-hidden="true"
        ></div>

        <div>${escapeHtml(message)}</div>
      </div>
    </section>
  `;

}


export function renderError(
  message
) {

  return `
    <section
      class="alert alert-error"
      role="alert"
    >
      ${escapeHtml(message)}
    </section>
  `;

}


export function showToast(
  message
) {

  const container =
    document.getElementById(
      "toast-container"
    );


  if (!container) {
    return;
  }


  const toast =
    document.createElement("div");


  toast.className =
    "toast";


  toast.textContent =
    message;


  container.appendChild(
    toast
  );


  window.setTimeout(
    () => {

      toast.remove();

    },
    3500
  );

}


export function showModal({
  title,
  message,
  actions = []
}) {

  const root =
    document.getElementById(
      "modal-root"
    );


  if (!root) {
    return;
  }


  const actionHtml =
    actions
      .map(
        (
          action,
          index
        ) => `
          <button
            type="button"
            class="button ${
              action.primary
                ? "button-primary"
                : ""
            }"
            data-modal-action="${index}"
          >
            ${escapeHtml(action.label)}
          </button>
        `
      )
      .join("");


  root.innerHTML = `

    <div
      class="modal-backdrop"
      role="presentation"
    >

      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >

        <h2 id="modal-title">
          ${escapeHtml(title)}
        </h2>

        <p>
          ${escapeHtml(message)}
        </p>

        <div class="modal-actions">
          ${actionHtml}
        </div>

      </section>

    </div>

  `;


  root
    .querySelectorAll(
      "[data-modal-action]"
    )
    .forEach(
      button => {

        const index =
          Number(
            button.dataset.modalAction
          );


        button.addEventListener(
          "click",
          () => {

            const action =
              actions[index];


            if (action?.handler) {
              action.handler();
            }


            closeModal();

          }
        );

      }
    );

}


export function closeModal() {

  const root =
    document.getElementById(
      "modal-root"
    );


  if (root) {
    root.innerHTML = "";
  }

}
