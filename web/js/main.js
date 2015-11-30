$(function() {

	
    document.getElementById("select").reset();
    document.getElementById("next").disabled = true;

    //Console logging (html)
    if (!window.console)
        console = {};
    
    var console_out = document.getElementById('console_out');
    var maxSize = 2 * 1024 * 1024;
    var fileList = null;
    var nextFile = 0;
    var angleInDegrees=0;

    console.log = function(message) {
        console_out.innerHTML += message + '<br />';
        console_out.scrollTop = console_out.scrollHeight;
    }

    function loadImage(event) {
	document.body.style.cursor = 'wait';
        var i = document.getElementById("source_image");
        i.onload = function(){
	
		if(i.naturalWidth > i.naturalHeight){
			i.style.width="600px";
		}else{
			i.style.height="600px";
		}
		i.style.display = "block";
		var rc = document.getElementById('rotating_canvas');
		resize_canvas(rc, i.naturalWidth, i.naturalHeight, false);
		rc.getContext("2d").drawImage(i, 0, 0, i.naturalWidth, i.naturalHeight, 0, 0, rc.width, rc.height);
		document.body.style.cursor = 'auto';
       }
       i.src = event.target.result;
    }
 

    function initMetaData() {
	var fields = ['caption', 'description'];
	for(var i = 0; i<fields.length; i++) {
		var field = document.getElementById(fields[i]);
		field.select();
		field.setRangeText("");
	}
    }

    function compressImage(source_image, callback) {
        
	var lowQ = 0;
	var highQ = 1;
	var quality = 0.90;

        var bar = document.getElementById("compression-progress");
	bar.value = 0;

        var time_start = new Date().getTime();
        var cvs = document.getElementById('scaling_canvas');
        var ctx = cvs.getContext("2d");

	if(angleInDegrees == 90 || angleInDegrees == 270) {
		cvs.width = source_image.naturalHeight;
		cvs.height = source_image.naturalWidth;
	}
	else {
		cvs.width = source_image.naturalWidth;
		cvs.height = source_image.naturalHeight;
	}
	drawRotatedToCanvas(source_image, cvs, angleInDegrees);

	var cb = function(b) {

		bar.value = bar.value+1;

		if(b.size > maxSize) {
			highQ = quality;
			quality = lowQ + (highQ - lowQ) / 2.0;
			if(Math.abs(highQ-lowQ)>0.05) {
				cvs.toBlob(cb, "image/jpeg", quality);
				return;
			}
		}
		else if(b.size < (maxSize*0.85)) {
			lowQ = quality;
			quality = lowQ + (highQ - lowQ) / 2.0;
			if(Math.abs(highQ-lowQ)>0.05) {
				cvs.toBlob(cb, "image/jpeg", quality);
				return;
			}
		}

		callback(b, source_image.filename.split(/\./)[0]+".jpg");

		var s = b.size/1024/1024;
		var duration = new Date().getTime() - time_start;
		console.log('Compressed to '+s.toPrecision(2)+' MB in: ' + duration + 'ms');
	}

	cvs.toBlob(cb, "image/jpeg", quality);
    };


    function resize_canvas(rc, w, h, rotated){
	var rc_area = rc.width * rc.height;
	var sc_area = w * h;
	var scale = Math.sqrt(sc_area / rc_area);
	if(rotated) {
		rc.width = h / scale;
		rc.height = w / scale
	}
	else {
		rc.width = w / scale;
		rc.height = h / scale
	}
    };

    function drawRotatedToCanvas(sc, rc, degrees){
	var ctx = rc.getContext("2d");
	ctx.clearRect(0,0,rc.width,rc.height);
	ctx.translate(rc.width/2, rc.height/2);
	ctx.rotate(degrees*Math.PI/180);
	if(degrees == 90 || degrees == 270) {
		ctx.drawImage(sc, 0, 0, sc.naturalWidth, sc.naturalHeight, -rc.height/2, -rc.width/2, rc.height, rc.width);
	}
	else {
		ctx.drawImage(sc, 0, 0, sc.naturalWidth, sc.naturalHeight, -rc.width/2, -rc.height/2, rc.width, rc.height);
	}
    }

    function drawRotated(degrees){
	var sc = document.getElementById('source_image');
	var rc = document.getElementById('rotating_canvas');
	resize_canvas(rc, sc.naturalWidth, sc.naturalHeight, degrees == 90 || degrees == 270);
	drawRotatedToCanvas(sc, rc, degrees);
    };

    document.getElementById("rotateright").addEventListener("click", function (e) {
	angleInDegrees = (angleInDegrees + 90) % 360;
	drawRotated(angleInDegrees);
    }, false);

    document.getElementById("rotateleft").addEventListener("click", function (e) {
	if(angleInDegrees == 0)
		angleInDegrees = 270;
	else
		angleInDegrees = (angleInDegrees - 90) % 360;
	drawRotated(angleInDegrees);
    }, false);
    
    document.getElementById("input").addEventListener("change", function (e) {
	fileList = this.files;
	nextFile = 0;
	if(this.files.length>0) {
		var loadButton = document.getElementById('next');
		loadButton.removeAttribute('disabled');
		window.setTimeout(function() { loadButton.click(); }, 50);
	}
    }, false);

    document.getElementById("data").addEventListener("change", function (e) {
	if(this.checkValidity()) {
		document.getElementById("upload").removeAttribute('disabled');
	}
    }, false);

    document.getElementById('next').addEventListener('click', function(e) {

	var file = fileList[nextFile++]; 
	angleInDegrees = 0;
	initMetaData();

	if(nextFile>=fileList.length) {
		this.disabled = true;
    		document.getElementById("select").reset();
	}

        reader = new FileReader();
        reader.onload = loadImage;

        var img = document.getElementById("source_image");
	img.filename = file.name;
        
	var s = parseInt(file.size)/1024/1024;
        console.log("loaded " + file.name+" size " + s.toPrecision(2)+' MB');
        
        reader.readAsDataURL(file);

        document.getElementById("upload").disabled=true;

    }, false);

    document.getElementById("upload").addEventListener('click', function(e) {

        var form = document.getElementById("data");
	if(form.checkValidity()) {
	}
	else {
		console.log("form not valid");
		return;
	}
        var img = document.getElementById("source_image");
	if(img.src == '') {
		//form.setCustomValidity("No image chosen");
		console.log("no image");
		return;
	}
	compressImage(img, function(blob, filename) {
        	var bar = document.getElementById("upload-progress");
		var xhr = new XMLHttpRequest();
		xhr.onload = function(e) {
			console.log(this.responseText);
		}
		xhr.upload.addEventListener("progress", function(e) {
			if (e.lengthComputable) {
				bar.value = Math.round((e.loaded * 100) / e.total);
			}
		}, false);

		xhr.open('POST', "upload.php", true);
		var formdata = new FormData();
		formdata.append("file", blob, filename);
		for(var i=0; i<form.elements.length; i++) {
			formdata.append(form.elements[i].name, form.elements[i].value);
		}
		xhr.send(formdata);
	});
    }, false);

});
