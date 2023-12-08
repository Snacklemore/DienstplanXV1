function germanMonthToNumber(monthName) {
  // Check if the input is already a number
  if (!isNaN(monthName)) {
    const monthNumber = parseInt(monthName, 10);
    return monthNumber < 10 ? '0' + monthNumber : monthNumber.toString();
}
  const months = {
      'Januar': 1,
      'Februar': 2,
      'März': 3,
      'April': 4,
      'Mai': 5,
      'Juni': 6,
      'Juli': 7,
      'August': 8,
      'September': 9,
      'Oktober': 10,
      'November': 11,
      'Dezember': 12
  };
  
  // Convert the input month name to title case for comparison
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();


  // Check if the month name exists in the months object
  if (formattedMonth in months) {
      const monthNumber = months[formattedMonth];
      return monthNumber < 10 ? '0' + monthNumber : monthNumber.toString();
  } else {
      return monthName; // Return null for invalid input
  }
}

// Example usage:
const inputMonth = 'Januar'; // Replace with the German month name you want to convert
const monthNumber = germanMonthToNumber(inputMonth);

if (monthNumber !== null) {
  console.log(`The month number for ${inputMonth} is ${monthNumber}.`);
} else {
  console.log('Invalid month name.');
}

  function makeEditable(cell) {
    
    var text = cell.textContent.trim();
    cell.innerHTML = '<input type="text" value="' + text + '">';
    var input = cell.querySelector('input');
    input.focus();
    input.addEventListener('blur', function() {
      finishEdit(cell);
    });
    input.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        finishEdit(cell);
        saveTableData();
      }
    });
    cell.onclick = null;
  }

  function finishEdit(cell) {
    var input = cell.querySelector('input');
    cell.textContent = input.value;
    saveTableData();
    cell.onclick = function() {
      makeEditable(this);
      
    };
  }

  function saveTableData() {
    var table = document.querySelector('table');
    var rows = table.querySelectorAll('tbody tr');

    var y_drop = document.getElementById('yeardrop');
    
    var year_l = y_drop.innerHTML;
    var m_drop = document.getElementById('monthdrop');
    var month_l  = m_drop.innerHTML;
    var month_ln = germanMonthToNumber(month_l);

    
    var data = [];

    rows.forEach(function(row) {
      var rowData = [];
      var cells = row.querySelectorAll('td:not(:first-child)');
      cells.forEach(function(cell) {
        rowData.push(cell.textContent.trim());
      });
      data.push(rowData);
    });

    var url = '/save';
    var jsonString = JSON.stringify(data);
    //refactor endpoint to save multiple plans,named after 
    $.post(url, {
			
			tableData: jsonString,
      month:month_ln,
      year:year_l,
			
          }).done(function (retval) {
            console.log(retval);
					if (String(retval) === "success")
					{	
					
					}
					else{

          }
						
          });
  }
  ///pdf?type=all
  var currentYear = new Date().getFullYear();
  var currentMonth = new Date().getMonth()+1;
  var days_data = null;
  var days_url = '/table?days=1&currentYear='+currentYear+'&currentMonth='+currentMonth;
  const request1 = async (m,y) => {
    var days_url2 = '/table?days=1&currentYear='+y+'&currentMonth='+m;

    const response = await fetch(days_url2);
    const json = await response.json();
    days_data = json;
    console.log(json)
    
  }

  const request = async ()=> {
    

    const response = await fetch(days_url);
    const json = await response.json();
    days_data = json;
    console.log(json)
    
  }
  function loadTableData() {
   
    //set current date and month then load data
    //set dropdown 
    var y_drop = document.getElementById('yeardrop');
    y_drop.innerHTML = currentYear;

    var m_drop = document.getElementById('monthdrop');
    m_drop.innerHTML = currentMonth;

    
    //construct url to load table
    var url = '/table?days=0&currentYear='+currentYear+'&currentMonth='+currentMonth;
    
    


    fetch(url)
    .then(response => response.json())
    .catch(err => console.log(err))
    .then(data => {


      if (data === undefined)
        {
          console.log("no data");
          return;
        }
            
      
      var table = document.querySelector('table tbody');
      table.innerHTML = ''; // Clear existing table content
      var outer_counter = 1;
      data.forEach(function(rowData, rowIndex) {
        var row = document.createElement('tr');

        // Create and append the row number cell
        var numberCell = document.createElement('td');
        numberCell.textContent = rowIndex + 1;
        row.appendChild(numberCell);
        var counter = 0;
        rowData.forEach(function(cellData) {
          
          var cell = document.createElement('td');
          cell.textContent = cellData;
          //skip click function for days of the month
          if (counter === 1 )
          {
            cell.onclick = function() {
              if (admin === 'true')
                makeEditable(this);
            };
          }

          if (counter === 3 || 4)
          {
            cell.onclick = function() {
              if (admin === 'true')
                makeEditable(this);
            };
          }
          var day_of_the_date = days_data[outer_counter-1];
          if (counter === 2)
            {
              if (!(day_of_the_date === "Saturday") && !(day_of_the_date === "Sunday"))
              {
                cell.onclick = function() {
                  if (admin === 'true')
                    makeEditable(this);
                };

              } 
            }
          
          row.appendChild(cell);
          if (counter === 0)//counter==cell index per row exp: 0 === Tag, 1 === Frühschicht )
          {
            //fallback if days data wasnt loaded 9
            
             // request();

            //days 
            //get date (outer_counter)
           
            day_of_the_date = days_data[outer_counter-1];
            
            if (day_of_the_date === "Saturday")
            {
              cell.style.backgroundColor = 'red';

            } 
            if (day_of_the_date === "Sunday")
            {
              cell.style.backgroundColor = 'yellow';
              
            }
              
              cell.textContent = day_of_the_date;
          
          }
          if (counter === 2)//Mittelschicht 
          {
            var day_of_the_date = days_data[outer_counter-1];
            if (day_of_the_date === "Saturday")
            {
              cell.textContent = '';
            }
            if (day_of_the_date === "Sunday")
            {
              cell.textContent = '';              
            }
            //clear cell, no shift
            
          }
          counter++;
        });
        table.appendChild(row);
        outer_counter++;
      });
      
      console.log('Table data loaded successfully.');
      //get current year and month, set before table load 
      function choose_month_func_delayed(i) {
        setTimeout(function (){
          
          choose_month_func(i);
                    
        }, 1000);
      }
      var choose_month_func = function(i)
        {
          var buttontext = document.getElementById('m'+i).innerHTML;
          var drop = document.getElementById('monthdrop');
          var ydrop = document.getElementById('yeardrop').innerHTML;
          drop.innerHTML= buttontext;
          var furl = '/table?days=0&currentYear='+ydrop+'&currentMonth='+germanMonthToNumber(buttontext);
          request1(germanMonthToNumber(buttontext),ydrop);

          setTimeout(function (){
            fetch(furl)
            .then(response => response.json())
            .catch(err => console.log(err))
            .then(data => {
  
  
              if (data === undefined)
              {
                console.log("no data");
                return;
              }
              //request(buttontext,ydrop);
  
              var table = document.querySelector('table tbody');
              table.innerHTML = ''; // Clear existing table content
              var outer_counter = 1;
              data.forEach(function(rowData, rowIndex) {
                var row = document.createElement('tr');
  
                // Create and append the row number cell
                var numberCell = document.createElement('td');
                numberCell.textContent = rowIndex + 1;
                row.appendChild(numberCell);
                var counter = 0;
                rowData.forEach(function(cellData) {
                  
                  var cell = document.createElement('td');
                  cell.textContent = cellData;
                  //skip click function for days of the month
                  if (counter === 1 )
                  {
                    cell.onclick = function() {
                      if (admin === 'true')
                        makeEditable(this);
                    };
                  }
        
                  if (counter === 3 || 4)
                  {
                    cell.onclick = function() {
                      if (admin === 'true')
                        makeEditable(this);
                    };
                  }
                  var day_of_the_date = days_data[outer_counter-1];
                  if (counter === 2)
                    {
                      if (!(day_of_the_date === "Saturday") && !(day_of_the_date === "Sunday"))
                      {
                        cell.onclick = function() {
                          if (admin === 'true')
                            makeEditable(this);
                        };
        
                      } 
                    }
                  
  
                  
                  row.appendChild(cell);
                  if (counter === 0)//counter==cell index per row exp: 0 === Tag, 1 === Frühschicht )
                  {
                    //fallback if days data wasnt loaded 
                    
                      
                    //days 
                    //get date (outer_counter)
                  
                    var day_of_the_date = days_data[outer_counter-1];
                    if (day_of_the_date === "Saturday")
                    {
                      cell.style.backgroundColor = 'red';
  
                    }
                    if (day_of_the_date === "Sunday")
                    {
                      cell.style.backgroundColor = 'yellow';
                      
                    }
                      
                      cell.textContent = day_of_the_date;
                  
                  }
                  if (counter === 2)//Mittelschicht 
                  {
                    var day_of_the_date = days_data[outer_counter-1];
                    if (day_of_the_date === "Saturday")
                    {
                      cell.textContent = '';
                    }
                    if (day_of_the_date === "Sunday")
                    {
                      cell.textContent = '';              
                    }
                    //clear cell, no shift
                    
                  }
                  counter++;
                });
                table.appendChild(row);
                outer_counter++;
              });
            });
                      
          }, 1000);
          

          console.log(buttontext);
        };
        var choose_year_func = function()
        {
          var buttontext = this.innerHTML;
          var buttontext_month = document.getElementById('monthdrop').innerHTML;
          var drop = document.getElementById('yeardrop');
          drop.innerHTML = buttontext;
          var furl = '/table?days=0&currentYear='+buttontext+'&currentMonth='+germanMonthToNumber(buttontext_month);
          request1(germanMonthToNumber(buttontext_month),buttontext);


          setTimeout(function (){
            fetch(furl)
          .then(response => response.json())
          .catch(err => console.log(err))
          .then(data => {


            if (data === undefined)
            {
              console.log("no data");
              return;
            }
            //request(buttontext,ydrop);

            var table = document.querySelector('table tbody');
            table.innerHTML = ''; // Clear existing table content
            var outer_counter = 1;
            data.forEach(function(rowData, rowIndex) {
              var row = document.createElement('tr');

              // Create and append the row number cell
              var numberCell = document.createElement('td');
              numberCell.textContent = rowIndex + 1;
              row.appendChild(numberCell);
              var counter = 0;
              rowData.forEach(function(cellData) {
                
                var cell = document.createElement('td');
                cell.textContent = cellData;
                //skip click function for days of the month
                if (counter === 1 )
                {
                  cell.onclick = function() {
                    if (admin === 'true')
                      makeEditable(this);
                  };
                }

                if (counter === 3 || 4)
                {
                  cell.onclick = function() {
                    if (admin === 'true')
                      makeEditable(this);
                  };
                }
                var day_of_the_date = days_data[outer_counter-1];
                if (counter === 2)
                  {
                    if (!(day_of_the_date === "Saturday") && !(day_of_the_date === "Sunday"))
                    {
                      cell.onclick = function() {
                        if (admin === 'true')
                          makeEditable(this);
                      };

                    } 
                  }
                

                
                row.appendChild(cell);
                if (counter === 0)//counter==cell index per row exp: 0 === Tag, 1 === Frühschicht )
                {
                  //fallback if days data wasnt loaded 
                  
                    
                  //days 
                  //get date (outer_counter)
                
                  var day_of_the_date = days_data[outer_counter-1];
                  if (day_of_the_date === "Saturday")
                  {
                    cell.style.backgroundColor = 'red';

                  }
                  if (day_of_the_date === "Sunday")
                  {
                    cell.style.backgroundColor = 'yellow';
                    
                  }
                    
                    cell.textContent = day_of_the_date;
                
                }
                if (counter === 2)//Mittelschicht 
                {
                  var day_of_the_date = days_data[outer_counter-1];
                  if (day_of_the_date === "Saturday")
                  {
                    cell.textContent = '';
                  }
                  if (day_of_the_date === "Sunday")
                  {
                    cell.textContent = '';              
                  }
                  //clear cell, no shift
                  
                }
                counter++;
              });
              table.appendChild(row);
              outer_counter++;
            });
          });
                      
          }, 1000);
          
          console.log(buttontext);
        };
        var month_dropdown = document.getElementsByClassName("month");
        var year_dropdown = document.getElementsByClassName("year");

        for (var i = 0;i < month_dropdown.length;i++)
        {

          month_dropdown[i].addEventListener('click',function(i){return function () {choose_month_func(i+1)};}(i),false);
          //load new plan here
          
        }
        for (var i = 0;i < year_dropdown.length;i++)
        {
          year_dropdown[i].addEventListener('click',choose_year_func,false);
          //load new plan here
        }
        })
    
  }

  // Load table data when the page loads
  window.onload = function() {
    
  };


