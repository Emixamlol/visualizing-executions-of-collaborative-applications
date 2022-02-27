/*  
    examples taken from d3 tutorial by Academind
    source 1: https://www.youtube.com/watch?v=TOJ9yjvlapY
    source 2: https://www.youtube.com/watch?v=ZOeWdkq-L90
*/

const countryData = {
  items: ['China', 'India', 'USA'],
  addItem(item) {
    this.items.push(item);
  },
  removeItem(item) {
    this.items.splice(item, 1);
  },
  updateItem(index, newItem) {
    this.items[index] = newItem;
  },
};

const countries = d3
  .select('ul')
  .selectAll('li')
  .data(countryData.items, (data) => data)
  .enter()
  .append('li')
  .text((data) => data);

setTimeout(() => {
  countryData.addItem('Germany');
  d3.select('ul')
    .selectAll('li')
    .data(countryData.items, (data) => data)
    .enter()
    .append('li')
    .classed('added', true)
    .text((data) => data);
}, 2000);

setTimeout(() => {
  countryData.removeItem(0);
  d3.select('ul')
    .selectAll('li')
    .data(countryData.items, (data) => data)
    .exit()
    .classed('redundant', true);
}, 4000);

setTimeout(() => {
  countryData.updateItem(1, 'Russia');
  d3.select('ul')
    .selectAll('li')
    .data(countryData.items, (data) => data)
    .exit()
    .classed('updated', true)
    .text('Russia');
}, 6000);
