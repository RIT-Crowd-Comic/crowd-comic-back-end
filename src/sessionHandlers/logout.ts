import express from 'express';

const logout = (req: express.Request, res: express.Response) => {
    req.session.destroy(() => res.redirect('/'));
};

export {logout};