document.addEventListener('DOMContentLoaded',function(){
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems,'left');
});  
var admin = false;
$(document).ready(function () {
    
    admin = sessionStorage.getItem('admin');
    if (admin === "false")
    {
      var convert_controls = document.getElementById("convert_control")
      convert_controls.style.display = "None";
    }
    request();
    console.log("admin is "+ admin);
    setTimeout(function (){
  
      loadTableData();
                
    }, 1000);
    setTimeout(function (){
  
      checkMissingShift();
    
                
    }, 2000);
    
		
    

		
		
		
		
		
		
	});

  // Function to get a specific cell by row and column indexes
  function getCellByIndexes(rowIndex, columnIndex) {
    const table = document.querySelector('.centered'); // Change the selector according to your table's class or ID
    const row = table.querySelectorAll('tr')[rowIndex];
    if (row) {
        const cell = row.querySelectorAll('td')[columnIndex];
        return cell;
    }
  return null;
}
  function checkMissingShift()
  {
    for (var i = 1;i<=31;i++)
    {
      for ( var j = 1;j<=2;j++)
      {
        //first,second,etc 
        var cell = getCellByIndexes(i,j);
        if (cell.innerHTML === "Friday" || cell.innerHTML === "Thursday" || cell.innerHTML === "Wednesday" || cell.innerHTML === "Tuesday" || cell.innerHTML === "Monday")
        {
          //check ahead
          var first_shift = getCellByIndexes(i,j+1);
          var second_shift = getCellByIndexes(i,j+2);
          var third_shift = getCellByIndexes(i,j+3);

          if (first_shift.innerHTML === "" || second_shift.innerHTML === "" || third_shift.innerHTML === "")
            {
              cell.style.backgroundColor = "blue";
            }
        } else if (cell.innerHTML === "Saturday" || cell.innerHTML === "Sunday")
        {
           //check ahead
           var first_shift = getCellByIndexes(i,j+1);
           
           var third_shift = getCellByIndexes(i,j+3);
 
           if (first_shift.innerHTML === "" || third_shift.innerHTML === "")
             {
               cell.style.backgroundColor = "blue";
             }
        }
      }
    }
  }

  function convertExcelToJson() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
      console.error('No file selected.');
      return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      const sheetName = workbook.SheetNames[0]; // Assuming you want data from the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      const jsonContent = JSON.stringify(jsonData, null, 2);
      console.log('Excel file converted to JSON:', jsonContent);
      // You can further process the JSON content as needed
      
      var table = document.querySelector('table tbody');
      table.innerHTML = ''; // Clear existing table content
      // Extract column headers (assuming they are consistent across rows)
      const columnHeaders = Object.keys(jsonData[0]);

      // Create table header row with column headers
      const headerRow = document.createElement('tr');
      columnHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
     // table.appendChild(headerRow);

      outer_counter = 1;
      jsonData.forEach(function(rowData, rowIndex) 
      {
        var row = document.createElement('tr');

        // Create and append the row number cell
        var numberCell = document.createElement('td');
        numberCell.textContent = rowIndex + 1;
        row.appendChild(numberCell);
        var counter = 0;
        console.log('Row Data:', rowData); // Log the row data for inspection

        columnHeaders.forEach(header => {

          const cellData = rowData[header]; // Use empty object if cellData is undefined/null
          if (counter !== 5)
            var cell = document.createElement('td');
          else 
            var cell = null;
          if (cell === null)
            return;
          cell.textContent = cellData !== undefined ? cellData : ''; // Display cell data or empty string
          if (counter === 5)
            cell.textContent = ''; // Display cell data or empty string
          //skip click function for days of the month
          if (counter === 1 )
          {
            cell.onclick = function() {
              if (admin === 'true')
                makeEditable(this);
            };
          }

          if (counter === 3 || 4)
          {
            cell.onclick = function() {
              if (admin === 'true')
                makeEditable(this);
            };
          }
          var day_of_the_date = days_data[outer_counter-1];
          if (counter === 2)
            {
              if (!(day_of_the_date === "Saturday") && !(day_of_the_date === "Sunday"))
              {
                cell.onclick = function() {
                  if (admin === 'true')
                    makeEditable(this);
                };

              } 
            }
          
          row.appendChild(cell);
          if (counter === 0)//counter==cell index per row exp: 0 === Tag, 1 === Frühschicht )
          {
            //fallback if days data wasnt loaded 9
            
             // request();

            //days 
            //get date (outer_counter)
           
            day_of_the_date = days_data[outer_counter-1];
            
            if (day_of_the_date === "Saturday")
            {
              cell.style.backgroundColor = 'red';

            } 
            if (day_of_the_date === "Sunday")
            {
              cell.style.backgroundColor = 'yellow';
              
            }
              
              cell.textContent = day_of_the_date;
          
          }
          if (counter === 2)//Mittelschicht 
          {
            var day_of_the_date = days_data[outer_counter-1];
            if (day_of_the_date === "Saturday")
            {
              cell.textContent = '';
            }
            if (day_of_the_date === "Sunday")
            {
              cell.textContent = '';              
            }
            //clear cell, no shift
            
          }
          counter++;
        });
        table.appendChild(row);
        outer_counter++;
      });
    };

    reader.onerror = function(event) {
      console.error('File could not be read:', event.target.error);
    };

    reader.readAsBinaryString(file);
  }