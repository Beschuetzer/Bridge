const express = require('express'),
      router = express.Router({mergeParams: true}),	//mergeParams allow req.params to work properly
      User = require('../models/user'),
      middleware = require('../middleware');
      constants = require('../helpers/constants');
      defaultColorTheme = 'darkBlue',
      controller = require('../controllers/play');

router.get('/start', middleware.isLoggedIn, controller.start);
router.get('/lobby', middleware.isLoggedIn, controller.lobby);
router.get('/bid', middleware.isLoggedIn, controller.bid);
router.get('/stats', middleware.isLoggedIn, controller.stats)

module.exports = router;
