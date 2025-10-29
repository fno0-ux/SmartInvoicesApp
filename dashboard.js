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
  let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  function saveInvoices() {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }

  function renderInvoices() {
    list.innerHTML = "";
    invoices.forEach((inv, index) => {
      const row = `
        <tr>
          <td>${inv.name}</td>
          <td>${inv.amount}</td>
          <td>${inv.date}</td>
          <td><button onclick="deleteInvoice(${index})">🗑️ حذف</button></td>
        </tr>
      `;
      list.innerHTML += row;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("invoiceName").value.trim();
    const amount = document.getElementById("invoiceAmount").value.trim();
    const date = document.getElementById("invoiceDate").value.trim();

    if (!name || !amount || !date) {
      alert("يرجى تعبئة جميع الحقول قبل الإضافة.");
      return;
    }

    invoices.push({ name, amount, date });
    saveInvoices();
    renderInvoices();
    form.reset();
  });

  renderInvoices();

  window.deleteInvoice = (index) => {
    if (confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
      invoices.splice(index, 1);
      saveInvoices();
      renderInvoices();
    }
  };
});

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
