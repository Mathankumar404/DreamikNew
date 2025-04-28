import React from 'react';

const BulkPrinting = () => {
    return (
      
        <div>
                       <button
style={{background:"green",margin:"20px"}}

  onClick={() => {
    const link = document.createElement("a");
    link.href = "/BulkPrintingSoftware/bulkbatchprintinput-sample.xlsx";
    link.download = "bulkbatchprintinput-sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
>
  Download Excel File <br />
  (bulkbatch printinput-sample)
</button>
<br />
<button
style={{
    marginBottom:"20px"
}}
  onClick={() => {
    const link = document.createElement("a");
    link.href = "BulkPrintingSoftware/Dreamik Bulk Batch PDF Print for Windows 2025.msi";
    link.download = "Dreamik Bulk Batch PDF Print for Windows 2025.msi";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
><i className="fa-solid fa-download"></i><br />
  Download software
</button>
            <div id='imagecontainer'>
                <img src="/BulkPrintingSoftware/Bulk batch pdf print sw img1.jpg" alt="1" />
                <img src="/BulkPrintingSoftware/Bulk batch pdf print sw img2.jpg" alt="2" />
                <img src="/BulkPrintingSoftware/Bulk batch pdf print sw img3.jpg" alt="3" />
                <img src="/BulkPrintingSoftware/Bulk batch pdf print sw img4.jpg" alt="4" />
                <img src="/BulkPrintingSoftware/Bulk batch pdf print sw img5-configure.jpg" alt="5" />
            </div>
        </div>
    );
}

export default BulkPrinting;



