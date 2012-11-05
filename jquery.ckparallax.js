// ckParallax v1.0
// Written on jQuery 1.8.0
// Written by Dustin Newbold

// ckParallax global object
ckplglobj = {};

;(function($) {
	var defaults = {
		speedSlide: 1000, // Speed going from slide to slide
		speedLayerMax: 500, // Fastest layer (layer 1) to move to its location
		speedLayerDiff: 250, // Difference of speed between each layer

		slideHeight: 350,
		slideWidth: 960,

		// Basic structure templates
		overallHTML: '<div class="parallax-window"><div class="parallax-container">{SLIDEHTML}</div></div><div class="parallax-controls">{CONTROLS}</div>',
		slideHTML: '<div class="parallax-slide" id="{SLIDEID}">{LAYERSHTML}</div>',
		layerHTML: '<div class="{LAYERCLASS}">{TEMPLATE}</div>',
		controlsHTML: '<a href="#{SLIDEID}">{HEADER}</a>',

		// Type templates
		textTemplate: '<h2>{HEADER}</h2><p>{TEXT}</p>',
		imageTemplate: '<img src="{URL}" alt="{ALT}"/>',

		windowClass: 'parallax-window', // Is the visible portion of the slides
		containerClass: 'parallax-container', // Holds all the slides, super-wide
		slideClass: 'parallax-slide', // Holds each individual slide
		slideID: 'parallax-slide-#', // Holds ID information for each slide
		layerClass: 'parallax-layer', // Holds each layer since each move at different speeds
		activeClass: 'active', // applied to the current visible slide
		controllClass: 'parallax-controls', // container class for controls

		// Build out the controls using the templates above
		buildControls: true,

		// Parallax effects
		useParallax: true,
		parallaxDist: 500,

		// Fancies
		fadeInAfterLoad: true,
		fadeInSpeed: 1000,

		slides:
		[
			{
				layers:
				[
					{
						type: 'text',
						header: '2000',
						text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
					},
					{
						type: 'image',
						url: 'https://www.google.com/images/srpr/logo3w.png',
						alt: 'Googles Logo!'
					},
					{
						type: 'image',
						url: 'https://www.google.com/images/srpr/logo3w.png',
						alt: 'Googles Logo!'
					},
					{
						type: 'image',
						url: 'https://www.google.com/images/srpr/logo3w.png',
						alt: 'Googles Logo!'
					}
				]
			},
			{
				nocontrol: true,
				advanced: true,
				html: '<h1>FILLER</h1>'
			},
			{
				nocontrol: true,
				advanced: true,
				html: '<h1>FILLER</h1>'
			},
			{
				layers:
				[
					{
						type: 'text',
						header: '2000',
						text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
					},
					{
						type: 'image',
						url: 'https://www.google.com/images/srpr/logo3w.png',
						alt: 'Googles Logo!'
					},
					{
						type: 'image',
						url: 'https://www.google.com/images/srpr/logo3w.png',
						alt: 'Googles Logo!'
					}
				]
			}
		]
	};

	// Simple console output function
	function output(text) {
		if(window.console.log) {
			console.log(text);
		}
	};

	function ckParallax(element, options) {
		this.config = $.extend({}, defaults, options);
		this.element = element;
		this.init();
	};

	ckParallax.prototype.nextSlide = function() {
		var $this = this.element,
			ckt = this;

		var $container = $('.' + ckt.config.containerClass),
			$curSlide = ckt.getCurSlide(),
			$nextSlide = ckt.getNextSlide();

		// Exit if destination is same as source
		if($nextSlide[0] == $curSlide[0]) return false;

		// Change active status on both
		$curSlide.removeClass(ckt.config.activeClass);
		$nextSlide.addClass(ckt.config.activeClass);

		$container.animate({
			left: 0 - (ckt.config.slideWidth * ckt.getSlideNum($nextSlide))
		}, {
			duration: ckt.config.speedSlide
		});

		ckt.slideLayers($nextSlide);
	};

	ckParallax.prototype.gotoSlide = function(element) {
		var $this = this.element,
			ckt = this,
			$container = $('.' + ckt.config.containerClass),
			$curSlide = ckt.getCurSlide(),
			$nextSlide = $(element);

		// Exit if destination is same as source
		if($nextSlide[0] == $curSlide[0]) return false;

		// Change active status on both
		$curSlide.removeClass(ckt.config.activeClass);
		$nextSlide.addClass(ckt.config.activeClass);

		$container.animate({
			left: 0 - (ckt.config.slideWidth * ckt.getSlideNum($nextSlide))
		}, {
			duration: ckt.config.speedSlide,
			queue: false
		});

		if(ckt.getSlideNum($curSlide) < ckt.getSlideNum($nextSlide)) {
			ckt.slideLayers($nextSlide);
		} else {
			ckt.slideLayers($nextSlide, -1);
		}
	};

	ckParallax.prototype.slideLayers = function(slide, direction) {
		var $this = this.element,
			ckt = this;

		direction = typeof direction === "undefined" ? 1 : direction;

		if(ckt.config.useParallax) {
			$.each(slide.children('.' + ckt.config.layerClass), function() {
				var $layer = $(this);

				if(!$layer.attr('data-parallax-left')) {
					$layer.attr('data-parallax-left', $layer.position().left);
				}
				$layer.css({
					left: parseInt($layer.attr('data-parallax-left')) + (direction * ckt.config.parallaxDist)
				});
			});

			var layerCounter = 0;
			$.each(slide.children('.' + ckt.config.layerClass), function() {
				var $layer = $(this);

				layerCounter++;
				$layer.animate({
					left: $layer.attr('data-parallax-left')
				}, {
					duration: ckt.config.speedLayerMax + (ckt.config.speedSlide / 2) + (ckt.config.speedLayerDiff * layerCounter)
				});
			});
		}
	};

	ckParallax.prototype.getSlideNum = function(slide) {
		var slideCount = 0;

		$.each($('.' + this.config.slideClass), function() {
			if($(this)[0] == slide[0]) {
				return false;
			} else {
				slideCount++;
			}
		});

		return slideCount;
	};

	ckParallax.prototype.getNextSlide = function() {
		var $this = this.element,
			$curSlide = this.getCurSlide(),
			$nextSlide = null;

		$nextSlide = $curSlide.next();
		if($nextSlide.length == 0) {
			$nextSlide = $('.' + this.config.slideClass).first();
		}

		return $nextSlide;
	};

	ckParallax.prototype.getCurSlide = function() {
		var $curSlide = $('.' + this.config.slideClass + '.' + this.config.activeClass);

		if($curSlide.length == 0) {
			$curSlide = $('.' + this.config.slideClass).first();
			$curSlide.addClass(this.config.activeClass);
		}

		return $curSlide;
	};

	ckParallax.prototype.init = function() {
		var $this = this.element,
			ckt = this;

		if(ckt.config.fadeInAfterLoad == true) {
			$this.hide();
		}

		// If given an empty div, lets fill it up
		if($this.children().length == 0) {
			var html = ckt.config.overallHTML,
				slides = '',
				controls = '',
				slideCounter = 0,
				viewSlideCounter = 0;

			$.each(ckt.config.slides, function() {
				var slide = ckt.config.slideHTML,
					slideID = ckt.config.slideID;
				slideCounter++;

				if(this.advanced == true) {
					layers = this.html;
				} else {
					var layers = '';

					$.each(this.layers, function() {
						var template = null,
							layer = ckt.config.layerHTML;

						if(this.type == 'text') {
							template = ckt.config.textTemplate;
							template = template.replace('{HEADER}', this.header);
							template = template.replace('{TEXT}', this.text);
						} else if(this.type == 'image') {
							template = ckt.config.imageTemplate;
							template = template.replace('{URL}', this.url);
							template = template.replace('{ALT}', this.alt);
						} else {
							template = this.html;
						}

						layer = layer.replace('{LAYERCLASS}', ckt.config.layerClass);
						layer = layer.replace('{TEMPLATE}', template);

						layers += layer;
					});
				}

				if(this.nocontrol !== true && ckt.config.buildControls === true) {
					viewSlideCounter++;
					var control = ckt.config.controlsHTML;
					control = control.replace('{SLIDEID}', slideID.replace('#', slideCounter));
					control = control.replace('{HEADER}', 'Slide #' + viewSlideCounter);
					controls += control;
				}

				slide = slide.replace('{LAYERSHTML}', layers);
				slide = slide.replace('{SLIDEID}', slideID.replace('#', slideCounter));
				slides += slide;
			});
			html = html.replace('{SLIDEHTML}', slides);

			html = html.replace('{CONTROLS}', controls);

			$this.append(html);

		// Structure is already built for us
		} else {
			$('.' + ckt.config.slideClass).first().addClass(ckt.config.activeClass);
		}

		if(ckt.config.fadeInAfterLoad == true) {
			$this.fadeIn(ckt.config.fadeInSpeed);
		}

		ckplglobj = this;
	};

	$.fn.ckparallax = function(options) {
		var $this = $(this);

		// Only run if used on a proper element
		if($this.selector != "") {
			if($this.length > 0) {
				new ckParallax($this, options);
			}

		// Else run the controls
		} else {
			if(ckplglobj == null) {
				output("You cannot use this function without first initializing a ckParallax object. Use: $(element).ckParallax(options);");
				return false;
			} else {
				return ckplglobj;
			}
		}
	}
})(jQuery);