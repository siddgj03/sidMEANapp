const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

/*Locations Page*/
router.get('/',ctrlLocations.homeList);
router.get('/location',ctrlLocations.locationInfo);
router.get('/location/review/new',ctrlLocations.addReview);

/*Other page*/
router.get('/about',ctrlOthers.about);

module.exports = router;
