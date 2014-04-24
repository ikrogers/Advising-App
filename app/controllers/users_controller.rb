class UsersController < ApplicationController
  layout 'functionalitylayout'
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  respond_to :json
  # GET /users
  # GET /users.json
  def index
    @users = User.all
  end

  # GET /users/1
  # GET /users/1.json
  def show
      @users = User.all
  end

  # GET /users/new
  def new
    @user = User.new
    @user.classification = "Student"
  end

  # GET /users/1/edit
  def edit
        @users = User.all
  end
  
  def setAppt
    @currentuser = User.find_by_id(session[:user_id])
    
    
    @appts = params[:param1]
    @appte = params[:param2]
    
    if(Appointment.count(@currentuser.id) < 1)
      Appointment.create(appts: params[:param1], appte: params[:param2], stuID: @currentuser.id, advID: User.find_by_name(@currentuser.advisor).id, approved: 'pending' )
      @appt.save
      respond_to do |format|
        format.html { redirect_to courses_path(@currentuser.id), notice: 'Appointment set!' }
        format.json { render :json => { :name => @name }}
      end
    else
      @appt = Appointment.find_by_userID(@currentuser.id)
      @appt.update_attribute(:appts,@appts)
      @appt.update_attribute(:appte,@appte)
      @appt.update_attribute(:approved,'pending')
      @appt.save
      respond_to do |format|
        format.html { redirect_to courses_path(@currentuser.id), notice: 'Appointment updated!' }
        format.json { render :json => { :name => @name }}
      end
    end
  end
  
  def liftFlag
    @currentuser = User.find_by_id(session[:user_id])
    @user = User.find_by_id(params[:id])
    @user.flag = 'advised'
    
    #if @user.save
    #  respond_with(@currentuser, :location => users_url);
    #end
    
      if @user.save
        redirect_to users_url
        
      end
    
  end

  def denyFlag
    @currentuser = User.find_by_id(session[:user_id])
    @user = User.find_by_id(params[:id])
    @user.flag = 'denied'
    
    #if @user.save
    #  respond_with(@currentuser, :location => users_url);
    #end
    
      if @user.save
        redirect_to users_url
        
      end
    
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)
    @currentuser = User.find_by_id(session[:user_id])
    if @currentuser.classification == "Advisor"
      @user.classification = "Student"
      @user.advisor = @currentuser.name
      @user.flag = "false"
    end
    respond_to do |format|
      if @user.save
        format.html { redirect_to users_url, notice: "User #{@user.name} was successfully created." }
        format.json { render action: 'show', status: :created, location: @user }
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to users_url,notice: "User #{@user.name} was successfully updated." }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def user_params

    params.require(:user).permit(:name, :classification, :password, :password_confirmation, :fname, :mi, :lname)
  end
end
