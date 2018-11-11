Each subdirectory here is a different [Serverless](https://serverless.com) custom template. Each includes a lot of boilerplate code and configuration, including CircleCI configuration, eslint configuration, a basic serverless.yml file, etc. They call these templates, but there's no templating actually happening here. It's just a file copy, as far as I can tell.

To use these, you should clone this repository to your local filesystem. Then, use this shell command: `cp -r <file path of the template> <output directory for your new service`. You may find this task a little easier if you create an environment variable for the template parent directory.

If someone can figure out a way to download these files from GitHub directly, that would be even better.
