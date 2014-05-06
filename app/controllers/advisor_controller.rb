class AdvisorController < ApplicationController
  layout 'menu'
  def index
    user = User.find_by_id(session[:user_id])
    if user != nil
    case user.classification
    when "Admin"
      redirect_to admin_url
    when "Student"
      redirect_to student_url
    end
    end
  end
end
