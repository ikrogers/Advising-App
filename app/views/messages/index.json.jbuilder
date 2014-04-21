json.array!(@messages) do |message|
  json.extract! message, :id, :stuID, :advID, :content, :status
  json.url message_url(message, format: :json)
end
