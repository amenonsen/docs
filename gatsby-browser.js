require('prismjs/themes/prism-okaidia.css');

exports.onRouteUpdate = ({ location }) => scrollToAnchor(location);

/**
 *
 * @desc - a function to jump to the correct scroll position
 * @param {Object} location -
 * @param {Number} [mainNavHeight] - the height of any persistent nav -> document.querySelector(`nav`)
 */
function scrollToAnchor(location, mainNavHeight = 0) {
  // Check for location so build does not fail
  if (location && location.hash) {
    const item = document.querySelector(`${location.hash}`);

    if (item) {
      window.scrollTo({
        top: item.offsetTop - mainNavHeight,
        behavior: 'smooth',
      });
    }
  }

  return true;
}
