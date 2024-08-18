import passport from "passport";

export const jwtStrategyAuth = (req, res, next) => {
  const authRequest = passport.authenticate("jwt", (err, user) => {
    if (user) {
      req.user = user;
      return next();
    } else {
      res
        .status(401)
        .json({ mensagem: "Acesso negado. Talvez você não esteja logado." });
    }
  });

  authRequest(req, res, next);
};
