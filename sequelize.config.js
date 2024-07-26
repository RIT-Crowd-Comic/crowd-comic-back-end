const dotenv = require('dotenv'); // eslint-disable-line @typescript-eslint/no-var-requires
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

// probably temporary
if (process.env.NODE_ENV !== 'development') {
    console.log('If you are working on a local environment, migrations will likely not work for the live database');
    console.log('If you intend on working with the live database, it is better to use the server-side CLI');
}

/*
Alternatively, you can do something like this

npx sequelize-cli db:migrate --url 'postgres://root:password@host.com/database_name'
*/
module.exports = {
    development: parseDBString(process.env.DATABASE_URL),
    production:  parseDBString(process.env.DATABASE_URL)
};
