class AddDataToUser < ActiveRecord::Migration
  def change
    add_column :users, :classification, :string
    add_column :users, :fname, :string
    add_column :users, :mi, :string
    add_column :users, :lname, :string
    add_column :users, :gpa, :decimal
    add_column :users, :advisor, :integer
  end
end
