class AdminController < ApplicationController
  layout 'menu'
  def index
  end
  
  def regstudent
    @courses = Course.where('choice is NOT NULL')
    @courses.each do |course|
      course.update_attributes({ :studentid => course.choice, :choice => nil})
    end
    respond_to do |format|
      format.html { redirect_to admin_path, notice: 'Students registered!' }
    end
  end
end
