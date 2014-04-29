class CreateAppointments < ActiveRecord::Migration
  def change
    create_table :appointments do |t|
      t.string :start
      t.string :end
      t.integer :advID
      t.integer :stuID
      t.string :flag
      t.string :notes

      t.timestamps
    end
  end
end
