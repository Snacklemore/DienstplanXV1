<%inherit file="base.mako"/>
	


<%block name="PdfView">
	<script src="static/js/helper.js"></script>

	<div id="convert_control"> 
		<input type="file" id="fileInput" />
  		<button id="convert" onclick="convertExcelToJson()">Convert</button>
	</div>
	
	<a id=monthdrop class='dropdown-trigger btn' href='#' data-target='dropdown1'>Change Month</a>
	<a id=yeardrop class='dropdown-trigger btn' href='#' data-target='dropdown2'>Change Year</a>
	
	
	<!-- Dropdown Structure -->
  	<ul id='dropdown1' class='dropdown-content'>
		<li><a class='month' id=m1 >Januar</a></li>
		<li><a class='month' id=m2>Februar</a></li>
		<li><a class='month' id=m3>März</a></li>
		<li><a class='month' id=m4>April</a></li>
		<li><a class='month' id=m5>Mai</a></li>
		<li><a class='month' id=m6>Juni</a></li>
		<li><a class='month' id=m7>Juli</a></li>
		<li><a class='month' id=m8>August</a></li>
		<li><a class='month' id=m9>September</a></li>
		<li><a class='month' id=m10>Oktober</a></li>
		<li><a class='month' id=m11>November</a></li>
		<li><a class='month' id=m12>Dezember</a></li>
  	</ul>
	<ul id='dropdown2' class='dropdown-content'>
		<li><a class='year' id=y1>2023</a></li>
		<li><a class='year' id=y2>2024</a></li>
		<li><a class='year' id=y3>2025</a></li>
		<li><a class='year' id=y4>2026</a></li>
		<li><a class='year' id=y5>2027</a></li>
		
  	</ul>
	 <table class="centered">
    <thead>
      <tr>
			<th>Datum </th>
			<th>Tag </th>
          	<th>Frühschicht(06-12)||WE (08-16)</th>
			<th>Mittelschicht(12-20)</th>
			<th>Nachtschicht(20-02)||WE (16-02)</th>
			<th>Bemerkungen </th>
			
      </tr>
    </thead>
    <tbody>
      % for i in range(31):
        <tr>
          % for j in range(6):
		  	% if j==6:
            	<td onclick="makeEditable(this)">Team/Feier/etc.</td>
			
			% elif j==1:
				<td >FreakyFriday</td>
			% else:
				 <td >Platzhalter Nico</td>
			% endif	 
          % endfor
        </tr>
      % endfor
    </tbody>
  </table>
</%block>



