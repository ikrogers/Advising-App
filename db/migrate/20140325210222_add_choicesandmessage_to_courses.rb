class AddChoicesandmessageToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :choices, :integer
    add_column :courses, :message, :string
  end
end
