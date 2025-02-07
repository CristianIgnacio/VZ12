var comb = {
  options: [
    {id: '14', title: 'Gasoline 93'},
    {id: '16', title: 'Gasoline 95'},
    {id: '19', title: 'Gasoline 97'},
    {id: '17', title: 'Vehicle LPG'},
    {id: '18', title: 'GNC'},
    {id: '20', title: 'Kerosene'},
    {id: '15', title: 'Diesel Petroleum'}
  ],
  model: 14,
  array: {
    '14': 'Gasoline 93',
    '15': 'Diesel Petroleum',
    '16': 'Gasoline 95',
    '17': 'Vehicle LPG',
    '18': 'GNC',
    '19': 'Gasoline 97',
    '20': 'Kerosene'
  },
  config: {
    valueField: 'id',
    labelField: 'title',
    delimiter: '|',
    onInitialize: function(selectize) {
    },
    onChange: function(value) {
    },
    maxItems: 1
  }
};

module.exports = comb;