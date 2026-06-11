/* Contact form: client-side validation + friendly confirmation.
   The form also posts to Netlify Forms (data-netlify) when deployed. */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;
  var msg = document.getElementById('formMsg');

  form.addEventListener('submit', function (e) {
    var name = form.elements['name'].value.trim();
    var email = form.elements['email'].value.trim();
    var subject = form.elements['subject'].value;
    var body = form.elements['message'].value.trim();
    var ok = name && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && subject && body.length > 4;

    if (!ok) {
      e.preventDefault();
      msg.className = 'form-msg show';
      msg.style.background = '#fdecea'; msg.style.color = '#a52219'; msg.style.border = '1px solid #f5c6c1';
      msg.textContent = 'Please complete every field with a valid email and a short message.';
      return;
    }

    // If running locally (no Netlify backend), show a confirmation instead of erroring.
    if (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      e.preventDefault();
      msg.className = 'form-msg show ok';
      msg.style.cssText = '';
      msg.textContent = 'Thank you, ' + name + '! Your message about “' + subject + '” has been received. We’ll reply to ' + email + ' soon.';
      form.reset();
    }
    // Otherwise the browser submits to Netlify Forms normally.
  });
})();
