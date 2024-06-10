import fs from 'node:fs';
import axios from 'axios';

console.log("Writing out...")

fs.readFile('./cards.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  fs.writeFile('./out.txt', '', err => {
    if (err) {
      console.error(err);
    } else {
      console.log("cleared output file...")
    }
  });

  const cards = data.split('\r\n')

  const cardImages = [];

  cards.forEach(card => {
    cardImages.push(`${card}-image`);
  })

  let cardGroups = [];
  //Split the cards into groups of 75
  for (let i=0; i<cards.length; i+=75) {
    cardGroups.push(cards.slice(i, i+75));
  }

  let count = 0;
  cardGroups.forEach(cardGroup => {
    console.log(cardGroup.length);
    count+=cardGroup.length;
  });

  const requests = []
  cardGroups.forEach(group => {
    let req = {};
    let groupMap = group.map(card => {
      return JSON.parse(`{"name": "${card}"}`)
    })
    req.identifiers = groupMap;
    requests.push(req);
  })

  console.log(requests.length);

  requests.forEach(req => {
    axios.post('https://api.scryfall.com/cards/collection', req)
    .then(res => {



      // let json = JSON.parse(res.data);
      res.data.forEach(item => console.log(item))

      fs.appendFile('./out.txt', res, err => {if (err) console.error(err)})

      const data = res.data;
      
      console.log(data);


      
      // data.forEach(card => {
      //   let string = card.image_uris.normal
      //   fs.appendFile('./out.txt', string, err => {if (err) console.error(err)})
      // })
    })
    .catch(err => {
      console.error(err);
    })
  })

})