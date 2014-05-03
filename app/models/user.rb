class User < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  default_scope order('flag ASC')
  has_secure_password
    USER_TYPES = ["Student", "Advisor"]
    has_many :courses, :dependent => :delete_all
    has_many :appointments, :foreign_key => 'stuID', :foreign_key => 'advID', :dependent => :delete_all
    has_many :messages, :foreign_key => 'to', :foreign_key => 'from', :dependent => :delete_all
end
