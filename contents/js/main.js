$(document).ready(function() {
    // fix navbar to top
    $(document).scroll(function() {
        var scroll = $(this).scrollTop();
        var topDistNav = $(".navbar").position();
        var topDistTitle = $(".page-header").position();
        if (scroll > topDistNav.top) {
            $('nav').css({"position": "fixed", "top": 0});
        } else {
            $('nav').css({"position": "relative", "top": "auto"});
            $('#website-title').css({"font-size": "36px"}, 1000)
        }
        if (scroll > topDistTitle.top) {
            $('#website-title').css({"position": "fixed", "top": 0});
            $('#website-title').css({"font-size": "25px"}, 1000)
        } else {
            $('#website-title').css({"position": "relative", "top": "auto"});
        }

        // load next page
        if ($(".load-more").length > 0) {
            var topDistMore = $(".load-more").position().top - $(".load-more").outerHeight();
            if ($(window).scrollTop() + $(window).height() > topDistMore) {
                var nextHref = $(".next-page").attr('href')
                $.ajax({ type: "GET", url: nextHref, async: false,
                    success : function(text){
                        article = $(text).find('.list-articles').html() // + '<script id="dsq-count-scr" src="//alimsvi.disqus.com/count.js" async></script>"';
                        $('.load-more').replaceWith(article);
                        $.getScript("//alimsvi.disqus.com/count.js");
                    },
                    error: function() {
                        $('.load-more').removeClass('bg-success');
                        $('.load-more').addClass('bg-danger');
                        $('.load-more > p').text('بارگزاری با مشکل روبرو شد.')
                    }
                });
            }
        }
    });

    // run colorbox to have image lightbox
    $('article img').parent("a").addClass("image-link").css({"width": "80%"})
    $('a.image-link:not(.islink)').colorbox({rel:"gal",maxWidth:"100%",maxHeight:"100%",scalePhotos:true});
});
