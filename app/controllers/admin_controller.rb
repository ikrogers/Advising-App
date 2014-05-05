class AdminController < ApplicationController
  layout 'menu'
  def index
  end
  
  def regstudent
    @courses = Course.where('choice is NOT NULL')
    @courses.each do |course|
      @user = User.find_by_id(course.choice)
      if @user.flag == 'advised'
        course.update_attributes({ :studentid => course.choice, :choice => nil})
      else
        course.delete
      end
    end
    @users = User.where('flag != ?', 'false')
    @users.each do |user|
        user.update_attributes({ :flag => 'false' })
    end
    respond_to do |format|
      format.html { redirect_to admin_path }
      format.mobile { redirect_to admin_path }
    end
  end
end
