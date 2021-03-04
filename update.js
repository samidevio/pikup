$(document).ready(function(){
	$(function() {
		var imagesPreview = function(input, placeToInsertImagePreview) {
			if (input.files) {
				var filesAmount = input.files.length;
				for (var i = 0; i < filesAmount; i++) {
					let img = document.createElement('img');
					let imgSub = document.createElement('div');
					var reader = new FileReader();
					reader.onload = function(event) {
						img.src = event.target.result;
					};
					imgSub.setAttribute('class', 'img_item');
					imgSub.setAttribute('data-image', i);
					$(imgSub).append(img);
					$(placeToInsertImagePreview).append(imgSub);
					reader.readAsDataURL(input.files[i]);
				}
			}
		};
		$('#files').on('change', function() {
			$('#preview').empty();
			$('#percent').empty();
			$('#link').empty();
			imagesPreview(this, '#preview');
		});
	});
	$('#files').change(function(){
		var form_data = new FormData();
		var totalfiles = document.getElementById('files').files.length;
		var arr = [ 'image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/apng', 'image/avif', 'image/svg+xml', 'image/bmp', 'image/x-icon', 'image/tiff' ];
		var fileType = document.getElementById('files').files[0].type;
		var totalSize = 0;
		for (var index = 0; index < totalfiles; index++) {
			form_data.append("files[]", document.getElementById('files').files[index]);
			totalSize += document.getElementById('files').files[index].size;
		}
		if($.inArray(fileType,arr)== -1){
			alert('file_type error');
		}else{
			if(phpUploadFile >= totalfiles){
				if(totalSize < phpUploadSize){
					$.ajax({
						xhr: function() {
								var xhr = new window.XMLHttpRequest();
								xhr.upload.addEventListener("progress", function(evt) {
								if (evt.lengthComputable) {
									var percentComplete = evt.loaded / evt.total;
									$('#percent1').text(parseInt(percentComplete*100)+'%');
								}
							}, false);
							return xhr;
						},
						url: 'upload.php', 
						type: 'post',
						data: form_data,
						dataType: 'json',
						contentType: false,
						processData: false,
						success: function(data){
							if(data.hasOwnProperty('imgLink')){
								//alert(data.imgLink);
								$('#link').text(data.imgLink);
								$('.img_item img').fadeIn(3000);
							}
							if(data.hasOwnProperty('success')){
								alert(data.success);
							}
							if(data.hasOwnProperty('failed')){
								alert(data.failed);
							}
						}
					});
				}else{
					alert('File Size Big!');
					$('#files').val(null);
				}
			}else{
				alert('File Upload limit is '+phpUploadFile);
				$('#files').val(null);
			}
		}
	});
});