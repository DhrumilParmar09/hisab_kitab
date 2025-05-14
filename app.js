document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("entryForm");
  const ledgerBody = document.getElementById("ledgerBody");

  let entries = JSON.parse(localStorage.getItem("ledgerEntries")) || [];
  renderEntries();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const dailyCollection = parseFloat(document.getElementById("dailyCollection").value) || 0;
    const work = parseFloat(document.getElementById("work").value) || 0;
    const google = parseFloat(document.getElementById("google").value) || 0;
    const earned = parseFloat(document.getElementById("earned").value) || 0;
    const googleExpense = document.getElementById("googleExpense").value;
    const totalExpense = parseFloat(document.getElementById("totalExpense").value) || 0;

    const totalWork = work + google;
    const deposited = totalWork - earned - dailyCollection;

    const entry = {
      date,
      dailyCollection,
      work,
      google,
      totalWork,
      earned,
      deposited,
      googleExpense,
      totalExpense
    };

    entries.push(entry);
    localStorage.setItem("ledgerEntries", JSON.stringify(entries));
    renderEntries();
    form.reset();
  });

  function renderEntries() {
  ledgerBody.innerHTML = "";
  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.date || '-'}</td>
      <td>${(entry.dailyCollection || 0).toFixed(2)}</td>
      <td>${(entry.work || 0).toFixed(2)}</td>
      <td>${(entry.google || 0).toFixed(2)}</td>
      <td>${(entry.totalWork || 0).toFixed(2)}</td>
      <td>${(entry.earned || 0).toFixed(2)}</td>
      <td>${(entry.deposited || 0).toFixed(2)}</td>
      <td>${entry.googleExpense || '-'}</td>
      <td>${(entry.totalExpense || 0).toFixed(2)}</td>
    `;
    ledgerBody.appendChild(row);
  });
}


  // PWA Install Button Logic
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';

    installBtn.addEventListener('click', () => {
      installBtn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
      console.log('Service Worker Registered');
    });
  }
});
