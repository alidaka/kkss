require 'sinatra'
require 'haml'

get '/' do
  @title = 'generation';
  haml :index
end

get '/reconstruct' do
  @title = 'reconstruction';
  haml :reconstruct
end
