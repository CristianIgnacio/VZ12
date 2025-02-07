var divpol = {
  options: [
    {id: 'regiones', title: 'Regiones'},
    {id: 'provincias', title: 'Provincias'},
    {id: 'comunas', title: 'Comunas'},
  ],
  model: 'regiones',
  maps: {
    regiones: 'img/mapa_de_chile_regiones.min.svg',
    provincias: 'img/mapa_de_chile_provincias.min.svg',
    comunas: 'img/mapa_de_chile_comunas.min.svg',
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

module.exports = divpol;