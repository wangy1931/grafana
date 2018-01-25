module.exports = function(config) {

  return {
    src:{
      options: {
        paths: ["<%= srcDir %>/less"],
        yuicompress: true
      },
      files: {
        "<%= genDir %>/css/bootstrap.dark.min.css": "<%= srcDir %>/less/grafana.dark.less",
        "<%= genDir %>/css/bootstrap.light.min.css": "<%= srcDir %>/less/grafana.light.less",
        "<%= genDir %>/css/bootstrap.darkblue.min.css": "<%= srcDir %>/less/grafana.darkblue.less",
        "<%= genDir %>/css/bootstrap.benz.min.css": "<%= srcDir %>/less/grafana.benz.less",
        "<%= genDir %>/css/bootstrap-responsive.min.css": "<%= srcDir %>/less/grafana-responsive.less"
      }
    }
  };
};
