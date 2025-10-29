// Dashboard Logic
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("الرجاء تسجيل الدخول أولاً");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent = user.name;

  const form = document.getElementById("invoiceForm");
  const list = document.getElementById("invoiceList");
  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  function renderInvoices() {
    list.innerHTML = "";
    invoices.forEach((inv) => {
      const row = `<tr>
        <td>${inv.name}</td>
        <td>${inv.amount}</td>
        <td>${inv.date}</td>
      </tr>`;
      list.innerHTML += row;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("invoiceName").value;
    const amount = document.getElementById("invoiceAmount").value;
    const date = document.getElementById("invoiceDate").value;

    invoices.push({ name, amount, date });
    localStorage.setItem("invoices", JSON.stringify(invoices));
    renderInvoices();
    form.reset();
  });

  renderInvoices();
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
