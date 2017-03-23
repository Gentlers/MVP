$('#botn').on('click', (e) => {
  e.preventDefault()
  $.ajax({
    method: 'POST',
    url: '/pre',
    data: $('#pronto-date-know').serializeArray()
  })
  .done((msg) => {
    fbq('track', 'CompleteRegistration')
    alert('¡Gracias por pre-registrarte!\nPronto podrás ser parte de la experiencia GENTO.')
  })
})
