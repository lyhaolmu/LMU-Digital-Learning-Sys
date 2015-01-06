var main=function(){
    $('.dropdown-toggle').click(function(){
        $('.dropdown-menu').toggle();
    });
    
    
    $('.arrow-next').click(function(){
        var currentSlide = $('.active-slide');
        var nextSlide = $(currentSlide).next();
        
        if (nextSlide.length == 0) {
            nextSlide=$('.slide').first();
        }
        
        $(currentSlide).fadeOut(600).removeClass('active-slide');   
        $(nextSlide).fadeIn(600).addClass('active-slide');
        
        var currentdot = $('.active-dot');
        var nextdot = $(currentdot).next();
        if (nextdot.length == 0) {
        nextdot=$('.dot').first()}
        $(currentdot).removeClass('active-dot');
        $(nextdot).addClass('active-dot');
        
    });
        
    $('.arrow-prev').click(function(){
        var currentSlide = $('.active-slide');
        var prevSlide = $(currentSlide).prev();
        
        if (prevSlide.length == 0) {
            prevSlide=$('.slide').last();
        }
        
        $(currentSlide).fadeOut(600).removeClass('active-slide');
        $(prevSlide).fadeIn(600).addClass('active-slide');
        
     
        var currentdot = $('.active-dot');
        var prevdot = $(currentdot).prev();
        if (prevdot.length == 0) {
        prevdot=$('.dot').last()}
        $(currentdot).removeClass('active-dot');
        $(prevdot).addClass('active-dot');
        
    });
};
$(document).ready(main)
