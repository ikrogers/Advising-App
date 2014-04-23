class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :stuID
      t.integer :advID
      t.text :content
      t.string :status

      t.timestamps
    end
  end
end
