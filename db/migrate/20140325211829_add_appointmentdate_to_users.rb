class AddAppointmentdateToUsers < ActiveRecord::Migration
  def change
    add_column :users, :appointmentDate, :datetime
  end
end
