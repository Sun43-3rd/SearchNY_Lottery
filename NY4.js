async function fetchData(link) {
    const response = await fetch(link);
    const data = await response.json();
     return data;
}

export const NY4LIVE_link = 'https://data.ny.gov/resource/hsys-3def.json?$select=draw_date,evening_win_4,midday_win_4&$limit=17000'

export const NY4LIVE = fetchData(NY4LIVE_link)


  

