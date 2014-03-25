class AddAppointmentdateToUsers < ActiveRecord::Migration
  def change
    add_column :users, :appointmentDate, :string
  end
end
