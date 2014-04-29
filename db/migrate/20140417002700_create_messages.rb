class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :to
      t.integer :from
      t.text :content
      t.string :status

      t.timestamps
    end
  end
end
