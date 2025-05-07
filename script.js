const form = document.getElementById('orderForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  // 1) Save to Google Sheets
  await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  // 2) Redirect to PayU payment page
  const params = {
    key: 'YOUR_PAYU_KEY',
    txnid: Date.now().toString(),
    amount: data.amount,
    productinfo: 'Readdy Clone Order',
    firstname: data.name,
    email: data.email,
    phone: '',
    surl: window.location.href + '?success=1',
    furl: window.location.href + '?success=0',
    hash: '' // we’ll generate via Apps Script
  };
  // call your Apps Script to get hash + other hidden fields
  const res = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?hash=1');
  const { hash, salt } = await res.json();
  params.hash = hash;
  // build form and submit
  const payuForm = document.createElement('form');
  payuForm.method = 'POST';
  payuForm.action = 'https://test.payu.in/_payment'; // sandbox URL
  for (let k in params) {
    const inp = document.createElement('input');
    inp.type = 'hidden'; inp.name = k; inp.value = params[k];
    payuForm.appendChild(inp);
  }
  document.body.appendChild(payuForm);
  payuForm.submit();
});
