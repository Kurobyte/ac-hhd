function showMessage(missatge) {
    var error = document.createElement('div');
    error.setAttribute('role', 'alert');
    $(error).css('top', ($(window).scrollTop()+10)+"px");
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'close middleClose');
    button.setAttribute('data-dismiss', 'alert');
    button.setAttribute('aria-labbel', 'Close');
    var span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '&times;';

    error.innerHTML += missatge;
    error.setAttribute('class', 'popup-error alert ac-message alert-dismissible alert-box');

    button.appendChild(span);
    error.appendChild(button);
    document.body.appendChild(error);
    $(error).fadeOut(5000, function() { $(this).remove(); });
}