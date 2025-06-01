async function fetchData(link) {
    const response = await fetch(link);
    const data = await response.json();
     return data;
}

export const NY3LIVE_link = 'https://data.ny.gov/resource/hsys-3def.json?$select=draw_date,evening_daily,midday_daily&$limit=17000'

export const NY3LIVE = fetchData(NY3LIVE_link)

