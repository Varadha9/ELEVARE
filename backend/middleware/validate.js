// Import validationResult — collects all errors from express-validator rules
// defined in the route file (e.g. body('email').isEmail())
import { validationResult } from 'express-validator';

// validate — middleware that runs AFTER express-validator checks
// If any validation rule failed, it returns a 400 with the error list
// If all rules pass, it calls next() to proceed to the controller
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return all validation errors so the client knows exactly what to fix
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
