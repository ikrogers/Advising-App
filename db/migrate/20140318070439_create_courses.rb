class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :name
      t.integer :hours
      t.string :prereq

      t.timestamps
    end
  end
end
