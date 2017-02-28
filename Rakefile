require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

task :default => [:test]

task :test do
  ENV['JASMINE_CONFIG_PATH'] = 'spec/client/jasmine.yml'
  Rake::Task['jasmine:ci'].invoke
end

task :run do
  ruby 'app/server.rb'
end
