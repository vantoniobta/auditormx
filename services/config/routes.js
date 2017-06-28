/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:9991/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 */
module.exports = {
	 '/users/index' : {
		controller:'users',
         action:'save',
         method: 'post'
	}, 
	'/users/add' : {
		controller:'users',
         action:'add',
         method: 'post'
	},
	'/users/delete' : {
		controller:'users',
         action:'delete',
         method: 'post'
	},
	'/users/update' : {
		controller:'users',
         action:'update',
         method: 'post'
	}
}