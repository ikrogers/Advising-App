class SessionsController < ApplicationController
<<<<<<< HEAD
  def new
=======
  skip_before_action :authorize
  def new
    if User.find_by(id: session[:user_id])
      case User.find_by(id: session[:user_id]).classification
      when "Admin"
        redirect_to admin_url
      when "Advisor"
        redirect_to advisor_url
      else
        redirect_to student_url
      end
    end
>>>>>>> dc3f9b068e5c1c3978f12d263fc052f6f9a169f8
  end

  def create
    user = User.find_by(name: params[:name])
    if user and user.authenticate(params[:password])
      session[:user_id] = user.id
      case user.classification
      when "Admin"
        redirect_to admin_url
      when "Advisor"
        redirect_to advisor_url
      else
        redirect_to student_url
      end
    else
      redirect_to login_url, alert: "Invalid user/password combination"
    end
   end

  def destroy
    session[:user_id] = nil
 redirect_to advising_url, notice: "Logged out"
  end
end
