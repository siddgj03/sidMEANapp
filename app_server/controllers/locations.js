/*GET Home page*/
const homeList = function(req, res){
  res.render('locations-list', { title: 'Home' });
};

/*GET locations info page*/
const locationInfo = function(req, res){
  res.render('location-info', { title: 'Location Info' });
};

/*GET add Review page*/
const addReview = function(req, res){
  res.render('location-review-form', { title: 'Add review' });
};

module.exports = {
  homeList,
  locationInfo,
  addReview
};
