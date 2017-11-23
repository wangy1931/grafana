const cellTpl = `
<%
var attributes = '';
if (timefield) {
  attributes='class="log-table-timefield"';
} else if (sourcefield) {
  attributes='class="log-table-sourcefield"';
} else {
  attributes='class="log-table-datafield"';
}
%>
<td <%= attributes %>>
  <%= formatted %>
</td>
`;

const truncateTpl = `
<div class="truncate-by-height">
  <%= body %>
</div>
`;

const checkboxTpl = `
<td>
  <gf-form-switch class="gf-form" label="" label-class="" checked="row.checked" on-change="selectLog()"></gf-form-switch>
</td>
`;

export default {
  cellTpl: cellTpl,
  truncateTpl: truncateTpl,
  checkboxTpl: checkboxTpl
}
