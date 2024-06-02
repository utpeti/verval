// authorization middleware ami a felhasznalo jogosultsagat vizsgalja
export function authorize(roles = ['student', 'teacher']) {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      res.status(403).render('error', { message: 'Forbidden operation', user: req.session.user });
    } else {
      next();
    }
  };
}
