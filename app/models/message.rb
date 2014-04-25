class Message < ActiveRecord::Base
  default_scope order('created_at ASC')
  belongs_to :user, :class_name => 'User'
end