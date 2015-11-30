<!DOCTYPE html>
<html>
<!-- TODO
3) show list of files and update to show which ones done
4) enable/disable upload button according to required fields
10) show busy mouse when compressing and uploading image 
-->
        <head>
<meta charset='utf-8'/>
        <title>Image uploader</title>
        <link href="css/ex.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" href="css/bootstrap.min.css"/>
<link rel="stylesheet" href="css/bootstrap-responsive.min.css"/>
<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/main.js" type="text/javascript"></script>
        </head>
	<body>
		<div id='wrapper'>
			<div id='leftcol'>
<form id='select'>
          <label for="input">Select one or more images using shift-click or a whole folder with ctrl-A:</label><input class='btn btn-primary' type="file" name='input' id="input" multiple />
</form>
	<div style='display:none' id='source'>
	<img id="source_image" width='600' height='240'/>
	<canvas id='scaling_canvas'/>
	</div>
	<div>
	<canvas id='rotating_canvas'/>
	</div>
       <input class='btn btn-primary' type='button' value='Rotate Left' id="rotateleft"/>
       <input class='btn btn-primary' type='button' value='Rotate Right' id="rotateright"/>
			</div>
			<div id='rightcol'>
<form id='data'>
<ul>
<li> <label for='caption'>Caption:</label><input required type='text' name='caption' id='caption' placeholder='You must enter a caption'/></li>
<li> <label for='description'>Description:</label><input required type='textarea' name='description' id='description' placeholder='A longer description include names of people and boats'/> </li>
<li> <label for='copyright'>Copyright:</label><input required type='text' name='copyright' id='copyright' placeholder='The name of the copyright holder'/> </li>
<li> <label for='year'>Year:</label><input required type='number' name='year' id='year' placeholder='When the event depicted occured'/> </li>
<li> <label for='area'>OGA Area:</label><input required type='text' name='area' id='area' placeholder='e.g. East Coast'/> </li>
</ul>
              <input class='btn btn-success' type='button' value='Upload' id="upload"/>
</form>
Compressing: <progress id="compression-progress" value="0" max="6"/>
Uploading: <progress id="upload-progress" value="0" max="100"/>
			</div>
			<div id='lower'>
              <input class='btn btn-primary' id="next" value='Next'/>
          <legend>Diagnostics</legend>
          <div id='console_out'></div>
			</div>
		</div>
	</body>
</html>

