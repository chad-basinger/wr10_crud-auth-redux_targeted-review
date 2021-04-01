update silly_joke
set joke_text = $2
WHERE joke_id = $1
returning *;