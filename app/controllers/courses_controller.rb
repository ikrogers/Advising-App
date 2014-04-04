class CoursesController < ApplicationController
  before_action :set_course, only: [:show, :edit, :update, :destroy]
  # GET /courses
  # GET /courses.json
  def index
    @courses = Course.all

  end

  def getcourse
    @currentuser = User.find_by_id(session[:user_id])
    
    
    @name = params[:param1]
          if @currentuser.flag == "false"

        @currentuser.update_attributes(:flag => "true")

    @allcourses = Courselist.all
    @allcourses.each do |all|
      @name.each do |c|
        if all.name == c
          @student = Course.create(name: all.name, prereq: all.prereq, hours: 4, choice: @currentuser.id)
        end
      end
    end #end of allcourses loop
    flash[:notice] = "You choices have been submitted"

    respond_to do |format|

      format.html { redirect_to @student, notice: "You choices have been submitted" }
      format.json { render :json => { :name => "class "+@name }}

    end #end of format
    end #end of flag if
    
    respond_to do |format|

      format.html { redirect_to student_index_path, notice: "You have already submitted, please wait for your advisors response" }
      format.json { render :json => { :name => "class "+@name }}

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
