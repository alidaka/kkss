require 'sinatra'
require 'haml'

get '/' do
  haml :index
end

get '/reconstruct' do
  haml :reconstruct
end
