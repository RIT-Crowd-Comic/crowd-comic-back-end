import express from 'express';

const loginHandler = (req: express.Request, res: express.Response) => {
    if(req.session.userId) return res.redirect('/');

    res.setHeader('Content-Type', 'text/HTML');
    res.write(`
        <h1>Login</h1>
        <form method="post" action="/process-login">
        <input type="text" name="username" placeholder="Username" /> <br>
        <input type="password" name="password" placeholder="Password" /> <br>
        <button type="submit">Login</button>
    </form>
    `);

    res.end();
};

export {loginHandler};