json.array!(@courselists) do |courselist|
  json.extract! courselist, :id, :name, :prereq, :description
  json.url courselist_url(courselist, format: :json)
end
