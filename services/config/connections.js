/**
 * Connections
 * (tenant.config.connections)
 *
 * `Connections` are like "saved settings" for your adapters.  What's the difference between
 * a connection and an adapter, you might ask?  An adapter (e.g. `mysql`) is generic--
 * it needs some additional information to work (e.g. your database host, password, user, etc.)
 * A `connection` is that additional information.
 *
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 * .
 */

module.exports = {
  default: 'mongo',
  mysql:{
  	adapter:'mysql',
    host: '10.6.12.224',
    user:'auditor',
    password:'iclicmx01+'
  },
  mongo:{
  	adapter:'mongo',
    host: '166.78.155.121',
    port: '27017'
  }
};
