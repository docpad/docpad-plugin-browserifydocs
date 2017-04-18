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
			docpad = @docpad

			# Create the task group to handle multiple Browserify files.
			tasks = new TaskGroup('browserify docs tasks', {concurrency:0, next})

			# Create a new task for each Browserify files.
			opts.collection.findAll({browserify: $exists: true}).each (file) ->
				# Skip the file when the option is explicitly false
				browserifyOpts = file.get('browserify')
				return  if browserifyOpts is false

				# Prepare
				filePath = file.getFilePath()
				output = null

				# Start
				tasks.addGroup filePath, (addGroup, addTask) ->
					# Build the Browserify options.
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
					addTask 'compile', (complete) ->
						docpad.log('debug', "Browserifing: #{filePath}")
						b.bundle browserifyOpts, (err, _output) ->
							if err
								err.message = "Browserify failed on: #{filePath}\n"+err.message
								return complete(err)
							output = _output
							return complete()

					addTask 'apply', (complete) ->
						# Update the out content for the document
						file.set({
							contentRendered: output
							contentRenderedWithoutLayouts: output
						})

						# Update the out content for the file
						file.action 'write', (err) ->
							return complete(err)  if err
							docpad.log('info', "Browserified: #{filePath}")
							return complete()

			# Execute all of the created tasks.
			tasks.run()

			# Chain
			@
