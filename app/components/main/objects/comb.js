var comb = {
  options: [
    {id: '14', title: 'Gasolina 93'},
    {id: '16', title: 'Gasolina 95'},
    {id: '19', title: 'Gasolina 97'},
    {id: '17', title: 'GLP Vehicular'},
    {id: '18', title: 'GNC'},
    {id: '20', title: 'Kerosene'},
    {id: '15', title: 'Petróleo Diesel'}
  ],
  model: 14,
  array: {
    '14': 'Gasolina 93',
    '15': 'Petróleo Diesel',
    '16': 'Gasolina 95',
    '17': 'GLP Vehicular',
    '18': 'GNC',
    '19': 'Gasolina 97',
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