class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.datetime :appts
      t.datetime :appte
      t.integer :advID
      t.integer :stuID
      t.string :approved
      t.string :notes

      t.timestamps
    end
  end
end
