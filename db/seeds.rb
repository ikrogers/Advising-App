# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.create!(name: 'admin', password: 'admin', password_confirmation: 'admin', classification: "Admin")
User.create!(name: 'adv1', password: 'adv1', password_confirmation: 'adv1', classification: "Advisor")
User.create!(name: 'adv2', password: 'adv2', password_confirmation: 'adv2', classification: "Advisor")
User.create!(name: 'student1', password: 'student1', password_confirmation: 'student1', classification: "Student", advisor: "adv1")
User.create!(name: 'student2', password: 'student2', password_confirmation: 'student2', classification: "Student", advisor: "adv1")
User.create!(name: 'student3', password: 'student3', password_confirmation: 'student3', classification: "Student", advisor: "adv2")
User.create!(name: 'student4', password: 'student4', password_confirmation: 'student4', classification: "Student", advisor: "adv2")





Course.create!(name: "CS1010", hours: 4, studentid: 4)
Course.create!(name: "CS1301", hours: 4, studentid: 4)
Course.create!(name: "CS1302", hours: 4, prereq: "CS1301", studentid: 4)
Course.create!(name: "CS12312", hours: 4, prereq: "CS1302", studentid: 5)
Course.create!(name: "CS123123", hours: 4, prereq: "CSasda1302", studentid: 5)
Course.create!(name: "CS1231231", hours: 4, prereq: "Czxc02", studentid: 5)
Course.create!(name: "CS2zxczxcz", hours: 4, prereq: "Czxc02", studentid: 6)
Course.create!(name: "CSzxczxczxczx", hours: 4, prereq: "CS1302", studentid: 6)
Course.create!(name: "CSzcxcz", hours: 4, prereq: "CS1302", studentid: 7)
Course.create!(name: "CS26zxczxczxc", hours: 4, prereq: "Cegsdf02", studentid: 7)
Course.create!(name: "CSzxczxc620", hours: 4, prereq: "CS1dfg02", studentid: 7)
Course.create!(name: "Czxc20", hours: 4, prereq: "CSdfg2", studentid: 6)



