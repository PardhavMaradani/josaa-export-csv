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
    const rows = document.querySelectorAll('#ctl00_ContentPlaceHolder1_GridView1 tr');
    if (rows.length == 0) {
        alert("Nothing to export!");
        return;
    }
    let year = new Date().getFullYear();
    let yearID = document.querySelector('#ctl00_ContentPlaceHolder1_ddlYear');
    if (yearID != null) {
        year = yearID.value;
    }
    let csv = 'year,round,type,institute,program,quota,category,gender,orank,crank\n';
    let round = document.querySelector('#ctl00_ContentPlaceHolder1_ddlroundno').value;
    let type = document.querySelector('#ctl00_ContentPlaceHolder1_ddlInstype').value;
    // Iterate over all rows and columns in the grid table and create CSV text
    for (let row = 1; row < rows.length; row++) {
        const cols = rows[row].querySelectorAll('td');
        let empty = false;
        for (let col = 0; col < cols.length; col++) {
            let value = cols[col].innerText;
            if (col == 0) {
                // Skip rows with empty values
                if (value.trim().length == 0) {
                    empty = true;
                    break;
                }
                let itype = type;
                // Fix the Institute type when ALL is selected
                if (type == "ALL") {
                    if (value.startsWith("Indian Institute of Technology")) {
                        itype = "IIT";
                    } else if (value.includes("National Institute of Technology") || 
                               value == "Indian Institute of Engineering Science and Technology, Shibpur") {
                        itype = "NIT";
                    } else if (value.match(/Indian Institute of Information Technology/i)) {
                        itype = "3IT";
                    } else {
                        itype = "CFI";
                    }
                }
                csv += year + ',' + round + ',"' + itype + '"';
            }
            csv += ',';
            if (col == 4) {
                // Gender - remove " (including Supernumerary)" part
                csv += '"' + value.replace(/ .*/, "") + '"';
            } else if (col > 4) {
                // ranks - numbers
                csv += parseInt(value);
            } else {
                csv += '"' + value + '"';
            }
        }
        if (!empty) {
            csv += "\n";
        }
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
