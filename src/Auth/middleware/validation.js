import passport from "passport";

export const localStrategyAuth = (req, res, next) => {
  const authRequest = passport.authenticate("local", (err, token) => {
    if (token) {
      req.token = token;
      return next();
    } else {
      res.status(401).json({ erro: "Acesso negado." });
    }
  });

  authRequest(req, res, next);
};
