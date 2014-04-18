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

ActiveRecord::Schema.define(version: 20140418011245) do

  create_table "appointments", force: true do |t|
    t.datetime "appts"
    t.datetime "appte"
    t.integer  "advID"
    t.integer  "stuID"
    t.string   "approved"
    t.string   "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.string   "url"
    t.string   "class"
    t.string   "start"
    t.string   "end"
  end

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
    t.string   "completed"
  end

  create_table "messages", force: true do |t|
    t.integer  "stuID"
    t.integer  "advID"
    t.text     "content"
    t.string   "status"
    t.datetime "created_at"
    t.datetime "updated_at"
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
