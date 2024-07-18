// Create the 'Export CSV' button
const exportBtn = document.createElement('button');
exportBtn.innerText = 'Export CSV';
exportBtn.classList.add('btn', 'btn-primary');
exportBtn.addEventListener('click', handleExportRequest);

// Add the 'Export CSV' button right next to the 'Submit' button
const submitBtn = document.getElementById('ctl00_ContentPlaceHolder1_btnSubmit');
submitBtn.parentNode.appendChild(exportBtn);

// Export table contents as CSV
function handleExportRequest(e) {
    // Prevent default submit action for this button
    e.preventDefault();
    let csv = '';
    // Iterate over all rows and columns in the grid table and create CSV text
    const rows = document.querySelectorAll('#ctl00_ContentPlaceHolder1_GridView1 tr');
    for (let row = 0; row < rows.length; row++) {
        const cols = rows[row].querySelectorAll('th, td');
        for (let col = 0; col < cols.length; col++) {
            if (col > 0) {
                csv += ',';
            }
            csv += '"' + cols[col].innerText + '"';
        }
        csv += '\n';
    }
    if (csv == '') {
        alert('Nothing to export!');
        return;
    }
    //console.log(csvText);
    // Create a dummy hidden link to download
    const link = document.createElement('a');
    const url = URL.createObjectURL(
        new Blob([csv], { type: 'text/csv; charset=utf-8;' })
    );
    link.setAttribute('href', url);
    //link.setAttribute("download", "data.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
