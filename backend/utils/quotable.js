export const getRandomQuote = async () => {
  try {
    const response = await fetch('https://api.quotable.io/random');
    return await response.json();
  } catch (error) {
    return { content: 'Could not fetch quote at this time.' };
  }
};