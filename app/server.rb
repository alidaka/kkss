require 'sinatra'
require 'haml'

get '/' do
	haml :index, :layout => false
end

get '/generate' do
  @title = 'Generate Lock Codes';
  haml :generate
end

get '/reconstruct' do
  @title = 'Decode The Secret';
  haml :reconstruct
end

get '/message' do
  @title = 'encrypt message';
  haml :encryptMessage
end

post '/message' do
end
