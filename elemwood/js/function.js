(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.active-sticky-header").css("height", $('header.active-sticky-header .header-sticky').outerHeight());
		}	
	
		$window.on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			$("header.active-sticky-header .header-sticky").toggleClass("active", (fromTop > 60));
			$("header.active-sticky-header .header-sticky").removeClass("hide");
		});
	}	
	
	/* Slick Menu JS */
	$('#menu').slicknav({
		label : '',
		prependTo : '.responsive-menu'
	});

	if($("a[href='#top']").length){
		$(document).on("click", "a[href='#top']", function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* Service Slider JS */
	if ($('.service-slider').length) {
		const service_slider = new Swiper('.service-slider .swiper', {
			slidesPerView : 1,
			speed: 1500,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.service-pagination',
				clickable: true,
			},
			breakpoints: {
				768:{
					slidesPerView: 2,
				},
				1300:{
					slidesPerView: 3,
				}
			}
		});
	}

	/* Testimonial Slider JS */
	if ($('.testimonial-slider').length) {
		const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
			slidesPerView : 1,
			speed: 2500,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			navigation: {
				nextEl: '.testimonial-button-next',
				prevEl: '.testimonial-button-prev',
			},
			breakpoints: {
				768:{
					slidesPerView: 1,
				},
			}
		});
	}

	/* testimonial Slider Royal JS */
	if ($('.testimonial-slider-royal').length) {
		const testimonial_slider_royal = new Swiper('.testimonial-slider-royal .swiper', {
			slidesPerView : 1,
			speed: 1500,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			navigation: {
				nextEl: '.testimonial-button-next-royal',
				prevEl: '.testimonial-button-prev-royal',
			},
			breakpoints: {
				768:{
					slidesPerView: 1,
				},
			}
		});
	}

	/* Hero Image Carousel */
	if ($('.hero-carousel-swiper').length) {
		var $heroPrime = $('.hero-prime');

		function matchHeroToImage(swiperInstance) {
			var slide = swiperInstance.slides[swiperInstance.activeIndex];
			if (!slide) return;
			var img = slide.querySelector('.hero-slide-main');
			if (!img) return;

			function applySize() {
				if (!img.naturalWidth || !img.naturalHeight) return;
				var ratio = img.naturalWidth / img.naturalHeight;
				var width = $heroPrime.outerWidth();
				if (!width || !ratio) return;
				/* Boost height so hero fills more screen and white gap below goes away */
				var nextHeight = Math.round((width / ratio) * 1.28);
				var minH = window.innerWidth <= 991 ? 580 : 680;
				var maxH = Math.round(window.innerHeight * 0.96);
				nextHeight = Math.max(minH, Math.min(maxH, nextHeight));
				$heroPrime.css({
					height: nextHeight + 'px',
					minHeight: minH + 'px',
					aspectRatio: 'auto'
				});
			}

			if (img.complete && img.naturalWidth) {
				applySize();
			} else {
				img.addEventListener('load', applySize, { once: true });
			}
		}

		const hero_carousel = new Swiper('.hero-carousel-swiper', {
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			speed: 1100,
			loop: true,
			allowTouchMove: true,
			autoplay: {
				delay: 4500,
				disableOnInteraction: false
			},
			pagination: {
				el: '.hero-carousel-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.hero-carousel-next',
				prevEl: '.hero-carousel-prev'
			},
			on: {
				init: function () {
					matchHeroToImage(this);
				},
				slideChangeTransitionStart: function () {
					matchHeroToImage(this);
				}
			}
		});

		$window.on('resize', function () {
			matchHeroToImage(hero_carousel);
		});
	}

	/* Testimonial Slider Prime JS */
	if ($('.testimonial-slider-prime').length) {
		const testimonial_slider_prime = new Swiper('.testimonial-slider-prime .swiper', {
			slidesPerView : 1,
			speed: 1500,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			breakpoints: {
				768:{
					slidesPerView: 2,
				},
				1300:{
					slidesPerView: 3,
				}
			}
		});
	}
	
	/* Skill Bar */
	if ($('.skills-progress-bar').length) {
		$('.skills-progress-bar').waypoint(function() {
			$('.skillbar').each(function() {
				$(this).find('.count-bar').animate({
				width:$(this).attr('data-percent')
				},2000);
			});
		},{
			offset: '70%'
		});
	}

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Force muted hero background video playback */
	var heroVideo = document.getElementById('myvideo');
	if (heroVideo) {
		heroVideo.muted = true;
		heroVideo.setAttribute('playsinline', '');
		var tryPlay = function () {
			var playPromise = heroVideo.play();
			if (playPromise && typeof playPromise.catch === 'function') {
				playPromise.catch(function () {});
			}
		};
		if (heroVideo.readyState >= 2) {
			tryPlay();
		} else {
			heroVideo.addEventListener('loadeddata', tryPlay, { once: true });
			heroVideo.load();
		}
	}

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 3000 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	/* Text Effect Animation */
	function initHeadingAnimation() {
		
		if($('.text-effect').length) {
			var textheading = $(".text-effect");

			if(textheading.length === 0) return; gsap.registerPlugin(SplitText); textheading.each(function(index, el) {
				
				el.split = new SplitText(el, { 
					type: "lines,words,chars",
					linesClass: "split-line"
				});
				
				if( $(el).hasClass('text-effect') ){
					gsap.set(el.split.chars, {
						opacity: .3,
						x: "-7",
					});
				}
				el.anim = gsap.to(el.split.chars, {
					scrollTrigger: {
						trigger: el,
						start: "top 92%",
						end: "top 60%",
						markers: false,
						scrub: 1,
					},

					x: "0",
					y: "0",
					opacity: 1,
					duration: .7,
					stagger: 0.2,
				});
				
			});
		}
		
		if ($('.text-anime-style-1').length) {
			let staggerAmount 	= 0.05,
				translateXValue = 0,
				delayValue 		= 0.5,
			   animatedTextElements = document.querySelectorAll('.text-anime-style-1');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
					gsap.from(animationSplitText.words, {
					duration: 1,
					delay: delayValue,
					x: 20,
					autoAlpha: 0,
					stagger: staggerAmount,
					scrollTrigger: { trigger: element, start: "top 85%" },
					});
			});		
		}
		
		if ($('.text-anime-style-2').length) {				
			let	 staggerAmount 		= 0.03,
				 translateXValue	= 20,
				 delayValue 		= 0.1,
				 easeType 			= "power2.out",
				 animatedTextElements = document.querySelectorAll('.text-anime-style-2');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
					gsap.from(animationSplitText.chars, {
						duration: 1,
						delay: delayValue,
						x: translateXValue,
						autoAlpha: 0,
						stagger: staggerAmount,
						ease: easeType,
						scrollTrigger: { trigger: element, start: "top 85%"},
					});
			});		
		}
		
		if ($('.text-anime-style-3').length) {		
			let	animatedTextElements = document.querySelectorAll('.text-anime-style-3');
			
			 animatedTextElements.forEach((element) => {
				//Reset if needed
				if (element.animation) {
					element.animation.progress(1).kill();
					element.split.revert();
				}

				element.split = new SplitText(element, {
					type: "lines,words,chars",
					linesClass: "split-line",
				});
				gsap.set(element, { perspective: 400 });

				gsap.set(element.split.chars, {
					opacity: 0,
					x: "50",
				});

				element.animation = gsap.to(element.split.chars, {
					scrollTrigger: { trigger: element,	start: "top 90%" },
					x: "0",
					y: "0",
					rotateX: "0",
					opacity: 1,
					duration: 1,
					ease: Back.easeOut,
					stagger: 0.02,
				});
			});		
		}
	}
	
	if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            initHeadingAnimation();
        });
    } else {
        window.addEventListener("load", initHeadingAnimation);
    }

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 1024))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	$('.gallery-items').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
			  return element.find('img');
			}
		}
	});

	/* Contact form validation - offline (no remote POST) */
	var $contactform = $("#contactForm");
	$contactform.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			$contactform[0].reset();
			submitMSG(true, "Message Sent Successfully!");
		}
	});

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h4 text-success";
		} else {
			var msgClasses = "h4 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Contact form validation end */

	/* Appointment form validation - offline (no remote POST) */
	var $appointmentForm = $("#appointmentForm");
	$appointmentForm.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			$appointmentForm[0].reset();
			appointmentsubmitMSG(true, "Message Sent Successfully!");
		}
	});

	function appointmentsubmitMSG(valid, msg){
		if(valid){
			var msgClasses = "h3 text-success";
		} else {
			var msgClasses = "h3 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Appointment form validation end */

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video - local MP4 only (fully offline, no YouTube/iframe CDN) */
	if ($('.popup-video').length) {
		$('.popup-video').each(function () {
			var href = $(this).attr('href');
			if (!href || href === '#' || /^https?:/i.test(href) || /youtube|youtu\.be/i.test(href)) {
				$(this).attr('href', 'images/hero-bg-video.mp4');
			}
		});

		$('.popup-video').magnificPopup({
			type: 'inline',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true,
			callbacks: {
				elementParse: function (item) {
					var src = item.el.attr('href') || 'images/hero-bg-video.mp4';
					item.src =
						'<div class="offline-video-popup" style="max-width:960px;margin:0 auto;">' +
						'<video src="' + src + '" controls autoplay playsinline ' +
						'style="width:100%;max-height:80vh;background:#000;border-radius:12px;"></video>' +
						'</div>';
				},
				close: function () {
					$('.offline-video-popup video').each(function () {
						this.pause();
					});
				}
			}
		});
	}

	/* Service Item List Start */
	var $service_item_list = $('.service-item-list');
	if ($service_item_list.length) {
		var $service_item = $service_item_list.find('.service-item');

		if ($service_item.length) {
			$service_item.on({
				mouseenter: function () {
					if (!$(this).hasClass('active')) {
						$service_item.removeClass('active'); 
						$(this).addClass('active'); 
					}
				},
				mouseleave: function () {
					// Optional: Add logic for mouse leave if needed
				}
			});
		}
	}
	/* Service Item List End */

	/* Book Online / Book Skin Check toggle */
	(function initBookCtaToggle(){
		var $cta = $('.book-cta-toggle');
		if(!$cta.length){ return; }

		var mode = 'online';
		var timer;

		function applyMode(next){
			mode = next;
			$cta.addClass('is-swapping');
			window.setTimeout(function(){
				var label = mode === 'skin' ? $cta.data('label-skin') : $cta.data('label-online');
				var href = mode === 'skin' ? $cta.data('href-skin') : $cta.data('href-online');
				$cta.attr({'href': href, 'data-mode': mode});
				$cta.find('.book-cta-text').text(label);
				$cta.removeClass('is-swapping');
			}, 180);
		}

		function startRotate(){
			window.clearInterval(timer);
			timer = window.setInterval(function(){
				applyMode(mode === 'online' ? 'skin' : 'online');
			}, 3800);
		}

		$cta.on('mouseenter focusin', function(){ window.clearInterval(timer); });
		$cta.on('mouseleave focusout', startRotate);
		startRotate();
	})();

	
})(jQuery);