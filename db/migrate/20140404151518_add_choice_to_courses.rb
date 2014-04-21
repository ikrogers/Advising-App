class AddChoiceToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :choice, :integer
  end
end
