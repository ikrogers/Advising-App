class AddHoursToCourselists < ActiveRecord::Migration
  def change
    add_column :courselists, :hours, :integer
  end
end
