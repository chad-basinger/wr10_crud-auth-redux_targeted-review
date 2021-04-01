select * from silly_joke
where joke_text ('%' + $1 + '%')