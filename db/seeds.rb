# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.create!(name: 'admin', password: 'admin', password_confirmation: 'admin', classification: "Admin")
User.create!(name: 'dgibson', password: 'dgibson', password_confirmation: 'dgibson', classification: "Advisor")
User.create!(name: 'sgoel', password: 'sgoel', password_confirmation: 'sgoel', classification: "Advisor")
User.create!(name: 'irogers', password: 'irogers', password_confirmation: 'irogers', classification: "Student", advisor: "sgoel", flag: "false")
User.create!(name: 'ddemerrit', password: 'ddemerrit', password_confirmation: 'ddemerrit', classification: "Student", advisor: "sgoel", flag: "false")
User.create!(name: 'wcassady', password: 'wcassady', password_confirmation: 'wcassady', classification: "Student", advisor: "dgibson", flag: "true")
User.create!(name: 'rjenkins', password: 'rjenkins', password_confirmation: 'rjenkins', classification: "Student", advisor: "dgibson", flag: "false")

#default course.  DO NOT REMOVE!
Course.create!(name: "CS000", hours: 0, studentid: -1)

#Course.create!(name: "CS1010", hours: 4, studentid: 4)
#Course.create!(name: "CS1301", hours: 4, studentid: 4)
#Course.create!(name: "CS1302", hours: 4, prereq: "CS1301", studentid: 4)
#Course.create!(name: "CS12312", hours: 4, prereq: "CS1302", studentid: 5)
#Course.create!(name: "CS123123", hours: 4, prereq: "CSasda1302", studentid: 5)
#Course.create!(name: "CS1231231", hours: 4, prereq: "Czxc02", studentid: 5)
#Course.create!(name: "CS2zxczxcz", hours: 4, prereq: "Czxc02", studentid: 6)
#Course.create!(name: "CSzxczxczxczx", hours: 4, prereq: "CS1302", studentid: 6)
#Course.create!(name: "CSzcxcz", hours: 4, prereq: "CS1302", studentid: 7)
#Course.create!(name: "CS26zxczxczxc", hours: 4, prereq: "Cegsdf02", studentid: 7)
#Course.create!(name: "CSzxczxc620", hours: 4, prereq: "CS1dfg02", studentid: 7)
#Course.create!(name: "Czxc20", hours: 4, prereq: "CSdfg2", studentid: 6)

Course.create!(name: "CS1301", hours: 4, studentid: 4)
Course.create!(name: "CS1302", hours: 4, studentid: 4)
Course.create!(name: "CS2800", hours: 4, studentid: 4, choice: 4)
Course.create!(name: "CS1301", hours: 4, studentid: 5)
Course.create!(name: "CS1302", hours: 4, studentid: 5)
Course.create!(name: "CS2800", hours: 4, studentid: 5)
Course.create!(name: "CS1301", hours: 4, studentid: 6)
Course.create!(name: "CS1302", hours: 4, studentid: 6)
Course.create!(name: "CS1010", hours: 4, studentid: 7)
Course.create!(name: "CS1301", hours: 4, studentid: 7)
Course.create!(name: "CS1302", hours: 4, studentid: 7)
Course.create!(name: "CS2800", hours: 4, studentid: 6)

Message.create!(stuID: 4, advID: 3, content: "test message" )

Courselist.create!(name: "CS1010", description: "Algorithmic Problem Solving", hours: 4)
Courselist.create!(name: "CS1301", description: "Principles of Programming 1", hours: 4)
Courselist.create!(name: "CS2800", description: "Computer Ethics", hours: 3)
Courselist.create!(name: "M1111", description: "College Algebra", hours: 4)
Courselist.create!(name: "M1112", prereq: "M1111", description: "Trigonometry", hours: 4)
Courselist.create!(name: "M1113", description: "Precalculus", hours: 4)
Courselist.create!(name: "M2261", prereq: "M1113", description: "Analytic Geometry and Calculus", hours: 4)
Courselist.create!(name: "M2262", prereq: "M2261", description: "Analytic Geometry and Calculus 2", hours: 4)
Courselist.create!(name: "CS1302", prereq: "CS1301", description: "Principles of Programming 2", hours: 4)
Courselist.create!(name: "CS2620", prereq: "M1113", description: "Discrete Structures", hours: 3)
Courselist.create!(name: "CS3335",prereq: "CS2620", description: "The C Programming Language", hours: 3)
Courselist.create!(name: "M2150", prereq: "M2261", description: "Introduction to Linear Algebra", hours: 3)
Courselist.create!(name: "CS3410", prereq: "CS2620", description: "Data Structures", hours: 3)
Courselist.create!(name: "CS3300", prereq: "CS1302", description: "UNIX Programming", hours: 3)
Courselist.create!(name: "CS3340", prereq: "CS1302", description: "Web Programming 1", hours: 3)
Courselist.create!(name: "CS3700", prereq: "CS1302", description: "Introduction to E-Commerce", hours: 3)
Courselist.create!(name: "CS3101", prereq: "CS1302", description: "Computer Organization", hours: 3)
Courselist.create!(name: "CS3520", prereq: "CS3410", description: "Algorithms", hours: 3)
Courselist.create!(name: "CS4345", prereq: "CS3101", description: "Operating Systems", hours: 3)
Courselist.create!(name: "CS4900", prereq: "CS3101", description: "Senior Seminar", hours: 3)
Courselist.create!(name: "CS4121", prereq: "CS3410", description: "Data Communications and Networks 1", hours: 3)
Courselist.create!(name: "CS4321", prereq: "CS3410", description: "Software Engineering 1", hours: 3)
Courselist.create!(name: "CS4721", prereq: "CS3410", description: "Database Design 1", hours: 3)
Courselist.create!(name: "CS4500", prereq: "CS3410", description: "Formal Languages and Automa Theory", hours: 3)
Courselist.create!(name: "CS4330", prereq: "CS3410", description: "Theory of Programming Language", hours: 3)
Courselist.create!(name: "CS4700", prereq: "CS3410", description: "E-Commerce Design", hours: 3)
Courselist.create!(name: "CS4820", prereq: "CS3335", description: "Artificial Intelligence", hours: 3)
Courselist.create!(name: "CS4340", prereq: "CS3335", description: "Systems Programming", hours: 3)
Courselist.create!(name: "CS4830", prereq: "CS3335", description: "Computer Graphics", hours: 3)
Courselist.create!(name: "CS4835", prereq: "CS3335", description: "Parallel Programming", hours: 3)
Courselist.create!(name: "CS4122", prereq: "CS4121", description: "Data Communications and Networks 2", hours: 3)
Courselist.create!(name: "CS4322", prereq: "CS4321", description: "Software Engineering 2", hours: 3)
Courselist.create!(name: "CS4722", prereq: "CS4721", description: "Database Design 2", hours: 3)
Courselist.create!(name: "M4901", prereq: "M2150", description: "Operations Research 1", hours: 3)
Courselist.create!(name: "M4651", prereq: "M2262", description: "Numerical Analysis 1", hours: 3)
Courselist.create!(name: "M3600", prereq: "M2262", description: "Probability and Statistics", hours: 3)

