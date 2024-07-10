import express from 'express';

const processLogin = (req: express.Request, res: express.Response) => {
    if(req.body.username !== 'admin' || req.body.password !== 'admin') {
        return res.send('Invalid username or password');
    }

    req.session.userId = req.body.username;

    res.redirect('/');
};

export {processLogin};