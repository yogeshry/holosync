import axios from 'axios';

export const fetchCovidData = async () => {
  try {
    const response = await axios.get('https://api.covid19api.com/summary');
    return response.data.Countries.map((country) => ({
      country: country.Country,
      cases: country.TotalConfirmed,
      deaths: country.TotalDeaths,
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
