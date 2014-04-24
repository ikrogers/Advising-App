json.array!(@appointments) do |appointment|
  json.extract! appointment, :id, :appts, :appte, :advID, :stuID, :approved, :notes
  json.url appointment_url(appointment, format: :json)
end
