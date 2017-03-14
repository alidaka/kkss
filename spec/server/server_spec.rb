require File.expand_path '../spec_helper.rb', __FILE__
require './app/server'

RSpec.describe 'Server' do
  context 'saving a message' do
    it 'exposes a POST route' do
      post '/message'
      expect(last_response).to be_ok
    end
  end
end
