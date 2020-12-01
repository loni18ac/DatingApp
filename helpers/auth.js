module.exports = {
    requireLogin: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }else{
            res.redirect('/myAccount');
        }
    },
    ensureGuest: (req,res,next) => {
        if (req.isAuthenticated()) {
            res.redirect('/myAccount');
        }else {
            return next();
        }
    }
}