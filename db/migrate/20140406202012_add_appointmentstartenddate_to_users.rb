class AddAppointmentstartenddateToUsers < ActiveRecord::Migration
  def change
    add_column :users, :appts, :datetime
    add_column :users, :appte, :datetime
  end
end
