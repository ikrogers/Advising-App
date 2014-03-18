# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.create!(name: 'admin', password: 'admin', password_confirmation: 'admin', classification: "Admin")
Course.create!(name: "CS1010", hours: 4)
Course.create!(name: "CS1301", hours: 4)
Course.create!(name: "CS1302", hours: 4, prereq: "CS1301")
Course.create!(name: "CS2620", hours: 4, prereq: "CS1302")
