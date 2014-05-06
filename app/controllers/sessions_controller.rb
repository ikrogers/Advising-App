class SessionsController < ApplicationController
  skip_before_action :authorize
   layout 'front'
  def new
    user = User.find_by_id(session[:user_id])
    if user != nil
    case user.classification
    when "Admin"
      redirect_to admin_url
    when "Advisor"
      redirect_to advisor_url
    when "Student"
      redirect_to student_url
    end
    end
  end

def post
  @post = Post.new
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
      redirect_to login_url
    end
   end

  def destroy
    session[:user_id] = nil
    redirect_to advising_url
  end
end
