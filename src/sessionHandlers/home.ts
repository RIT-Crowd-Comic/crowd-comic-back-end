import express from "express"

const homeHandler = (req: express.Request, res: express.Response) => {
    if(!req.session.userId) return res.redirect('/login');

    res.setHeader('Content-Type', 'text/HTML');
    res.write(`
        <h1>Welcome back ${req.session.userId}</h1>
        <a href="/logout">Logout</a>
        `);

    res.end();
};

export {homeHandler}