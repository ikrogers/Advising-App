class User < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  has_secure_password
    USER_TYPES = ["Student", "Advisor"]
    has_many :courses, :dependent => :destroy
    has_many :appointments, :foreign_key => 'stuID', :foreign_key => 'advID', :dependent => :destroy
    has_many :messages, :foreign_key => 'stuID', :foreign_key => 'advID', :dependent => :destroy
end
