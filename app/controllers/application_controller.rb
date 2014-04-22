class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_filter :store_path
  protect_from_forgery with: :exception
  

  def store_path
    # Set "last_path" to the "current_path" set by the previous request
    session[:last_path] = session[:current_path] || root_path
    # And then update the current_path to the uri for the current request
    session[:current_path] = request.url
  end
end
