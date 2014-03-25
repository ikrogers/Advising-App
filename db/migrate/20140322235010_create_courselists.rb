class CreateCourselists < ActiveRecord::Migration
  def change
    create_table :courselists do |t|
      t.string :name
      t.string :prereq
      t.string :description
    end
  end
end
