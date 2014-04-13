class AddCompletedToUsers < ActiveRecord::Migration
  def change
    add_column :users, :completed, :string
  end
end
