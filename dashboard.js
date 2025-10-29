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
          <td>${inv.warranty}</td>
          <td>
            ${inv.image ? `<a href="${inv.image}" target="_blank">📎 عرض</a>` : "—"}
          </td>
          <td><button onclick="deleteInvoice(${index})">🗑️ حذف</button></td>
        </tr>`;
      list.innerHTML += row;
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("invoiceName").value.trim();
    const amount = document.getElementById("invoiceAmount").value.trim();
    const date = document.getElementById("invoiceDate").value.trim();
    const warranty = document.getElementById("invoiceWarranty").value.trim();
    const fileInput = document.getElementById("invoiceImage");
    let imageBase64 = "";

    if (!name || !amount || !date || !warranty) {
      alert("يرجى تعبئة جميع الحقول قبل الإضافة.");
      return;
    }

    // تحويل الصورة إلى Base64 لتخزينها
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      imageBase64 = await toBase64(file);
    }

    invoices.push({ name, amount, date, warranty, image: imageBase64 });
    saveInvoices();
    renderInvoices();
    form.reset();
  });

  renderInvoices();

  // حذف الفاتورة
  window.deleteInvoice = (index) => {
    if (confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
      invoices.splice(index, 1);
      saveInvoices();
      renderInvoices();
    }
  };

  // تصوير الفواتير كصورة PNG
  document.getElementById("captureBtn").addEventListener("click", async () => {
    const table = document.querySelector("table");
    const canvas = await html2canvas(table);
    const link = document.createElement("a");
    link.download = "invoices.png";
    link.href = canvas.toDataURL();
    link.click();
  });

  // حفظ الفواتير كـ PDF
  document.getElementById("pdfBtn").addEventListener("click", () => {
    const element = document.querySelector("table");
    const opt = {
      margin: 0.5,
      filename: "invoices.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };
    html2pdf().from(element).set(opt).save();
  });
});

// تحويل الملف إلى Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}
