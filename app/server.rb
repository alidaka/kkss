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

get '/message' do
  @title = 'encrypt message';
  haml :encryptMessage
end

post '/message' do
end
