var serv = {
  options: [
    {id: '0', title: 'All'},
    {id: '1', title: 'With Selfservice'}
  ],
  model: 0,
  config: {
    valueField: 'id',
    labelField: 'title',
    delimiter: '|',
    onInitialize: function(selectize) {
    },
    onChange: function() {
    },
    maxItems: 1
  }
};

module.exports = serv;