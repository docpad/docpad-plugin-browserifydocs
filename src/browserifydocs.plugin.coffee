# Export Plugin
module.exports = (BasePlugin) ->
	# Define Plugin
	class BrowserifydocsPlugin extends BasePlugin
		# Plugin name
		name: 'browserifydocs'

		# Configuration
		config:
			# When true, will add a source map inline to the end of the bundle.
			debug: false

		# Write After
		writeAfter: (opts, next) ->
			# Import
			pathUtil = require('path')
			browserify = require('browserify')
			safefs = require('safefs')
			{TaskGroup} = require('taskgroup')

			# Prepare
			plugin = @

			# Create the task group to handle multiple Browserify files.
			tasks = new TaskGroup({concurrency:0, next})

			# Create a new task for each Browserify files.
			opts.collection.findAll({browserify: $exists: true}).each (file) ->
				# Skip the file when the option is explicitly false.
				return  if file.get('browserify') is false

				tasks.addTask (complete) ->
					# Build the Browserify options.
					browserifyOpts = file.get('browserify')
					browserifyOpts = {}  if typeof browserifyOpts is 'boolean'
					browserifyOpts.basedir = pathUtil.join(file.attributes.outDirPath, file.attributes.relativeOutDirPath)

					# Provide the default configuration options if needed.
					for own key, value of plugin.getConfig()
						browserifyOpts[key] = value  if not browserifyOpts[key]?

					# Build the Browserify object.
					b = browserify(file.attributes.outPath)

					# Handle the require option.
					if browserifyOpts.require?
						for requireFile, requireOptions of browserifyOpts.require
							requireOptions = {}  if typeof requireOptions is 'boolean'
							requireOptions.basedir = browserifyOpts.basedir
							b.require(requireFile, requireOptions)

					# Handle the parameters which take single arrays.
					for option in ['ignore', 'external', 'exclude']
						if browserifyOpts[option]?
							for entry, i in browserifyOpts[option]
								b[option](entry)

					# Compile with Browserify.
					try
						b.bundle browserifyOpts, (err, output) ->
							return complete(err) if err

							# Update the out content for the document
							file.set({
								contentRendered: output
								contentRenderedWithoutLayouts: output
							})

							# Update the out content for the file
							file.action('write', complete)

					catch err
						return complete(err)

			# Execute all of the created tasks.
			tasks.run()

			# Chain
			@
