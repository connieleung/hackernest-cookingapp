$( document ).ready( function( $ ) {
    $('article.panel').hide();
    $('h4.cbp-nttrigger').click(function(event) {
        event.preventDefault();
        var panelId = $(this).parent('li').attr('data-panel');
        $('article.panel').hide();
        $('article.panel-' + panelId).show();
    });
});