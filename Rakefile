require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

task :default => [:test]

task :set_jasmine_config do
  ENV['JASMINE_CONFIG_PATH'] = 'spec/client/jasmine.yml'
end

task 'jasmine:configure' => [:set_jasmine_config]

task :test => ['jasmine:ci']

task :run do
  ruby 'app/server.rb'
end
