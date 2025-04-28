// import React, { useEffect, useState } from 'react';
// import Papa from 'papaparse';

const CSVViewer = () => {
//   const [csvData, setCsvData] = useState([]);

//   useEffect(() => {
//     fetch('/Book1.csv') // Path relative to the public folder
//       .then((response) => response.text())
//       .then((csvText) => {
//         Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             setCsvData(results.data);
//           },
//         });
//       })
//       .catch((error) => console.error('Error fetching CSV:', error));
//   }, []);

  return (
    <div className="p-4">
      {/* <h2 className="text-xl font-bold mb-4">sample Data  </h2>
      {csvData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(csvData[0]).map((key) => (
                <th key={key} className="border border-gray-400 p-2">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {Object.values(row).map((value, idx) => (
                  <td key={idx} className="border border-gray-300 p-2 text-center">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading CSV data...</p>
      )} */}
      <p>imagename,student Name,class,section,roll no,school Name,place</p><br/>
      <p>
            boy(1).png,Rahul,III,C,,Indian Public School</p><br/>
            <p>
           <p> boy(2).png,Ashok,IV,,16,"Barath School of Sainik Kids, New Delhi"</p><br/>
          <p>  boy(3).png,Thomas Gabriel Prabhakar,V,A,33,"DAV School, Mahim, Mumbai"</p>  <br/>
          <p>   boy(4).png,Moh. Akbar Ahmed,II,D,,"Islamic Indian Public School, Muzaffarabad"</p>  <br/>
          <p>   boy(5).png,Jsharailang Lyngdoh Mawphlang,Jr. KG,,,"Sikkim Kindergarten School, Gangtok"</p>  <br/>
          <p>   girl(6).png,Radhika,III,C,,Indian Public School</p>  <br/>
          <p>   girl(7).png,Anshika Nagpal,IV,,16,"Barath School of Sainik Kids, New Delhi"</p>  <br/>
          <p>  girl(8).png,Pooja Potnurwar Prabhakar,V,A,33,"DAV School, Mahim, Kanpur"</p>  <br/>
          <p>  girl(9).png,Jannath Marha Marraikar,II,D,,"Islamic Public School of Kerala, Kozhikode"</p>  <br/>
          <p>girl(10).png,Rashmitha Veeramsetti,Sr. KG,Jasmine,,"J&K Kindergarten School, Srinagar"</p>  <br/>
</p><br/>
<h3 style={{color:"red"}}> file should be in .txt or .csv or .json format only</h3>
    </div>
  );
};

export default CSVViewer;
