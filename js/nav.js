var isis = isis || {};

isis.activePanel = 'ingredients';
isis.donePanel = true;
isis.stoppedAt = 0;
isis.stoppedAtShowErrorDelay = 1300;

$( document ).ready( function( $ ) {
    $('article.panel').hide();
    $('article.panel-ingredients').show();
    $('h4.nav').click(function(event) {
        event.preventDefault();
        var panelId = $(this).parent('li').attr('id').split('-')[0];

        if (panelId != 'ingredients')
            isis.donePanel = false;
        else {
            if ($('article.panel-' + panelId + ' input.knob').length == 0)
                isis.donePanel = false;
            else
                isis.donePanel = true;
        }

        isis.activePanel = panelId;
        isis.stoppedAt = 0;
        $('h4.nav').removeClass('selected');
        $(this).addClass('selected');
        $('article.panel').hide();
        $('article.panel-' + panelId).fadeIn();
        return false;
    });

    $('a.next').click(function(event){
        event.preventDefault();
        var nextStepArticleId = $(this).parents('article.panel').next().attr('id');
        if (nextStepArticleId) {
            var nextPanelId = nextStepArticleId.split('-')[1];
            $('#' + nextPanelId + '-nav h4').trigger('click');
        }
    });
});