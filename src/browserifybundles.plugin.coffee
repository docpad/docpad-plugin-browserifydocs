# Export Plugin
module.exports = (BasePlugin) ->
	# Import
	pathUtil = require('path')

	# Define Plugin
	class BrowserifybundlesPlugin extends BasePlugin
		# Plugin name
		name: 'browserifybundles'

		# Plugin config
		config:
			bundles: []
			browserifyPath: pathUtil.resolve(__dirname, '..', 'node_modules', '.bin', 'browserify')

		# Write After
		# Used to bundle the editor
		writeAfter: (opts,next) ->
			# Prepare
			config = @getConfig()
			{rootPath, outPath} = @docpad.getConfig()

			# Bundle the scripts the editor uses together
			commands = for bundle in config.bundles
				command = []

				# Executable
				command.push(config.browserifyPath)

				# Entry
				command.push(pathUtil.resolve(outPath, bundle.entry))

				# Requires
				if bundle.require
					if Array.isArray(bundle.require)
						for r in bundle.require
							command.push('-r', pathUtil.resolve(outPath, bundle.r))
					else
						command.push('-r', pathUtil.resolve(outPath, bundle.require))

				# Ignores
				if bundle.ignore
					if Array.isArray(bundle.ignore)
						for i in bundle.ignore
							command.push('-i', i)
					else
						command.push('-i', bundle.ignore)

				# Out
				command.push('-o', pathUtil.resolve(outPath, bundle.out))

				# Arguments
				command.push(bundle.arguments...)  if bundle.arguments? and Array.isArray(bundle.arguments)

				# Return command in our for loop
				command

			# Execute
			require('safeps').spawnMultiple(commands, {cwd:rootPath, stdio:'inherit'}, next)

			# Chain
			@
