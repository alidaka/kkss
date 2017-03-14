begin # test dependencies don't exist in production
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'

  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)

  task :default => [:test]

  task :set_jasmine_config do
    ENV['JASMINE_CONFIG_PATH'] = 'spec/client/jasmine.yml'
  end

  task 'jasmine:configure' => [:set_jasmine_config]

  task :test => ['jasmine:ci', 'spec']
rescue LoadError
end

task :run do
  ruby 'app/server.rb'
end
