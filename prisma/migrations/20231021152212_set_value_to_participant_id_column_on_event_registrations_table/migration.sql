UPDATE event_registrations 
SET participant_id = participants.id 
FROM participants 
WHERE event_registrations.user_id = participants.user_id;