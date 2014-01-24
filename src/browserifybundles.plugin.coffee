# Export Plugin
module.exports = (BasePlugin) ->
	# Define Plugin
	class BrowserifybundlesPlugin extends BasePlugin

		# Plugin name
		name: 'browserifybundles'

		# Constructor
		# Retrieves dependencies.
		constructor: () ->
			super

			@browserify = require 'browserify'
			@path = require 'path'
			@safefs = require 'safefs'
			@taskgroup = require 'taskgroup'

			@

		# Configuration
		config:
			browserify: true

		# Write After
		writeAfter: (opts, next) ->
			# Create the task group to handle multiple Browserify files.
			tasks = new @taskgroup.TaskGroup
				concurrency: 0

			# Set up the next callback.
			tasks.once 'complete', (err) ->
				return next(err) if err
				next()

			# Create a new task for each Browserify files.
			opts.collection.findAll({browserify: $exists: true}).each (file) =>
				# Skip the file when the option is explicitly false.
				return if file.get('browserify') is false

				tasks.addTask (complete) =>
					# Build the Browserify options.
					browserifyOpts = file.get('browserify')
					browserifyOpts = {} if typeof browserifyOpts is 'boolean'
					browserifyOpts.basedir = @path.join file.attributes.outDirPath, file.attributes.relativeOutDirPath

					# Compile with Browserify.
					b = @browserify(file.attributes.outPath)
					b.bundle browserifyOpts, (err, output) =>
						return complete(err) if err
						# Overwrite the file with the new Browserify-ed version.
						@safefs.writeFile file.attributes.outPath, output,  (err) ->
							return complete(err) if err
							return complete()

			# Execute all of the created tasks.
			tasks.run()

			# Chain
			@
