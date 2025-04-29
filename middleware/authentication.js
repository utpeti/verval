import express from 'express';

const router = express.Router();

// router middleware hogy csak a bejelentkezett userek erjenek el bizonyos endpointokat
router.get('/*', (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).render('login', { error: 'You have to log in first!' });
  }
});

export default router
