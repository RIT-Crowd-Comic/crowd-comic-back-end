const dotenv = require('dotenv');
dotenv.config();

/**
 * 
 * @param {string} dbstr prototcol://username:password@host:port/db
 * @returns 
 */
const parseDBString = dbstr => {
    let remainder = dbstr.slice(dbstr.indexOf('//') + 2);
    let delimIndex = remainder.indexOf(':');
    const username = remainder.slice(0, delimIndex);
    remainder = remainder.slice(delimIndex + 1);
    delimIndex = remainder.indexOf('@');
    const password = remainder.slice(0, delimIndex);
    remainder = remainder.slice(delimIndex + 1);
    delimIndex = remainder.indexOf(':');
    const host = remainder.slice(0, delimIndex);
    remainder = remainder.slice(delimIndex + 1);
    delimIndex = remainder.indexOf('/');
    const port = remainder.slice(0, delimIndex);
    remainder = remainder.slice(delimIndex + 1);
    const database = remainder;
    return {
        username, password, host, port, database, dialect: 'postgres'
    };
};

console.log(parseDBString(process.env.DATABASE_URL));


/*
Alternatively, you can do something like this

npx sequelize-cli db:migrate --url 'postgres://root:password@host.com/database_name'
*/
module.exports = {
    development: parseDBString(process.env.DATABASE_URL),
    production:  {
        username: 'username',
        password: 'password',
        database: 'db',
        host:     'localhost',
        dialect:  'postgres',
        port:     '5432',
    }
};
