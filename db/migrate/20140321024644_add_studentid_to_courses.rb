class AddStudentidToCourses < ActiveRecord::Migration
  def change
    add_column :courses, :studentid, :integer
  end
end
