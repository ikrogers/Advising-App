class AdminController < ApplicationController
  def index
<<<<<<< HEAD
=======
    if User.find_by(id: session[:user_id]).classification != 'Admin'
      redirect_to login_path, notice: "You must be logged in as an admin"
    end
>>>>>>> chris
  end
end
