class AdvisorController < ApplicationController
  def index
<<<<<<< HEAD
=======
    if User.find_by(id: session[:user_id]).classification == 'Student'
      redirect_to login_path, notice: "You must be logged in as an advisor"
    end
>>>>>>> chris
  end
end
