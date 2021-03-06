class CoursesController < ApplicationController
  layout 'functionalitylayout'
  before_action :set_course, only: [:show, :edit, :update, :destroy]
  # GET /courses
  # GET /courses.json
  def index
    @courses = Course.all

  end
      
  def getcourse
    @currentuser = User.find_by_id(session[:user_id])
    
    Course.destroy_all(:choice => @currentuser.id)

    
    @name = params[:param1]
    if @currentuser.classification == 'Student'
    @currentuser.update_attribute(:flag , 'submitted')
    end
    #consider adding else for setting flag to false, indicating advisor/admin made change to allow re-registration?

    
    @allcourses = Courselist.all
    if @name != nil
    @allcourses.each do |all|
      @name.each do |c|
        if all.name == c
          @student = Course.create(name: all.name, prereq: all.prereq, hours: all.hours, choice: @currentuser.id)
        end
      end
    end #end of allcourses loop
    end #end if

    respond_to do |format|

      format.html { redirect_to courses_path(@currentuser.id) }
      format.mobile{ redirect_to courses_path(@currentuser.id) }
      format.json { render :json => { :name => @name }}

    end #end of format
  end #end of method

  # GET /courses/1
  # GET /courses/1.json
  def show
    
  end

  # GET /courses/new
  def new
    @course = Course.new
  end

  # GET /courses/1/edit
  def edit
  end

  # POST /courses
  # POST /courses.json
  def create
    @course = Course.new(course_params)
    @currentuser = User.find_by_id(session[:user_id])
    if @currentuser.classification == "Student"
    @course.studentid = @currentuser.id
    end

    respond_to do |format|
      if @course.save
        format.html { redirect_to student_path }
        format.mobile{ redirect_to student_path }
        format.json { render action: 'show', status: :created, location: @course }
      else
        format.html { render action: 'new' }
        format.mobile { render action: 'new' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /courses/1
  # PATCH/PUT /courses/1.json
  def update
    respond_to do |format|
      if @course.update(course_params)
        format.html { redirect_to @course }
        format.mobile { redirect_to @course }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.mobile { render action: 'edit' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /courses/1
  # DELETE /courses/1.json
  def destroy
    @course.destroy
    respond_to do |format|
      format.html { redirect_to courses_url }
      format.mobile { redirect_to courses_url }
      format.json { head :no_content }
    end
  end
  


  private

  # Use callbacks to share common setup or constraints between actions.
  def set_course
    @course = Course.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def course_params
    #params.require(:course).permit(:name, :hours, :prereq)
  end
end
