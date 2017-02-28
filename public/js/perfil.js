$('.btn-edicion').on('click', function(e) {
	e.preventDefault();
	$('#edicion').css("display","block")
	$this = $('.btn-edicion')
	$this.css("display","none")
})