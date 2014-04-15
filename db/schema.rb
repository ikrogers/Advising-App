# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

<<<<<<< HEAD
ActiveRecord::Schema.define(version: 20140414013531) do
=======
ActiveRecord::Schema.define(version: 20140406202012) do
>>>>>>> dc3f9b068e5c1c3978f12d263fc052f6f9a169f8

  create_table "courselists", force: true do |t|
    t.string  "name"
    t.string  "prereq"
    t.string  "description"
    t.integer "hours"
  end

  create_table "courses", force: true do |t|
    t.string   "name"
    t.integer  "hours"
    t.string   "prereq"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "studentid"
    t.integer  "choice"
<<<<<<< HEAD
    t.string   "completed"
=======
>>>>>>> dc3f9b068e5c1c3978f12d263fc052f6f9a169f8
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "password_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "classification"
    t.string   "fname"
    t.string   "mi"
    t.string   "lname"
    t.decimal  "gpa"
    t.string   "advisor"
    t.string   "message"
    t.string   "flag"
    t.datetime "appts"
    t.datetime "appte"
  end

end
