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
			# When true, will add a source map inline to the end of the bundle.
			debug: false

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

					# Provide the default configuration options if needed.
					for own key, value of @getConfig()
						browserifyOpts[key] = value if not browserifyOpts[key]?

					# Build the Browserify object.
					b = @browserify(file.attributes.outPath)

					# Handle the require option.
					if browserifyOpts.require?
						for requireFile, requireOptions of browserifyOpts.require
							requireOptions = {} if typeof requireOptions is 'boolean'
							requireOptions.basedir = browserifyOpts.basedir
							b.require requireFile, requireOptions

					# Handle the parameters which take single arrays.
					for option in ['ignore', 'external', 'exclude']
						if browserifyOpts[option]?
							for entry, i in browserifyOpts[option]
								b[option] entry

					# Compile with Browserify.
					try
						b.bundle browserifyOpts, (err, output) =>
							return complete(err) if err
							# Overwrite the file with the new Browserify-ed version.
							@safefs.writeFile file.attributes.outPath, output,  (err) ->
								return complete(err) if err
								return complete()
					catch err
						return complete(err)

			# Execute all of the created tasks.
			tasks.run()

			# Chain
			@
