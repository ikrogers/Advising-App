class AdvisorController < ApplicationController
  def index
<<<<<<< HEAD
=======
    if User.find_by(id: session[:user_id]).classification == 'Student'
      redirect_to login_path, notice: "You must be logged in as an advisor"
    end
>>>>>>> dc3f9b068e5c1c3978f12d263fc052f6f9a169f8
  end
end
