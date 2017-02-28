require 'jasmine'
load 'jasmine/tasks/jasmine.rake'

task :default => [:test]

task :test do
  Rake::Task["jasmine:ci"].invoke
end

task :run do
  ruby 'app/server.rb'
end
