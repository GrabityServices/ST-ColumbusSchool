/* =========================================================
   ADMIN DASHBOARD TABS
   Client-side UI only. No fetch/API/backend calls.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = Array.from(document.querySelectorAll(".admin-tab-button[data-tab]"));
  const panels = Array.from(document.querySelectorAll(".admin-tab-panel[data-panel]"));
  const quickLinks = Array.from(document.querySelectorAll("[data-go-tab]"));

  if (!tabButtons.length || !panels.length) return;

  function activateTab(tabName, updateHash = true) {
    const targetPanel = panels.find(panel => panel.dataset.panel === tabName);
    const targetButton = tabButtons.find(button => button.dataset.tab === tabName);

    if (!targetPanel || !targetButton) return;

    tabButtons.forEach(button => {
      const selected = button === targetButton;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    panels.forEach(panel => {
      const active = panel === targetPanel;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });

    if (updateHash) {
      history.replaceState(null, "", `#${tabName}`);
    }
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateTab(button.dataset.tab));

    button.addEventListener("keydown", event => {
      let nextIndex = index;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabButtons.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabButtons.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      tabButtons[nextIndex].focus();
      activateTab(tabButtons[nextIndex].dataset.tab);
    });
  });

  quickLinks.forEach(button => {
    button.addEventListener("click", () => activateTab(button.dataset.goTab));
  });

  const initialTab = window.location.hash.replace("#", "");
  const validInitialTab = tabButtons.some(button => button.dataset.tab === initialTab);
  activateTab(validInitialTab ? initialTab : "overview", false);
});


