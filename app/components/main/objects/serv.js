var serv = {
  options: [
    {id: '0', title: 'Todos'},
    {id: '1', title: 'Con Autoservicio'}
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