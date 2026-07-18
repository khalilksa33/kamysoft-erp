async function testZatcaReport() {
    console.log('Fetching invoice...');
    const invoiceRes = await fetch('http://localhost:5000/api/invoices');
    if (!invoiceRes.ok) {
        console.error('Failed to get invoices');
        return;
    }
    const invoices = await invoiceRes.json();
    if (!invoices.length) {
        console.log('No invoices found');
        return;
    }
    const targetInvoice = invoices[invoices.length - 1];
    console.log('Reporting invoice', targetInvoice.id);

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password' })
    });
    const { token } = await loginRes.json();

    const reportRes = await fetch('http://localhost:5000/api/invoices/' + targetInvoice.id + '/zatca-report', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const result = await reportRes.json();
    console.log(result);
}

testZatcaReport();
