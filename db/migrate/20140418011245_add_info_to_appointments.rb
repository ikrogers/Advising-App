class AddInfoToAppointments < ActiveRecord::Migration
  def change
    add_column :appointments, :title, :string
    add_column :appointments, :url, :string
    add_column :appointments, :class, :string
    add_column :appointments, :start, :string
    add_column :appointments, :end, :string
  end
end
