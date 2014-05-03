class Appointment < ActiveRecord::Base
  default_scope order('start ASC')
  belongs_to :user
  
end
