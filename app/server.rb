require 'sinatra'
require 'haml'

get '/' do
  @title = 'generation';
  haml :generate
end

get '/reconstruct' do
  @title = 'reconstruction';
  haml :reconstruct
end
