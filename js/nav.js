var isis = isis || {};

isis.activePanel = 'ingredients';

$( document ).ready( function( $ ) {
    $('article.panel').hide();
    $('article.panel-ingredients').show();
    $('h4.nav').click(function(event) {
        event.preventDefault();
        var panelId = $(this).parent('li').attr('data-panel');
        isis.activePanel = panelId;
        $('h4.nav').removeClass('selected');
        $(this).addClass('selected');
        $('article.panel').hide();
        $('article.panel-' + panelId).show();
        return false;
    });
});