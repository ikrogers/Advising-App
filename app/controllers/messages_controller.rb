class MessagesController < ApplicationController
  layout 'functionalitylayout'
  before_action :set_message, only: [:show, :edit, :update, :destroy]

  # GET /messages    <%= f.select :email_provider, options_for_select => Student.find_all(:advisor => @currentuser.name) %>
  # GET /messages.json
  def index
    @currentuser = User.find_by_id(session[:user_id])
    @user = User.find_by_id(params[:to])
  end

  # GET /messages/1
  # GET /messages/1.json
  def show
  end

  # GET /messages/new
  def new
    @message = Message.new
  end

  # GET /messages/1/edit
  def edit
  end

  # POST /messages
  # POST /messages.json
  def create
    @message = Message.new(message_params)
    if !params[:to].nil?
      @message.to = params[:to]
    end
    @currentuser = User.find_by_id(session[:user_id])
    if @currentuser.classification == 'Advisor'
    respond_to do |format|
      if @message.save
        format.html { redirect_to advisor_url, notice: 'Message was successfully created.' }
        format.json { render action: 'show', status: :created, location: @message }
      else
        format.html { render action: 'new' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
    elsif @currentuser.classification == 'Student'
      respond_to do |format|
      if @message.save
        format.html { redirect_to student_url, notice: 'Message was successfully created.' }
        format.json { render action: 'show', status: :created, location: @message }
      else
        format.html { render action: 'new' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
      end
    elsif @currentuser.classification == 'Admin'
      respond_to do |format|
      if @message.save
        format.html { redirect_to admin_url, notice: 'Message was successfully created.' }
        format.json { render action: 'show', status: :created, location: @message }
      else
        format.html { render action: 'new' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
      end
    end
    
  end

  # PATCH/PUT /messages/1
  # PATCH/PUT /messages/1.json
  def update
    @currentuser = User.find_by_id(session[:user_id])
    respond_to do |format|
      
      if @message.update(message_params)
        format.html { redirect_to @message, notice: 'Message was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /messages/1
  # DELETE /messages/1.json
  def destroy
    @message.destroy
    respond_to do |format|
      format.html { redirect_to messages_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_message
      @messages = Message.find_by_to_and_from(params[:to],params[:from])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def message_params
      params.require(:message).permit(:to, :from, :content, :status)
    end
end
