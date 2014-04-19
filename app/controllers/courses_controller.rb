class CoursesController < ApplicationController
  layout 'menu'
  before_action :set_course, only: [:show, :edit, :update, :destroy]
  # GET /courses
  # GET /courses.json
  def index
    @courses = Course.all

  end
      
  def contactf
    @currentuser = User.find_by_id(session[:user_id])
    @message = params[:message]
    @appte  = params[:endtime]
    @appts = params[:starttime]
    
    @currentuser.update_attribute(:message, @message)
    
    @currentuser.update_attribute(:appts, @appts)
    @currentuser.update_attribute(:appte, @appte)
     respond_to do |format|
      flash[:notice] = "kashgdkashgdlfashgflkasdf"

      format.html { redirect_to courses_path(@currentuser.id), notice: "Appointment information has been submitted successfully"}
      format.json { render :json => { :redirect => courses_url(@currentuser.id),:message => @message, :starttime => @appts, :endtime => @appte }, notice: "Appointment information has been submitted successfully"}

    end #end of format
    
  end
#sets the appointment time
  def setAppt
    @currentuser = User.find_by_id(session[:user_id])
    @appts = params[:param1]
    @appte = params[:param2]
    
    @currentuser.update_attribute(:appts, @appts)
    @currentuser.update_attribute(:appte, @appte)
    respond_to do |format|

      format.html { redirect_to courses_path(@currentuser.id), notice: "Appointment set!" }
      format.json { render :json => { :name => @name }}
    end
  end

  def getcourse
    @currentuser = User.find_by_id(session[:user_id])
    
    
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

      format.html { redirect_to courses_path(@currentuser.id), notice: "Courses updated" }
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
        format.html { redirect_to @course, notice: 'Course was successfully created.' }
        format.json { render action: 'show', status: :created, location: @course }
      else
        format.html { render action: 'new' }
        format.json { render json: @course.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /courses/1
  # PATCH/PUT /courses/1.json
  def update
    respond_to do |format|
      if @course.update(course_params)
        format.html { redirect_to @course, notice: 'Course was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
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
      format.json { head :no_content }
    end
  end
  
  def testajaxjs
    respond_to do |format|
      format.json
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
