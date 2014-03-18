class User < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true
  has_secure_password
    USER_TYPES = ["Student", "Advisor"]
end
