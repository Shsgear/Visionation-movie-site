module.exports = function(grunt) {

	//项目配置
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/javascripts/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				script: './bin/www',
				options: {
					args: [],
					nodeArgs: ['--debug'],
					env: {
						PORT: 3000
					},
					cwd: __dirname,
					ignore: ['node_modules/**', 'README.md'],
					ext: '',
					watch: ['./'],
					delay: 1000,
				}
			}
		},

		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}

	});
	//防止因为语法错误或其他警告而中断grunt整个任务
	grunt.option('force', true);

	//加载包含'watch'任务的插件,监听文件添加修改删除，重新执行注册好的任务
	grunt.loadNpmTasks('grunt-contrib-watch');
	//加载包含'nodemon'任务的插件,实时监听入口文件，实现自动重启
	grunt.loadNpmTasks('grunt-nodemon');
	//加载包含'concurrent'任务的插件,优化慢任务的构建时间，比如sass,less，并发执行多个阻塞的任务,比如nodemon和watch
	grunt.loadNpmTasks('grunt-concurrent');

	//默认被执行的任务列表
	grunt.registerTask('default', ['concurrent']);
}