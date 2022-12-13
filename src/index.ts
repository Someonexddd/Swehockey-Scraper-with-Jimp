import * as readline from 'readline';
import request from 'request-promise-native';
import * as cheerio from 'cheerio';
import Jimp from 'jimp';

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const image = await Jimp.read('existing-image.png');
const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

// Define the previous values as null
let previousHomeShots = null;
let previousGuestShots = null;
let previousHomeSaves = null;
let previousGuestSaves = null;
let previousHomePIM = null;
let previousGuestPIM = null;
let previousHomePP = null;
let previousGuestPP = null;

// Ask the user for the gameId
rl.question('Enter the gameId: ', (gameId) => {
  // Construct the URL from the gameId
  const url = `https://stats.swehockey.se/Game/LineUps/${gameId}`;

  // Define the scrapeWebsite function
  function scrapeWebsite() {
    // Make an HTTP GET request to the website
    request.get(url).then((html) => {
      // Load the HTML into Cheerio
      const $ = cheerio.load(html);

      // Create an empty array to store the data from the <strong> elements
      const data = [];

      // Select all <strong> elements on the page
      const elements = $('strong');

      // For each element, add its text to the array
      elements.each((_, element) => {
        data.push($(element).text());
      });

      const homeShots: Number = data[0];
      const guestShots: Number = data[1];
      const homeSaves: Number = data[2];
      const guestSaves: Number = data[3];
      const homePIM: Number = data[4];
      const guestPIM: Number = data[5];
      const homePP: Number = data[6]
      const guestPP: Number = data[7]

      // Check if the values have changed before creating a new image
      if (
        homeShots !== previousHomeShots ||
        guestShots !== previousGuestShots ||
        homeSaves !== previousHomeSaves ||
        guestSaves !== previousGuestSaves ||
        homePIM !== previousHomePIM ||
        guestPIM !== previousGuestPIM ||
        homePP !== previousHomePP ||
        guestPP !== previousGuestPP
      ) {
        image.print(font, 750, 100, homeShots.toString());
        image.print(font, 950, 100, guestShots.toString());
        image.print(font, 750, 200, homeSaves.toString());
        image.print(font, 950, 200, guestSaves.toString());
        image.print(font, 750, 300, homePIM.toString());
        image.print(font, 950, 300, guestPIM.toString());
        image.print(font, 730, 500, homePP.toString());
        image.print(font, 930, 500, guestPP.toString());

        image.writeAsync('modified-image.png');

        // Update the previous values
        previousHomeShots = homeShots;
        previousGuestShots = guestShots
        previousHomeSaves = homeSaves;
        previousGuestSaves = guestSaves;
        previousHomePIM = homePIM;
        previousGuestPIM = guestPIM;
        previousHomePP = homePP;
        previousGuestPP = guestPP;
      }
      else {

      }

      console.log(homeShots, guestShots, homeSaves, guestSaves, homePIM, guestPIM, homePP, guestPP);
    });
  }

  // Run the scrapeWebsite function every 30 seconds
  setInterval(scrapeWebsite, 30 * 1000);
});
