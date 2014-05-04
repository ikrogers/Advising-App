class AppointmentsController < ApplicationController
  layout 'functionalitylayout'
  before_action :set_appointment, only: [:show, :edit, :update, :destroy]
  
  # GET /appointments
  # GET /appointments.json
  def index
    @currentuser = User.find_by_id(session[:user_id])
    
    if (@currentuser.classification == 'Advisor' )
      @appointments = Appointment.where("advID = ?",@currentuser.id)
      #@appointments = Appointment.find_by_advID(@currentuser.id)
    elsif (@currentuser.classification == 'Student')
      @appointments = Appointment.where("stuID = ?",@currentuser.id)
      #@appointments = Appointment.find_by_stuID(@currentuser.id)
    else#for the admin
      @appointments = Appointment.all
    end
  end
  
  

  def approve
    @appointment = Appointment.find_by_id(params[:id])
    @appointment.update_attribute(:approved, 'approved')
    if(@appointment.save)
        redirect_to :back
      
    else
        redirect_to appointment_path 
      
    end
  end
  
  def deny
    @appointment = Appointment.find_by_id(params[:id])
    @appointment.update_attribute(:approved, 'denied')
    if(@appointment.save)
        redirect_to :back
      
    else
        redirect_to appointment_path
      
    end
  end
  
  def schdappt
    @currentuser = User.find_by_id(session[:user_id])
    @appointment = Appointment.find_by_id(params[:id])
    @appointment.update_attribute(:stuID, @currentuser.id)
    @appointment.update_attribute(:flag, 'taken')
    @currentuser.update_attribute(:message, 'scheduled');
    if(@appointment.save)
        respond_to do |format|
        format.html { redirect_to :back }
        
        end
    else
        respond_to do |format|
        format.html { redirect_to :back, notice: 'Error in inputs.' }
        
        end
    end
  end
  
  def cancappt
    @currentuser = User.find_by_id(session[:user_id])
    @appointment = Appointment.find_by_stuID(params[:id])
    @appointment.update_attribute(:stuID, -1)
    @appointment.update_attribute(:flag, 'open')
    @currentuser.update_attribute(:message, '')
    if(@appointment.save)
        respond_to do |format|
        format.html { redirect_to :back }
        
        end
    else
        respond_to do |format|
        format.html { redirect_to :back, notice: 'Error in inputs.' }
        
        end
    end
  end
  
  def createAppt
    @month = params[:param1][0..2]
    @day = params[:param1][3..5]
    @year = params[:param1][6..10]
    @hour = params[:param1][11..13]
    @minute = params[:param1][13..15]
    @weeks = params[:param2].to_i
    @ampm = params[:param1][16...17]
 if(params[:param1].length >18)
      @month = params[:param1][0..2]
      @day = params[:param1][3..5]
      @year = params[:param1][6..10]
      @hour = params[:param1][11..13]
      @minute = params[:param1][14..16]
      @weeks = params[:param2].to_i
      @ampm = params[:param1][17...18]
    end
    @currentuser = User.find_by_id(session[:user_id])
    @date = DateTime.new(@year.to_i,@month.to_i,@day.to_i,@hour.to_i,@minute.to_i)
    if @ampm =='P'
      @date = @date + 12.hours
    end
    
    (Appointment.all).each do |appt|
      if DateTime.parse(appt.start) <= @date && DateTime.parse(appt.end) > @date
        respond_to do |format|
        format.html { redirect_to :back, notice: 'Appointments cannot be set to the same time!' }
        
        end
      return
      end
    end
    
    for i in 0..@weeks-1
      Appointment.create(start: @date + i.weeks,stuID: (-1), end: @date + i.weeks + 30.minutes, advID: @currentuser.id, flag: 'open', notes: @ampm)
    end
    redirect_to :back
  end
  # GET /appointments/1
  # GET /appointments/1.json
  def show
  end

  # GET /appointments/new
  def new
    @appointment = Appointment.new
  end

  def setAppt
    @currentuser = User.find_by_id(session[:user_id])
    
    
    @appts = params[:param1]
    @appte = params[:param2]
    
    if(Appointment.count(@currentuser.id) < 1)
      Appointment.create(start: params[:param1], end: params[:param2], stuID: @currentuser.id, advID: User.find_by_name(@currentuser.advisor).id, approved: 'pending' )
      
      respond_to do |format|
        format.html { redirect_to :back }
        format.json { render :json => { :name => @name }}
      end
    else
      @appointment = Appointment.find_by_stuID(@currentuser)
      @appointment.update_attribute(:appts,@appts)
      @appointment.update_attribute(:appte,@appte)
      @appointment.update_attribute(:approved,'pending')
      @appointment.save
      respond_to do |format|
        format.html { redirect_to :back, notice: 'Appointment updated!' }
        format.json { render :json => { :name => @name }}
      end
    end
  end

  # GET /appointments/1/edit
  def edit
  end

  # POST /appointments
  # POST /appointments.json
  def create
    @appointment = Appointment.new(appointment_params)

    respond_to do |format|
      if @appointment.save
        format.html { redirect_to @appointment }
        format.json { render action: 'show', status: :created, location: @appointment }
      else
        format.html { render action: 'new' }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /appointments/1
  # PATCH/PUT /appointments/1.json
  def update
    respond_to do |format|
      if @appointment.update(appointment_params)
        format.html { redirect_to @appointment }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @appointment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /appointments/1
  # DELETE /appointments/1.json
  def destroy
    @appointment.destroy
    respond_to do |format|
      format.html { redirect_to appointments_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_appointment
      @appointment = Appointment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def appointment_params
      params.require(:appointment).permit(:appts, :appte, :advID, :stuID, :approved, :notes)
    end
end
