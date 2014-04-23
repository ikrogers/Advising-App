class CourselistsController < ApplicationController
  layout 'functionalitylayout'
  before_action :set_courselist, only: [:show, :edit, :update, :destroy]

  # GET /courselists
  # GET /courselists.json
  def index
    @courselists = Courselist.all
  end

  # GET /courselists/1
  # GET /courselists/1.json
  def show
  end

  # GET /courselists/new
  def new
    @courselist = Courselist.new
  end

  # GET /courselists/1/edit
  def edit
  end

  # POST /courselists
  # POST /courselists.json
  def create
    @courselist = Courselist.new(courselist_params)

    respond_to do |format|
      if @courselist.save
        format.html { redirect_to courselist }
        format.json { render action: 'show', status: :created, location: @courselist }
      else
        format.html { render action: 'new' }
        format.json { render json: @courselist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /courselists/1
  # PATCH/PUT /courselists/1.json
  def update
    respond_to do |format|
      if @courselist.update(courselist_params)
        format.html { redirect_to @courselist, notice: 'Courselist was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @courselist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /courselists/1
  # DELETE /courselists/1.json
  def destroy
    @courselist.destroy
    respond_to do |format|
      format.html { redirect_to courselists_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_courselist
      @courselist = Courselist.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def courselist_params
      params.require(:courselist).permit(:name, :prereq, :description)
    end
end
