//require('../styles/landing.less');

var STARTING_TEAM_SIZE = 0;
var MIN_USERS = 2;
var MAX_USERS = 50;

var FREE_USERS = 2;
var MONTHLY_COST = 15;
var ANNUAL_COST = 10;

function setUpCalculator() {
  var pricing_calculator = document.querySelector('.pricing-calculator');
  if (!pricing_calculator) {
    console.warn('No .pricing-calculator element found.');
    return;
  }

  var pricing_slider = pricing_calculator.querySelector('.pricing-slider');
  if (!pricing_slider) {
    console.warn('No .pricing-slider element found.');
    return;
  }

  var pricing_bar = pricing_calculator.querySelector('.pricing-slider-bar');
  if (!pricing_bar) {
    console.warn('No .pricing-bar element found.');
    return;
  }

  var pricing_fill = pricing_calculator.querySelector('.pricing-slider-fill');
  if (!pricing_fill) {
    console.warn('No .pricing-fill element found.');
    return;
  }

  var pricing_knob = pricing_calculator.querySelector('.pricing-slider-knob');
  if (!pricing_knob) {
    console.warn('No .pricing-knob element found.');
    return;
  }
  var pricing_amount = pricing_calculator.querySelector('.pricing-amount > span');
  if (!pricing_amount) {
    console.warn('No .pricing-amount element found.');
    return;
  }

  var pricing_users_count = pricing_calculator.querySelector('.pricing-users-count');
  if (!pricing_users_count) {
    console.warn('No .pricing-users-count element found.');
    return;
  }

  var pricing_monthly = pricing_calculator.querySelector('.pricing-monthly');
  if (!pricing_monthly) {
    console.warn('No .pricing-monthly element found.');
    return;
  }

  var pricing_annual = pricing_calculator.querySelector('.pricing-annual');
  if (!pricing_annual) {
    console.warn('No .pricing-annual element found.');
    return;
  }

  var monthly_pricing = true;

  var barWidth = pricing_bar.offsetWidth;
  var knobWidth = pricing_knob.offsetWidth;

  var dragging = false;
  var lastX = null;
  var sliderValue = (STARTING_TEAM_SIZE - MIN_USERS) / (MAX_USERS - MIN_USERS);

  function onResize() {
    barWidth = pricing_bar.offsetWidth;
    knobWidth = pricing_knob.offsetWidth;
    var clampedValue = Math.min(1, Math.max(0, sliderValue));
    updateSlider(clampedValue);
  }

  function onKnobMouseDown(e) {
    dragging = true;
    var x = e.touches ? e.touches[0].clientX : e.clientX;
    lastX = x;
  }

  function onKnobMouseUp(e) {
    dragging = false;
    lastX = null;
  }

  function onMouseMove(e) {
    if (!dragging || !lastX) return;
    e.stopPropagation();
    e.preventDefault();
    var x = e.touches ? e.touches[0].clientX : e.clientX;
    var delta = x - lastX;
    lastX = x;
    var normalizedDelta = delta / barWidth;
    sliderValue += normalizedDelta;
    onSliderValueChange(sliderValue);
  }


  function onSliderValueChange(value) {
    var clampedValue = Math.min(1, Math.max(0, sliderValue));
    updateSlider(clampedValue);
    updateTextValues(clampedValue);
  }

  function onMonthlyClick(e) {
    e.preventDefault();
    monthly_pricing = true;
    updateMonthlyToggle(monthly_pricing);
    onSliderValueChange(sliderValue);
  }

  function onAnnualClick(e) {
    e.preventDefault();
    monthly_pricing = false;
    updateMonthlyToggle(monthly_pricing);
    onSliderValueChange(sliderValue);
  }

  function lerp(min, max, x) {
    var range  = max - min;
    return min + range * x;
  }

  function updateSlider(clampedValue) {
    pricing_knob.style.left = (clampedValue * barWidth - knobWidth * 0.5) + 'px';
    pricing_fill.style.transform = 'scale(' + clampedValue + ', 1)';
  }

  function updateTextValues(sliderValue) {
    var users  = Math.round(lerp(MIN_USERS, MAX_USERS, sliderValue));
    var price;
    if (monthly_pricing) {
      price = monthly_price(users);
    }
    else {
      price = annual_price(users)
    }
    pricing_amount.innerText = price;
    pricing_users_count.innerText = users + ' users';
  }

  function updateMonthlyToggle(monthly) {
    if (monthly) {
      pricing_monthly.classList.add('switch-on');
      pricing_monthly.classList.remove('switch-off');
      pricing_annual.classList.add('switch-off');
      pricing_annual.classList.remove('switch-on');
    }
    else {
      pricing_annual.classList.add('switch-on');
      pricing_annual.classList.remove('switch-off');
      pricing_monthly.classList.add('switch-off');
      pricing_monthly.classList.remove('switch-on');
    }
  }

  function scale(x) {

  }

  function monthly_price(users) {
    return users * MONTHLY_COST - FREE_USERS * MONTHLY_COST;
  }

  function annual_price(users) {
    return users * ANNUAL_COST - FREE_USERS * ANNUAL_COST;
  }

  window.addEventListener('resize', onResize);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('touchmove', onMouseMove);
  pricing_knob.addEventListener('mousedown', onKnobMouseDown);
  pricing_knob.addEventListener('touchstart', onKnobMouseDown);
  document.addEventListener('mouseup', onKnobMouseUp);
  document.addEventListener('touchend', onKnobMouseUp);

  pricing_monthly.addEventListener('click', onMonthlyClick);
  pricing_annual.addEventListener('click', onAnnualClick);

  onSliderValueChange(0);
  updateMonthlyToggle(monthly_pricing);
}




document.addEventListener('DOMContentLoaded', setUpCalculator);

// based on
// http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
// use href="#anchorID" in your hyperlinks
// with smoothScroll('destinationAnchorID');return false; as the onclick event.
// <a href="#anchorID" onclick="smoothScroll('anchorID');">smooth scroll to Anchor 1<a/>

function currentYPosition() {
    // Firefox, Chrome, Opera, Safari
    if (self.pageYOffset) return self.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}


function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}


window.smoothScroll = function(eID) {
    var startY = currentYPosition();
    var stopY = elmYPosition(eID) - 50;
    var distance = (stopY > startY ? stopY - startY : startY - stopY);
    if (distance < 100) {
        scrollTo(0, stopY); return;
    }
    var speed = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for ( var i=startY; i<stopY; i+=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY += step; if (leapY > stopY) leapY = stopY; timer++;
        } return;
    }
    for ( var i=startY; i>stopY; i-=step ) {
        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
        leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
    }
  return false;
}
