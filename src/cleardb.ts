
import { sequelize, setup } from './database';

/**
 * Clear all database entries
 */
(async () => {
    setup();
    await sequelize.sync({ force: true });
})();
