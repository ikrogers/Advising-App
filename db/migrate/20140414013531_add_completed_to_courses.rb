class AddCompletedToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :completed, :string
  end
end
