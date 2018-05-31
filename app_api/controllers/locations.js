const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const locationsCreate = function (req, res) {
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    openingTimes: [{
      days: req.body.days1,
      opening: req.body.opening1,
      closing: req.body.closing1,
      closed: req.body.closed1,
    }, {
      days: req.body.days2,
      opening: req.body.opening2,
      closing: req.body.closing2,
      closed: req.body.closed2,
    }]
  }, (err, location) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(201)
        .json(location);
    }
  });
};

const locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec((err, location) => {
        if (!location) {
          res
            .status(404)
            .json({
              "message": "locationid not found"
            });
            return;
        } else if (err) {
          res
            .status(400)
            .json(err);
          return;
        }
        res
          .status(200)
          .json(location);
      });
  } else {
      res
        .status(404)
        .json({
          "message": "No locationid in request"
        });
  }
};

const locationsUpdateOne = function (req, res) {
  if (!req.params.locationid) {
    res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec((err, location) => {
      if (!location) {
        res
          .json(404)
          .status({
            "message": "locationid not found"
          });
        return;
      } else if (err) {
        res
          .status(400)
          .json(err);
        return;
      }
      location.name = req.body.name;
      location.address = req.body.address;
      location.facilities = req.body.facilities.split(',');
      location.coords = [
        parseFloat(req.body.lng),
        parseFloat(req.body.lat)
      ];
      location.openingTimes = [{
        days: req.body.days1,
        opening: req.body.opening1,
        closing: req.body.closing1,
        closed: req.body.closed1,
      }, {
        days: req.body.days2,
        opening: req.body.opening2,
        closing: req.body.closing2,
        closed: req.body.closed2,
      }];
      location.save((err, location) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(location);
        }
      });
    }
  );
};

const locationsDeleteOne = function (req, res) {
  const locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec((err, location) => {
        if (err) {
          res
            .status(404)
            .json(err);
          return;
        }
        res
          .status(204)
          .json(null);
      });
  } else {
    res
      .status(404)
      .json({
        "message": "No locationid"
      });
  }
};

const locationsListByDistance = function (req, res) {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance)
  const point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  if ((!lng && lng !== 0) || (!lat && lat !== 0))  {
    res
      .status(404)
      .json({
        "message": "lng and lat query parameters are required"
      });
    return;
  }

  Loc.aggregate(
        [
            {
                '$geoNear': {
                    near: point,
                    spherical: true,
                    distanceField: 'dist.calculated',
                    maxDistance: maxDistance,
                    num: 10
                }
            }
        ],
        function(err, results) {
          let locations = [];
          if(err) {
            res
              .status(404)
              .json(err)
          } else {
            results.forEach((doc) => {
              locations.push({
                distance: (doc.dist.calculated),
                name: doc.name,
                address: doc.address,
                rating: doc.rating,
                facilities: doc.facilities,
                _id: doc._id
              });
            });
            res
              .status(200)
              .json(locations);
          }
        });
};
  /*
  Loc.geoNear(point, geoOptions, (err, results, stats) => {
    let locations = [];
    results.forEach((doc) => {
      locations.push({
        distance: (doc.dis),
        name: doc.obj.name,
        address: doc.obj.address,
        rating: doc.obj.rating,
        facilities: doc.obj.facilities,
        _id: doc.obj._id
      });
    });
    res
      .status(200)
      .json(locations);
  });*/


module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};
