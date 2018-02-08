module.exports = function(config) {
  return {
    src: [
      'Gruntfile.js',
      '<%= srcDir %>/app/**/*.js',
      '<%= srcDir %>/plugin/**/*.js',
      '!<%= srcDir %>/app/dashboards/*'
    ],
    options: {
      config: ".jscs.json",
    },
  };
};